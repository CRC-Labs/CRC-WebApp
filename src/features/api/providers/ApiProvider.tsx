/* eslint-disable prettier/prettier */
/**
 * ApiProvider.tsx - Central API Management Component
 *
 * The `ApiProvider` component serves as the core of API management within the application.
 * It handles user authentication, chess-related operations, and Apollo Client setup for
 * GraphQL API requests. By encapsulating these functionalities, it provides a seamless
 * interface for other components to interact with backend services without the need for
 * complex integration logic. This centralization promotes maintainability, as changes
 * in API endpoints or authentication mechanisms can be managed in one place.
 *
 * Core Objectives:
 * 1. Authentication Management: Handles user authentication, including sign-in and sign-out.
 * 2. Chess API Operations: Provides functions for managing chess repertoires, such as listing,
 *    creating, reading, updating, and deleting repertoires. These operations interact with a
 *    backend API.
 * 3. Context Management: Utilizes React's context API to create an `apiContext` that holds
 *    authentication and chess-related functions. This context can be consumed by other
 *    components within the application.
 * 4. Apollo Client Initialization: Sets up an Apollo Client for making GraphQL API requests,
 *    including configuring appropriate links (HTTP and WebSocket) and headers (authentication
 *    tokens).
 * 5. Loading Screen Display: Displays a loading screen while the Apollo Client is being
 *    initialized, indicating that the API client is still loading.
 *
 * @version 1.0.0
 * @date April 30, 2023
 * @author [Jérémy Guillemot]
 */

// Import necessary React modules and dependencies.
import React, { useState, useContext, useEffect } from "react"

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  concat,
  split,
  ApolloLink,
  gql,
  DefaultOptions,
} from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { onError } from "@apollo/client/link/error"
import { getMainDefinition } from "@apollo/client/utilities"
import getConfig from "next/config"

// Import Modules and useAppContext from AppContextProvider.
import LoadingScreenWithoutLayout from "@/features/common/components/LoadingScreenWithoutLayout"
import {
  ChessRepertoirePositionUpdate,
  ChessRepertoire,
  ChessRepertoirePositionUpdateAction,
} from "../../../types/Repertoire"
import { Store } from "react-notifications-component"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"

// Define interfaces for authentication and chess API context.
interface AuthApiContextInterface {
  signOut: Function
}
interface ChessApiContextInterface {
  listRepertoires: Function
  createRepertoire: (repertoire: any) => Promise<any>
  readRepertoire: (repertoireId: string) => Promise<any>
  updateRepertoirePositions: (
    repertoireId: string,
    repertoirePositionsUpdate: ChessRepertoirePositionUpdate[],
  ) => Promise<any>
  deleteRepertoire: (repertoireId: string) => Promise<any>
  renameRepertoire: (repertoireId: string, newName: string) => Promise<any>
}

// Define the main context interface including authentication and chess API functions.
interface ApiContextInterface {
  auth: AuthApiContextInterface
  chessApi: ChessApiContextInterface
  isClientInitializing: boolean
}

// Define GraphQL query to get user information.
const GetUserInfo = gql`
  query GetUserInfoQuery {
    getUserInfo {
      id
      name
    }
  }
`

// Create a context for API functions.
const apiContext = React.createContext<ApiContextInterface | null>(null)

// Retrieve public runtime configuration for the application.
const { publicRuntimeConfig } = getConfig()

// Beginning of the ApiProvider component in ApiProvider.tsx file.

