import { useApi } from "@/features/api/providers/ApiProvider"
import { ChessRepertoire, RepertoireSyncStatus } from "@models/Repertoire"
import React, { useEffect, useRef, useState } from "react"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"

interface RepertoiresContextInterface {
  db: React.RefObject<IDBDatabase>
  repertoiresFromObjectStore: React.RefObject<Map<string, ChessRepertoire>>
  repertoires: Map<string, ChessRepertoire>
  setRepertoires: React.Dispatch<
    React.SetStateAction<Map<string, ChessRepertoire>>
  >
  isLoadingRepertoiresList: boolean
  setLoadingRepertoireList: React.Dispatch<React.SetStateAction<boolean>>
  saveRepertoireInObjectStore
  demoRepertoires: React.RefObject<Map<string, ChessRepertoire>>
}

const Context = React.createContext<RepertoiresContextInterface | null>(null)

export default function RepertoireStoreProvider({ children }) {
  const db = useRef<IDBDatabase>(null) // A reference to the IndexedDB database
  const repertoiresFromObjectStore = useRef<Map<string, ChessRepertoire>>(null) // A reference to the repertoires stored in the IndexedDB object store
  const demoRepertoires = useRef<Map<string, ChessRepertoire>>(null) // A reference to the demo repertoires
  const [isLoadingRepertoiresList, setLoadingRepertoireList] = useState(true)
  const [repertoires, setRepertoires] =
    useState<Map<string, ChessRepertoire>>(null) // A map of all the repertoires available to the user
  const { chessApi, isClientInitializing } = useApi()
  const { authenticationState } = useAuthenticationState()

  // Effect to handle repertoire loading based on authentication state
  useEffect(() => {
    // Only proceed if we're not initializing auth state and client is ready
    if (!isClientInitializing && !authenticationState.isInitializing) {
      loadRepertoires()
    }
  }, [
    authenticationState.isAuthenticated,
    isClientInitializing,
    authenticationState.isInitializing,
  ])

  const loadRepertoires = async () => {
    setLoadingRepertoireList(true)
    try {
      await initDb()
      if (authenticationState.isAuthenticated) {
        await readAllRepertoiresFromDb()
      } else {
        // If unauthenticated, set demo repertoires
        setRepertoires(demoRepertoires.current)
      }
    } catch (error) {
    } finally {
      setLoadingRepertoireList(false)
    }
  }

  /**
   * A function to initialize the indexedDB database and load the repertoires from the `repertoires` object store into the `repertoiresFromObjectStore` and `demoRepertoires` states.
   *
   * @returns A promise that resolves to `true` if the operation is successful, or rejects with an error if the operation fails.
   */
  function initDb() {
    /**
     * A function to initialize the `repertoiresFromObjectStore` state with the repertoires from the `repertoires` object store.
     *
     * @returns A promise that resolves to `true` if the operation is successful, or rejects with an error if the operation fails.
     */
    function initRepertoiresFromObjectStore() {
      // Create a new `Map` object to hold the repertoires
      let repertoires = new Map<string, ChessRepertoire>()
      // Create a new `Map` object to hold the demo repertoires
      demoRepertoires.current = new Map<string, ChessRepertoire>()
      return new Promise((resolve, reject) => {
        // Start a new transaction on the `repertoires` object store with read-only access
        var transaction = db.current.transaction(["repertoires"], "readonly")
        transaction.oncomplete = (event) => {
          // If the transaction completes successfully, resolve the promise with `true`
          resolve(true)
        }
        transaction.onerror = (event) => {
          // If the transaction encounters an error, reject the promise with the error
          reject(event)
        }

        // Get all the repertoires from the `repertoires` object store using a `getAll` request
        let request = transaction.objectStore("repertoires").getAll()
        request.onsuccess = () => {
          // For each repertoire returned by the `getAll` request, create a new `ChessRepertoire` object and set its properties based on the properties of the repertoire
          request.result.forEach((repertoire: ChessRepertoire) => {
            repertoires.set(repertoire.id, repertoire)
            if (repertoire.state.demo) {
              // If the repertoire is a demo repertoire, add it to the `demoRepertoires` state
              demoRepertoires.current.set(repertoire.id, repertoire)
            }
          })
          // Set the `repertoiresFromObjectStore` state to the `repertoires` `Map` object
          repertoiresFromObjectStore.current = repertoires
        }
      })
    }

    // Create a new promise that initializes the indexedDB database and loads the repertoires from the `repertoires` object store into the `repertoiresFromObjectStore` and `demoRepertoires` states
    let promise = new Promise((resolve, reject) => {
      if (!db.current) {
        // If the indexedDB database is not initialized, open a new connection to the database with version 3
        var request = indexedDB.open("crc", 3)
        request.onerror = (e) => {
          // If the connection request encounters an error, reject the promise with the error
          reject(e)
        }
        request.onsuccess = () => {
          // If the connection request is successful, set the `db.current` state to the result of the connection request and initialize the `repertoiresFromObjectStore` state with the repertoires from the `repertoires` object store
          db.current = request.result
          initRepertoiresFromObjectStore().then(() => {
            resolve(true)
          })
        }

        request.onupgradeneeded = (event) => {
          // If the connection request requires an upgrade, set the `db.current` state to the result of the connection request and create a new `repertoires` object store with a unique index on the `id` property
          db.current = request.result
          var objectStore = db.current.createObjectStore("repertoires", {
            keyPath: "id",
          })

          objectStore.createIndex("id", "id", { unique: true })
        }
      } else {
        // If the indexedDB database is already initialized, resolve the promise with `true`
        resolve(true)
      }
    })
    return promise
  }

  /**
   * A function to save a repertoire in the `repertoires` object store of the indexedDB database.
   *
   * @param repertoire The `ChessRepertoire` object to save in the `repertoires` object store.
   * @returns A promise that resolves to `true` if the operation is successful, or rejects with an error if the operation fails.
   */
  function saveRepertoireInObjectStore(repertoire) {
    let promise = new Promise((resolve, reject) => {
      // Create a new transaction with the `repertoires` object store in "readwrite" mode
      var transaction = db.current.transaction(["repertoires"], "readwrite")
      // Set up event handlers for the transaction
      transaction.oncomplete = (event) => {
        // If the transaction completes successfully, resolve the promise with `true`
        resolve(true)
      }

      transaction.onerror = (event) => {
        // If the transaction encounters an error, reject the promise with the error
        reject(event)
      }

      // Get the `repertoires` object store from the transaction
      var objectStore = transaction.objectStore("repertoires")

      // Put the `repertoire` object in the `repertoires` object store
      var request = objectStore.put(repertoire)
      request.onsuccess = (event) => {
        // If the put operation is successful, add the `repertoire` object to the `repertoiresFromObjectStore` map
        repertoiresFromObjectStore.current.set(repertoire.id, repertoire)
      }
    })
    return promise
  }

  /**
   * A function to read all repertoires from the database and update the `repertoires` state accordingly.
   *
   * @returns A promise that resolves to `true` if the operation is successful, or rejects with an error if the operation fails.
   */
  function readAllRepertoiresFromDb() {
    let promise = new Promise((resolve, reject) => {
      if (authenticationState.isAuthenticated) {
        // If the user is authenticated, list all repertoires from the database using the `listRepertoires` function of the `chessApi` object
        chessApi
          .listRepertoires()
          .then((result) => {
            // If the operation is successful, create a new `Map` object to hold the repertoires, and iterate over the repertoires returned by the `listRepertoires` function
            let reps = new Map<string, ChessRepertoire>()
            result.data.listRepertoires.forEach((repertoire) => {
              // For each repertoire, create a new `ChessRepertoire` object and set its properties based on the properties of the repertoire returned by the `listRepertoires` function
              let rep = new ChessRepertoire(
                repertoire.id,
                repertoire.name,
                repertoire.color,
                repertoire.startingPosition,
              )
              // Set the timestamp of the new `ChessRepertoire` object to the last modification timestamp of the repertoire returned by the `listRepertoires` function
              rep.state.timestamp = repertoire.lastModification
              reps.set(repertoire.id, rep)
              if (!repertoiresFromObjectStore.current.has(rep.id)) {
                // If the online repertoire is not saved in the object storage, save it now and set its sync status to `DESYNC`
                rep.state.syncStatus = RepertoireSyncStatus.DESYNC
                saveRepertoireInObjectStore(rep)
              }
            })
            // Merge the repertoires from the database with the demo repertoires
            const merged = new Map([...reps, ...demoRepertoires.current])
            // Set the `repertoires` state to the merged repertoires
            setRepertoires(merged)
            resolve(true)
          })
          .catch((e) => {
            // If the operation fails, reject the promise with the error
            reject(e)
          })
      } else {
        // If the user is not authenticated, set the `repertoires` state to the demo repertoires
        setRepertoires(demoRepertoires.current)
        resolve(true)
      }
    })
    return promise
  }

  // Render the child components within the context provider
  return (
    <Context.Provider
      value={{
        db,
        repertoiresFromObjectStore,
        demoRepertoires,
        repertoires,
        setRepertoires,
        isLoadingRepertoiresList,
        setLoadingRepertoireList,
        saveRepertoireInObjectStore,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useRepertoireStoreProvider() {
  return React.useContext(Context)
}
