import { ChessMove } from "./ChessMove"
import { ChessPosition } from "./ChessPosition"

/**
 * Represents the state of the repertoire.
 * The `RepertoireState` interface defines the properties of the repertoire state.
 * Each state has a hash, a sync status, a timestamp, a demo flag, and an action.
 */
interface RepertoireState {
  hash: string // The hash of the repertoire.
  syncStatus: RepertoireSyncStatus // The sync status of the repertoire.
  timestamp: number // The timestamp of the repertoire.
  demo: boolean // A flag indicating whether the repertoire is a demo.
  action: RepertoireStateAction // The action of the repertoire state.
}

/**
 * Represents the action of the repertoire state.
 * The `RepertoireStateAction` enum defines the possible actions of the repertoire state.
 * The actions are IDLE, CREATING, IMPORTING, SYNCHRONIZING, and DELETING.
 */
export enum RepertoireStateAction {
  IDLE, // The repertoire is idle.
  CREATING, // The repertoire is being created.
  IMPORTING, // The repertoire is being imported.
  SYNCHRONIZING, // The repertoire is being synchronized.
  DELETING, // The repertoire is being deleted.
}

/**
 * Represents the synchronization status of the repertoire.
 * The `RepertoireSyncStatus` enum defines the possible synchronization statuses of the repertoire.
 * The statuses are SYNC and DESYNC.
 */
export enum RepertoireSyncStatus {
  SYNC, // The repertoire is synchronized.
  DESYNC, // The repertoire is desynchronized.
}

/**
 * Represents the action for updating a chess repertoire position.
 * The `ChessRepertoirePositionUpdateAction` enum defines the possible actions for updating a chess repertoire position.
 * The actions are CREATE, UPDATE, and DELETE.
 */
export enum ChessRepertoirePositionUpdateAction {
  CREATE = "CREATE", // Create a new chess repertoire position.
  UPDATE = "UPDATE", // Update an existing chess repertoire position.
  DELETE = "DELETE", // Delete an existing chess repertoire position.
}

/**
 * Represents the mode of the repertoire.
 * The `RepertoireMode` enum defines the possible modes of the repertoire.
 * The modes are BUILD and TRAIN.
 */
export enum RepertoireMode {
  BUILD = "BUILD", // The repertoire is in build mode.
  TRAIN = "TRAIN", // The repertoire is in train mode.
}

/**
 * Represents an update to a chess repertoire position.
 * The `ChessRepertoirePositionUpdate` class defines the properties of an update to a chess repertoire position.
 * Each update has an ID, an action, and an array of moves.
 */
export class ChessRepertoirePositionUpdate {
  id: string // The ID of the update.
  action: ChessRepertoirePositionUpdateAction // The action of the update.
  moves: ChessMove[] = new Array<ChessMove>() // The array of moves for the update.

  /**
   * Creates a new instance of the `ChessRepertoirePositionUpdate` class.
   * @param id The ID of the update.
   * @param action The action of the update.
   */
  constructor(id: string, action: ChessRepertoirePositionUpdateAction) {
    this.id = id
    this.action = action
  }
}

/**
 * Represents a chess repertoire.
 * The `ChessRepertoire` class defines the properties of a chess repertoire.
 * Each repertoire has an ID, a color, a title, a starting position, a map of positions, and a state.
 */
export class ChessRepertoire {
  id: string // The ID of the repertoire.
  color: string // The color of the repertoire.
  title: string // The title of the repertoire.
  startingPosition: string // The starting position of the repertoire.
  positions: Map<string, ChessPosition> = new Map<string, ChessPosition>() // The map of positions for the repertoire.
  state: RepertoireState // The state of the repertoire.

  /**
   * Creates a new instance of the `ChessRepertoire` class.
   * @param id The ID of the repertoire.
   * @param title The title of the repertoire.
   * @param color The color of the repertoire.
   * @param startingPosition The starting position of the repertoire.
   * @param demo A flag indicating whether the repertoire is a demo.
   */
  constructor(
    id: string,
    title: string,
    color: string,
    startingPosition: string,
    demo: boolean = false
  ) {
    this.id = id
    this.title = title
    this.color = color
    this.startingPosition = startingPosition
    this.state = {
      hash: "",
      syncStatus: RepertoireSyncStatus.DESYNC,
      timestamp: Date.now(),
      demo: demo,
      action: RepertoireStateAction.IDLE,
    }
  }
}