export default function ApiProvider({ children }) {
  // State variables for authentication token, current module, Apollo client, and authentication status.
  const [client, setClient] = useState(null) // Apollo Client instance for GraphQL operations.
  const { authenticationState, setAuthenticationState } =
    useAuthenticationState()
  const [isClientInitializing, setIsClientInitializing] = useState(true)

  useEffect(() => {
    setIsClientInitializing(true)
    let newClient
    if (!authenticationState.authToken) {
      newClient = createApolloClient(null)
    } else {
      newClient = createApolloClient(authenticationState.authToken)
    }
    // Create a new Apollo client with the current token
    setClient(newClient)

    // If we have a token but we're not authenticated yet, verify the token
    if (authenticationState.authToken && !authenticationState.isAuthenticated) {
      newClient
        .query({ query: GetUserInfo, fetchPolicy: "network-only" })
        .then((result) => {
          const { errors } = result
          if (errors?.length > 0) {
            let e = errors[0]
            // Handle specific errors (e.g., 401, 404) and sign out if necessary
            if (e.message.startsWith("Error 401")) {
              setAuthenticationState({
                isAuthenticated: false,
                authToken: "",
                isInitializing: false,
              })
              Store.addNotification({
                title: "Disconnected from session",
                message: "You have been disconnected from session",
                type: "danger",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true,
                },
              })
              // reject(e)
            }
          }
          if (result.data?.getUserInfo) {
            setAuthenticationState({
              authToken: authenticationState.authToken,
              isAuthenticated: true,
              isInitializing: false,
            })
          }
        })
        .catch((error) => {
          // Handle errors
        })
        .finally(() => {
          setIsClientInitializing(false)
        })
    } else {
      setIsClientInitializing(false)
    }
  }, [authenticationState.authToken]) // Only depend on token changes

  // Function to create Apollo client for both HTTP and WebSocket connections.
  function createApolloClient(token) {
    // Determine HTTP and WebSocket protocols based on API_TLS configuration.
    var httpProtocol = "http://"
    var wsProtocol = "ws://"

    if (publicRuntimeConfig.API_TLS === "true") {
      httpProtocol = "https://"
      wsProtocol = "wss://"
    }

    // Create HTTP link for GraphQL queries and mutations.
    const httpLink = new HttpLink({
      uri: httpProtocol + publicRuntimeConfig.API_HOST,
    })

    // Create WebSocket link for GraphQL subscriptions.
    const wsLink = new WebSocketLink({
      uri: wsProtocol + publicRuntimeConfig.API_HOST,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: token,
        },
      },
    })

    // Split link based on operation type (query, mutation, or subscription).
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      wsLink,
      httpLink,
    )

    // Middleware to add authorization token to GraphQL headers and measure response time.
    const authMiddleware = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => {
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`, // Add the token to authorization header.
            Timestamp: Date.now(), // Add timestamp for response time measurement.
          },
        }
      })

      return forward(operation).map((response) => {
        const context = operation.getContext()

        let ms = Date.now() - context.headers.Timestamp
        localStorage.setItem("ms", ms.toString()) // Store response time in local storage.

        return response
      })
    })

    // Default options for Apollo Client queries and mutations.
    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    }

    // Create and return Apollo Client instance with middleware, links, cache, and default options.
    return new ApolloClient({
      link: concat(errorLink, concat(authMiddleware, splitLink)), // Combine error, auth, and split links.
      cache: new InMemoryCache(), // In-memory cache for caching query results.
      defaultOptions: defaultOptions, // Set default options for queries and mutations.
      credentials: "include", // Include credentials for CORS support.
    })
  }

  // Create error handling link
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        // Check for 401 errors
        if (message.startsWith("Error 401")) {
          // Only show notification if user was previously authenticated
          if (authenticationState.isAuthenticated) {
            Store.addNotification({
              title: "Session Expired",
              message: "Your session has expired. Please log in again.",
              type: "danger",
              insert: "bottom",
              container: "bottom-center",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            })
          }

          // Update authentication state
          setAuthenticationState({
            isAuthenticated: false,
            authToken: "",
            isInitializing: false,
          })
        }
      })
    }
  })

  // Function to handle user sign-out.
  const signOut = async () => {
    const LogoutMutation = gql`
      mutation LogoutMutation {
        logout
      }
    `

    try {
      // Send logout mutation to invalidate the session.
      const result = await client.mutate({
        mutation: LogoutMutation,
      })

      if (result?.data?.logout) {
        // If logout successful, remove authentication token and set isAuthenticated to false.
        setAuthenticationState({
          isAuthenticated: false,
          authToken: "",
          isInitializing: false,
        })
      }
    } catch (e) {
      if (e.message.endsWith("401: Unauthorized")) {
        // If unauthorized error, remove authentication token and set isAuthenticated to false.
        setAuthenticationState({
          isAuthenticated: false,
          authToken: "",
          isInitializing: false,
        })
        return
      }
      return e // Return any other errors that occur during the logout process.
    }
  }

  const listRepertoires = async () => {
    // Define the GraphQL query
    const ListRepertoires = gql`
      query ListRepertoires {
        listRepertoires {
          id
          name
          color
          startingPosition
          lastModification
        }
      }
    `

    // Perform the GraphQL query with network-only fetch policy
    return new Promise((resolve, reject) => {
      client
        .query({ query: ListRepertoires, fetchPolicy: "network-only" })
        .then((result) => {
          const { errors } = result
          if (errors?.length > 0) {
            let e = errors[0]
            // Handle specific errors (e.g., 401, 404) and sign out if necessary
            if (e.message.startsWith("Error 401")) {
              Store.addNotification({
                title: "Disconnected from session",
                message: "You have been disconnected from session",
                type: "danger",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true,
                },
              })
              // reject(e)
            }
          }
          // Resolve the result if successful
          resolve(result)
        })
        .catch((error) => {
          // Reject with the error if there was a network or other error
          reject(error)
        })
    })
  }

  const createRepertoire = async (repertoire: ChessRepertoire) => {
    // Create an AbortController for handling request cancellation
    const controller = new window.AbortController()

    if (repertoire.positions.size > 0) {
      // If there are positions in the repertoire, prepare position updates
      let positions: ChessRepertoirePositionUpdate[] = []
      repertoire.positions.forEach((pos) => {
        let up: ChessRepertoirePositionUpdate = {
          action: ChessRepertoirePositionUpdateAction.CREATE,
          id: pos.id,
          moves: Array.from(pos.moves.values()),
        }
        positions.push(up)
      })

      // Remove positions property from the repertoire object
      delete repertoire["positions"]

      // GraphQL mutation to create repertoire with positions
      const CreateRepertoireWithPositions = gql`
        mutation CreateRepertoireWithPositions(
          $repertoire: NewChessRepertoire!
          $positions: [ChessRepertoirePositionUpdate]!
        ) {
          createRepertoireWithPositions(
            repertoire: $repertoire
            positions: $positions
          ) {
            id
            name
            lastModification
          }
        }
      `

      // Perform the GraphQL mutation with specified variables and options
      return [
        client.mutate({
          mutation: CreateRepertoireWithPositions,
          variables: { repertoire, positions },
          context: {
            fetchOptions: { signal: controller.signal }, // Use AbortController's signal for request cancellation
            queryDeduplication: false, // Disable query deduplication
          },
        }),
        controller, // Return the AbortController for potential cancellation
      ]
    } else {
      // If no positions, remove positions property from the repertoire object
      delete repertoire["positions"]

      // GraphQL mutation to create repertoire without positions
      const CreateRepertoire = gql`
        mutation CreateRepertoire($repertoire: NewChessRepertoire!) {
          createRepertoire(repertoire: $repertoire) {
            id
            name
            lastModification
          }
        }
      `

      // Perform the GraphQL mutation with specified variables and options
      return [
        client.mutate({
          mutation: CreateRepertoire,
          variables: { repertoire },
          context: {
            fetchOptions: { signal: controller.signal }, // Use AbortController's signal for request cancellation
            queryDeduplication: false, // Disable query deduplication
          },
        }),
        controller, // Return the AbortController for potential cancellation
      ]
    }
  }

  const readRepertoire = async (repertoireId: string) => {
    // GraphQL query to read repertoire details based on the provided ID
    const ReadRepertoire = gql`
      query ReadRepertoire($repertoireId: ID!) {
        readRepertoire(repertoireId: $repertoireId) {
          id
          name
          color
          startingPosition
          positions {
            id
            moves {
              color
              from
              to
              flags
              piece
              san
              nextFen
            }
            fullmoveNumber
          }
          lastModification
        }
      }
    `

    // Perform the GraphQL query with specified variables
    return client.query({
      query: ReadRepertoire,
      variables: { repertoireId },
    })
  }

  const updateRepertoirePositions = async (
    repertoireId: string,
    positions: ChessRepertoirePositionUpdate[],
  ) => {
    // GraphQL mutation to update positions of a repertoire based on repertoireId
    const UpdateRepertoirePositions = gql`
      mutation UpdateRepertoirePositions(
        $repertoireId: ID!
        $positions: [ChessRepertoirePositionUpdate]!
      ) {
        updateRepertoirePositions(
          repertoireId: $repertoireId
          positions: $positions
        )
      }
    `

    // Perform the GraphQL mutation to update repertoire positions
    return client.mutate({
      mutation: UpdateRepertoirePositions,
      variables: { repertoireId, positions },
    })
  }

  // Function to delete a repertoire based on the provided repertoireId
  const deleteRepertoire = async (repertoireId: string) => {
    // GraphQL mutation to delete a repertoire by repertoireId
    const DeleteRepertoire = gql`
      mutation DeleteRepertoire($repertoireId: ID!) {
        deleteRepertoire(repertoireId: $repertoireId)
      }
    `

    // Perform the GraphQL mutation to delete the repertoire
    return client.mutate({
      mutation: DeleteRepertoire,
      variables: { repertoireId },
    })
  }

  // Function to rename a repertoire based on the provided repertoireId and newName
  const renameRepertoire = async (repertoireId: string, newName: string) => {
    // GraphQL mutation to rename a repertoire by repertoireId and newName
    const RenameRepertoire = gql`
      mutation RenameRepertoire($repertoireId: ID!, $newName: String!) {
        renameRepertoire(repertoireId: $repertoireId, newName: $newName) {
          id
          name
          lastModification
        }
      }
    `

    // Perform the GraphQL mutation to rename the repertoire
    return client.mutate({
      mutation: RenameRepertoire,
      variables: { repertoireId, newName },
    })
  }

  // Return statement that conditionally renders components based on the client's availability
  return (
    <>
      {/* Check if the Apollo Client is still loading */}
      {client === null ? (
        // If the client is still loading, display a loading screen without layout
        <LoadingScreenWithoutLayout message="Loading Api Client..." />
      ) : (
        // If the client has loaded, provide the API context and Apollo Client to the components
        <apiContext.Provider
          value={{
            auth: {
              signOut, // Function to handle user sign out
            },
            chessApi: {
              listRepertoires, // Function to list chess repertoires
              createRepertoire, // Function to create a new chess repertoire
              readRepertoire, // Function to read a specific chess repertoire
              updateRepertoirePositions, // Function to update repertoire positions
              deleteRepertoire, // Function to delete a chess repertoire
              renameRepertoire, // Function to rename a chess repertoire
            },
            isClientInitializing,
          }}
        >
          {/* Provide the Apollo Client to the components using ApolloProvider */}
          <ApolloProvider client={client}>
            {/* Render child components */}
            {children}
          </ApolloProvider>
        </apiContext.Provider>
      )}
    </>
  )
}

export const useApi = () => {
  return useContext(apiContext)
}
