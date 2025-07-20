import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"

import { isSanitizedFen, sanitizeFen } from "@/features/common/utils/utils"
import { useApi } from "@/features/api/providers/ApiProvider"
import { ApolloError } from "@apollo/client"
import { Pgn } from "cm-pgn"
import { Store } from "react-notifications-component"
import { ChessMove } from "../../../types/ChessMove"
import { ChessPosition } from "../../../types/ChessPosition"
import {
  ChessRepertoire,
  RepertoireStateAction,
  RepertoireSyncStatus,
  ChessRepertoirePositionUpdate,
  ChessRepertoirePositionUpdateAction,
} from "../../../types/Repertoire"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"
import { useRepertoireStoreProvider } from "../providers/RepertoireStoreProvider"

export function useRepertoireStoreOperations() {
  const {
    demoRepertoires,
    repertoiresFromObjectStore,
    repertoires,
    setRepertoires,
    db,
    saveRepertoireInObjectStore,
  } = useRepertoireStoreProvider()
  const { repertoire } = useRepertoireProvider()
  const { chessApi } = useApi()
  const { authenticationState } = useAuthenticationState()

  /**
   * A function to update a repertoire in the `repertoires` object store of the indexedDB database.
   *
   * @param repertoire The `ChessRepertoire` object to update in the `repertoires` object store.
   */
  function updateRepertoireInObjectStore(repertoire) {
    // Create a new transaction with the `repertoires` object store in "readwrite" mode
    var request = db.current
      .transaction(["repertoires"], "readwrite")
      .objectStore("repertoires")
      .put(repertoire)

    // Set up an event handler for the request
    request.onsuccess = (event) => {}
  }
  /**
   * A function to delete a repertoire from the `repertoires` object store of the indexedDB database.
   *
   * @param repertoireId The ID of the `ChessRepertoire` object to delete from the `repertoires` object store.
   */
  function deleteRepertoireFromObjectStore(repertoireId, onSuccess = () => {}) {
    // Create a new transaction with the `repertoires` object store in "readwrite" mode
    var request = db.current
      .transaction(["repertoires"], "readwrite")
      .objectStore("repertoires")
      .delete(repertoireId)

    // Set up an event handler for the request
    request.onsuccess = (event) => {
      onSuccess()
    }
  }

  // Define a function to save an imported repertoire
  function saveImportedRepertoire(repertoire) {
    saveRepertoireInObjectStore(repertoire).then(() => {
      repertoires.set(repertoire.id, repertoire)
      setRepertoires(new Map<string, ChessRepertoire>(repertoires))
    })
  }

  /**
   * Creates a new repertoire on the server and updates the local `ChessRepertoire` object.
   * If the user is not authenticated, the function does nothing.
   * If an error occurs during the creation of the new repertoire on the server, the error is handled and the promise is rejected.
   * @param name The name of the new repertoire.
   * @param color The color of the new repertoire.
   * @param position The starting position of the new repertoire.
   * @param pgn The PGN string to import moves from.
   * @returns A promise that resolves to the result of the API call and a controller that can be used to cancel the request.
   */
  async function createNewRepertoire(
    color,
    title = "Repertoire",
    position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    pgn = "",
  ) {
    if (title === "") {
      title = "Repertoire"
    }

    // Check if the title of the new repertoire already exists in the `repertoires` map
    let repertoiresTitles = new Map<string, boolean>()
    repertoires.forEach((rep) => {
      repertoiresTitles.set(rep.title, true)
    })
    if (repertoiresTitles.has(title)) {
      // If the title already exists, append a number to the end of the title until a unique title is found
      let inc = 2
      while (repertoiresTitles.has(title + " (" + inc + ")")) {
        inc++
      }
      title = title + " (" + inc + ")"
    }

    // Create a new `ChessRepertoire` object with the specified parameters
    let toSave = new ChessRepertoire(
      title,
      title,
      color,
      position,
      authenticationState.isAuthenticated ? false : true,
    )
    toSave.state.action = RepertoireStateAction.CREATING

    // Save the new repertoire in the indexedDB database and update the `repertoires` map
    saveRepertoireInObjectStore(toSave).then(() => {
      repertoires.set(title, toSave)
      setRepertoires(new Map<string, ChessRepertoire>(repertoires))
    })

    // Create a new `toCreate` object with the specified parameters and positions
    let positions = new Map<string, ChessPosition>()
    let toCreate = {
      name: title,
      startingPosition: position,
      color: color,
      positions: positions,
    }

    // If a PGN string is provided, import the moves into the new repertoire
    if (pgn !== "") {
      // Create a new virtual position with the starting FEN string
      let currentVirtualPosition = new ChessPosition(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      )
      // Add the virtual position to the positions map
      positions.set(currentVirtualPosition.id, currentVirtualPosition)
      // Parse the PGN string into a Pgn object
      const p: Pgn = new Pgn(pgn)

      // Loop through each move in the PGN history
      for (let index = 0; index < p.history.moves.length; index++) {
        const move = p.history.moves[index]
        // Handle the move from the PGN import
        handleMoveFromPgnImport(currentVirtualPosition, move)
        if (index < p.history.moves.length - 1) {
          // If this is not the last move in the PGN history, create a new virtual position for the next move
          let newPos = positions.get(sanitizeFen(move.fen))
          if (!newPos) {
            newPos = new ChessPosition(sanitizeFen(move.fen))
            positions.set(newPos.id, newPos)
          }
          currentVirtualPosition = newPos
        }
      }
    }

    if (authenticationState.isAuthenticated) {
      // If the user is authenticated, create the new repertoire on the server using the `chessApi` object
      let resultData = await chessApi.createRepertoire(toCreate)
      let [result, controller] = resultData
      return new Promise((resolve, reject) => {
        result
          .then((apiResult) => {
            // If the new repertoire is successfully created on the server, update the local `ChessRepertoire` object and save it in the indexedDB database
            let createdRepertoire =
              positions.size > 0
                ? apiResult.data.createRepertoireWithPositions
                : apiResult.data.createRepertoire

            let rep = new ChessRepertoire(
              createdRepertoire.id,
              createdRepertoire.name,
              color,
              position,
            )

            rep.positions = positions

            rep.state.timestamp = createdRepertoire.lastModification
            rep.state.syncStatus = RepertoireSyncStatus.SYNC
            rep.state.action = RepertoireStateAction.IDLE

            // Save the new repertoire in the indexedDB database
            saveRepertoireInObjectStore(rep).then(() => {
              // Remove the old repertoire from the local `repertoires` map and the indexedDB database
              repertoires.delete(toSave.id)
              deleteRepertoireFromObjectStore(toSave.id)

              // Add the new repertoire to the local `repertoires` map and update the state
              repertoires.set(rep.id, rep)
              setRepertoires(new Map<string, ChessRepertoire>(repertoires))

              // Show a success notification to the user
              Store.addNotification({
                title: "Success",
                message: "Repertoire successfully created",
                type: "success",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true,
                },
              })
            })
            resolve([result, controller])
          })
          .catch((error) => {
            // If an error occurs during the creation of the new repertoire on the server, handle the error and reject the promise
            if (error.message.startsWith("Error 401")) {
              // If the error is a 401 Unauthorized error, show a disconnected notification to the user and sign them out
              Store.addNotification({
                title: "Disconnected",
                message:
                  "You have been disconnected because it seems that you logged in from elsewhere",
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
            reject(error)
          })
      })
    } else {
      // If the user is not authenticated, save the new repertoire in the indexedDB database and update the `repertoires` map
      toSave.positions = positions
      toSave.state.action = RepertoireStateAction.IDLE
      saveRepertoireInObjectStore(toSave).then(() => {
        repertoires.set(title, toSave)
        demoRepertoires.current.set(toSave.title, toSave)
        setRepertoires(new Map<string, ChessRepertoire>(repertoires))
      })
      return new Promise((resolve, reject) => {
        resolve([true, false])
      })
    }

    function handleMoveFromPgnImport(
      currentVirtualPosition: ChessPosition,
      move: any,
    ) {
      // Add the move to the `currentVirtualPosition` object
      let moveToAdd = copyObjectFields(move, [
        "color",
        "flags",
        "from",
        "piece",
        "san",
        "to",
        "captured",
      ])
      moveToAdd["nextFen"] = sanitizeFen(move.fen)
      currentVirtualPosition.moves.set(
        move.san,
        moveToAdd as unknown as ChessMove,
      )

      // Recursively handle variations
      if (move.variations && move.color !== color) {
        // Save the current virtual position to restore it after handling the variation
        const saveCurrentVirtualPosition = currentVirtualPosition
        // Loop through each variation in the move
        for (let i = 0; i < move.variations.length; i++) {
          const variationMoveList = move.variations[i]
          // Loop through each move in the variation
          for (let index = 0; index < variationMoveList.length; index++) {
            const move = variationMoveList[index]
            // Handle the move from the PGN import
            handleMoveFromPgnImport(currentVirtualPosition, move)
            if (index < variationMoveList.length - 1) {
              // If this is not the last move in the variation, create a new virtual position for the next move
              let newPos = positions.get(sanitizeFen(move.fen))
              if (!newPos) {
                newPos = new ChessPosition(sanitizeFen(move.fen))
                positions.set(newPos.id, newPos)
              }
              currentVirtualPosition = newPos
            }
          }
          // Done handling variation, restore the current virtual position
          currentVirtualPosition = saveCurrentVirtualPosition
        }
      }
    }
  }

  /**
   * A function to rename a repertoire with the specified ID to the specified new title.
   *
   * @param id The ID of the repertoire to rename.
   * @param newTitle The new title to give to the repertoire.
   * @returns A boolean value indicating whether the operation was successful.
   */
  function renameRepertoire(id: string, newTitle: string): boolean {
    // Get the repertoire with the specified ID from the `repertoires` map
    let rep = repertoires.get(id)
    if (!rep) {
      // If the repertoire doesn't exist, return `false`
      return false
    }

    if (rep.state.demo) {
      // If the repertoire is in demo mode (offline), rename the repertoire locally
      if (repertoires.has(newTitle)) {
        // If a repertoire with the same title already exists, return `false`
        return false
      }
      // Delete the old repertoire from the `repertoires` map and the indexedDB database
      repertoires.delete(id)
      deleteRepertoireFromObjectStore(id)

      // Update the ID and title of the repertoire, and add it back to the `repertoires` map and the indexedDB database
      rep.id = newTitle
      rep.title = newTitle
      repertoires.set(newTitle, rep)
      saveRepertoireInObjectStore(rep)
      setRepertoires(new Map<string, ChessRepertoire>(repertoires))
    } else if (authenticationState.isAuthenticated) {
      // If the user is authenticated, make an API call to rename the repertoire
      chessApi
        .renameRepertoire(id, newTitle)
        .then((result) => {
          // If the API call is successful, update the timestamp and title of the repertoire, and save the updated repertoire to the indexedDB database
          let renamedRepertoire = result.data.renameRepertoire
          rep.state.timestamp = renamedRepertoire.lastModification
          rep.title = renamedRepertoire.name
          saveRepertoireInObjectStore(rep)
          setRepertoires(new Map<string, ChessRepertoire>(repertoires))
        })
        .catch((e) => {})
      //TODO handle async
      return true
    } else {
      // If the user is not authenticated, do nothing for now
      // (don't rename online repertoires while offline)
    }
  }

  /**
   * A function to delete a repertoire with the specified ID.
   *
   * @param id The ID of the repertoire to delete.
   * @returns A boolean value indicating whether the operation was successful.
   */
  function deleteRepertoire(id) {
    // Get the repertoire with the specified ID from the `repertoires` map
    let rep = repertoires.get(id)
    if (!rep) {
      // If the repertoire doesn't exist, return `false`
      return false
    }
    if (rep.state.demo) {
      // If the repertoire is in demo mode (offline), delete the repertoire locally
      repertoires.delete(id)
      demoRepertoires.current.delete(id)
      deleteRepertoireFromObjectStore(id)
      setRepertoires(new Map<string, ChessRepertoire>(repertoires))
    } else if (authenticationState.isAuthenticated) {
      // If the user is authenticated, make an API call to delete the repertoire
      chessApi
        .deleteRepertoire(id)
        .then(() => {
          // If the API call is successful, delete the repertoire from the `repertoires` map and the indexedDB database
          repertoires.delete(id)
          deleteRepertoireFromObjectStore(id)
          setRepertoires(new Map<string, ChessRepertoire>(repertoires))
        })
        .catch((e) => {})
      //TODO handle async
    }
  }

  /**
   * A function to update the position of a repertoire in the database.
   *
   * @param position The `ChessPosition` object representing the new position of the repertoire.
   */
  function updateRepertoirePosition(
    repertoire: ChessRepertoire,
    position: ChessPosition,
  ) {
    // If the user is authenticated, check if the repertoire already contains the new position
    if (authenticationState.isAuthenticated) {
      if (!repertoire.positions.has(position.id)) {
        // If the repertoire doesn't contain the new position, create a new `ChessRepertoirePositionUpdate` object with the `CREATE` action and the new position data
        let up: ChessRepertoirePositionUpdate = {
          action: ChessRepertoirePositionUpdateAction.CREATE,
          id: position.id,
          moves: Array.from(position.moves.values()),
        }
        // Make an API call to update the repertoire positions with the new position data
        chessApi
          .updateRepertoirePositions(repertoire.id, [up])
          .then((result) => {})
          .catch((e: ApolloError) => {
            // Handle any errors that occur during the API call
            if (e.networkError) {
              // Handle network errors
              console.error(e.message)
            } else if (e.graphQLErrors) {
              // Handle GraphQL errors
              console.error(e.message)
              if (
                e.message.startsWith("Error 401") ||
                e.message.startsWith("Error 404") ||
                e.message.startsWith("Error 409")
              ) {
                // Handle specific error codes
              }
            }
          })
      } else {
        // If the repertoire already contains the new position, create a new `ChessRepertoirePositionUpdate` object with the `UPDATE` action and the new position data
        let up: ChessRepertoirePositionUpdate = {
          action: ChessRepertoirePositionUpdateAction.UPDATE,
          id: position.id,
          moves: Array.from(position.moves.values()),
        }
        // Make an API call to update the repertoire positions with the new position data
        chessApi
          .updateRepertoirePositions(repertoire.id, [up])
          .then((result) => {})
          .catch((e: ApolloError) => {
            // Handle any errors that occur during the API call
            if (e.networkError) {
              // Handle network errors
              console.error(e.message)
            } else if (e.graphQLErrors) {
              // Handle GraphQL errors
              if (
                e.message.startsWith(
                  "Error 409: Conflict Error when updating repertoire position: unable to update an unregistered position",
                )
              ) {
                //Special case for old repertoires
                let create: ChessRepertoirePositionUpdate = {
                  action: ChessRepertoirePositionUpdateAction.CREATE,
                  id: position.id,
                  moves: Array.from(position.moves.values()),
                }
                chessApi
                  .updateRepertoirePositions(repertoire.id, [create])
                  .then(() => {})
                  .catch((e: ApolloError) => {
                    console.error(e.message)
                  })
              } else if (
                e.message.startsWith("Error 401") ||
                e.message.startsWith("Error 404") ||
                e.message.startsWith("Error 409")
              ) {
                // Handle specific error codes
                console.error(e.message)
              }
            }
          })
      }
    }
    updateRepertoireInObjectStore(repertoire)
  }

  function keepSanitizedPositionsOnly(
    positions:
      | ChessPosition[]
      | Map<string, ChessPosition>
      | { [id: string]: ChessPosition },
  ): Map<string, ChessPosition> {
    let posArray: ChessPosition[]

    // Normalize input to array
    if (Array.isArray(positions)) {
      posArray = positions
    } else if (
      typeof (positions as Map<string, ChessPosition>).forEach === "function"
    ) {
      posArray = Array.from((positions as Map<string, ChessPosition>).values())
    } else {
      posArray = Object.values(positions)
    }

    const sanitizedKeys = new Set<string>()
    for (const pos of posArray) {
      if (isSanitizedFen(pos.id)) {
        sanitizedKeys.add(pos.id)
      }
    }

    const result = new Map<string, ChessPosition>()
    for (const pos of posArray) {
      let fenKey = isSanitizedFen(pos.id) ? pos.id : sanitizeFen(pos.id)

      // If this is a sanitized FEN, or an only-legacy FEN (no sanitized present)
      if (isSanitizedFen(pos.id) || !sanitizedKeys.has(fenKey)) {
        // Always reconstruct moves as a Map
        const movesMap = new Map<string, ChessMove>()
        if (Array.isArray(pos.moves)) {
          pos.moves.forEach((m: ChessMove) => {
            m.nextFen = sanitizeFen(m.nextFen)
            movesMap.set(m.san, m)
          })
        } else if (pos.moves && typeof pos.moves.forEach === "function") {
          // If already a Map
          pos.moves.forEach((m: ChessMove) => {
            m.nextFen = sanitizeFen(m.nextFen)
            movesMap.set(m.san, m)
          })
        } else if (pos.moves && typeof pos.moves === "object") {
          // Just in case moves is a plain object (rare, but possible)
          Object.values(pos.moves).forEach((m: ChessMove) => {
            m.nextFen = sanitizeFen(m.nextFen)
            movesMap.set(m.san, m)
          })
        }
        // Create (or clone) the ChessPosition
        let sanitizedPos: ChessPosition = isSanitizedFen(pos.id)
          ? new ChessPosition(pos.id) // keep id
          : new ChessPosition(sanitizeFen(pos.id))
        sanitizedPos.moves = movesMap
        // You might want to copy any additional fields from the original ChessPosition here

        result.set(fenKey, sanitizedPos)
        sanitizedKeys.add(fenKey) // In case we're adding it as a sanitized entry now
      } else {
        // Only reached if legacy and sanitized already present
      }
    }
    return result
  }

  // Helper function (as discussed earlier)
  function isSanitizedFen(fen: string): boolean {
    // Adjust the threshold if your sanitized FEN uses 3 fields or 4 fields
    return fen.split(" ").length <= 4
  }

  /**
   * A function to load a repertoire with the specified ID into the `repertoire.current` state.
   *
   * @param repertoireId The ID of the repertoire to load.
   * @returns A promise that resolves to `true` if the operation is successful, or rejects with an error if the operation fails.
   */
  function loadRepertoire(repertoireId: string) {
    if (repertoire.current && repertoireId === repertoire.current.id) {
      // If the specified repertoire ID is the same as the ID of the current repertoire, return a promise that resolves with `true`
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    }

    // Get the `ChessRepertoire` object corresponding to the specified repertoire ID from the `repertoiresFromObjectStore` state
    let repFromObjectStore = repertoiresFromObjectStore.current.get(
      String(repertoireId),
    )

    if (!repertoires.has(String(repertoireId))) {
      // If the specified repertoire ID is not in the `repertoires` `Map` object, return a promise that rejects with an error message
      return new Promise((resolve, reject) => {
        reject("Unknown repertoire to be loaded")
      })
    }

    // Set the `repertoire.current` state to the `ChessRepertoire` object corresponding to the specified repertoire ID from the `repertoires` `Map` object
    repertoire.current = repertoires.get(String(repertoireId))
    if (
      repertoire.current.state.syncStatus === RepertoireSyncStatus.SYNC &&
      repFromObjectStore.state.timestamp !== repertoire.current.state.timestamp
    ) {
      // If the current repertoire is in sync and the timestamp of the `ChessRepertoire` object corresponding to the specified repertoire ID from the `repertoiresFromObjectStore` state is different from the timestamp of the current repertoire, set the sync status of the current repertoire to `DESYNC`
      repertoire.current.state.syncStatus = RepertoireSyncStatus.DESYNC
    }

    if (
      authenticationState.isAuthenticated &&
      repertoire.current.state.syncStatus === RepertoireSyncStatus.DESYNC &&
      !repertoire.current.state.demo
    ) {
      // If the user is authenticated, the current repertoire is desynchronized, and the current repertoire is not a demo repertoire, fetch the repertoire from the server using the `readRepertoire` query
      return new Promise((resolve, reject) => {
        chessApi
          .readRepertoire(repertoire.current.id)
          .then((result) => {
            // If the `readRepertoire` query is successful, update the current repertoire with the received data, set the sync status of the current repertoire to `SYNC`, save the current repertoire in the `repertoires` object store, compute the lines of the current repertoire, and resolve the promise with `true`
            let receivedRepertoire = result.data.readRepertoire
            repertoire.current.positions = keepSanitizedPositionsOnly(
              receivedRepertoire.positions,
            )

            repertoire.current.state.timestamp =
              receivedRepertoire.lastModification
            repertoire.current.state.syncStatus = RepertoireSyncStatus.SYNC
            saveRepertoireInObjectStore(repertoire.current)
            resolve(true)
          })
          .catch((e: ApolloError) => {
            // If the `readRepertoire` query fails, reject the promise with the error
            if (e.networkError) {
              // Handle network errors
            } else if (e.graphQLErrors) {
              // Handle GraphQL errors
              if (
                e.message.startsWith("Error 401") ||
                e.message.startsWith("Error 404") ||
                e.message.startsWith("Error 409")
              ) {
                // Handle specific error messages
              }
            }
            reject(e)
          })
      })
    } else {
      // If the user is not authenticated, the current repertoire is synchronized, or the current repertoire is a demo repertoire, set the `repertoire.current` state to the `ChessRepertoire` object corresponding to the specified repertoire ID from the `repertoiresFromObjectStore` state, compute the lines of the current repertoire, and resolve the promise with `true`
      return new Promise((resolve, reject) => {
        repertoire.current = repFromObjectStore
        repertoire.current.positions = keepSanitizedPositionsOnly(
          repFromObjectStore.positions,
        )

        resolve(true)
      })
    }
  }

  /**
   * A function to check if a repertoire with the specified name already exists in the `repertoires` map.
   *
   * @param name The name of the repertoire to check for.
   * @returns A boolean value indicating whether a repertoire with the specified name already exists in the `repertoires` map.
   */
  function isRepertoireNameAlreadyExists(name): boolean {
    // Loop through all the repertoires in the `repertoires` map
    for (const rep of repertoires.values()) {
      // If a repertoire with the same title as the specified name is found, return `true`
      if (rep.title === name) {
        return true
      }
    }
    // If no repertoire with the same title as the specified name is found, return `false`
    return false
  }

  return {
    createNewRepertoire,
    updateRepertoirePosition,
    deleteRepertoire,
    renameRepertoire,
    loadRepertoire,
    isRepertoireNameAlreadyExists,
    saveImportedRepertoire,
    deleteRepertoireFromObjectStore,
    updateRepertoireInObjectStore,
  }
}

/**
 * Returns a new object with only specified fields copied.
 *
 * @param {Object} original object to copy fields from
 * @param {Array} list of fields names to copy in the new object
 * @return {Object} a new object with only specified fields copied
 */
function copyObjectFields(originObject, fieldNamesArray) {
  var obj = {}

  if (fieldNamesArray === null) return obj

  for (var i = 0; i < fieldNamesArray.length; i++) {
    obj[fieldNamesArray[i]] = originObject[fieldNamesArray[i]]
  }

  return obj
}
