/* eslint-disable tailwindcss/no-custom-classname */
import React, { useCallback, useEffect, useRef, useState } from "react"

import Tree, { useTreeState, ClassesType, treeHandlers } from "react-hyper-tree"

import MoveChain, { trailComponent } from "./MoveChain"
import { useChessProvider } from "../../logic/providers/ChessProvider"
import { useRepertoireProvider } from "../../../repertoire/providers/RepertoireProvider"
import NodeContextMenu from "./NodeContextMenu"
import LoadingScreen from "@/features/common/components/LoadingScreen"
import { Icon } from "@/features/common/utils/icons"
import { MoveStateProvider, useMoveState } from "./MoveStateProvider"
import { PortalContextMenu } from "./PortalContextMenu"
interface TreeNodeProps {
  node: any // Remplacez 'any' par le type réel de votre nœud
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  contextMenu: any // Remplacez 'any' par le type réel de votre menu contextuel
  setContextMenu: React.Dispatch<any> // Remplacez 'any' par le type réel de votre fonction setContextMenu
  loadPgn: (pgn: string) => void // Remplacez 'string' et 'void' par les types réels de votre fonction loadPgn
  selectedLinePgn: string
  selectedMoveIndex: number
  titleFilterValue: string
}

type IClassNamesObjectProps = { [key: string]: boolean }

type IClassNamesProps = string | undefined

/**
 * Converts an object of class names to a string.
 * The `convertObjectToString` function takes an object of class names and returns a string of class names.
 * The function filters out any class names with a value of `false` and reduces the remaining class names to a single string.
 * @param classes An object of class names.
 * @returns A string of class names.
 */
const convertObjectToString = (classes: { [key: string]: boolean }): string =>
  Object.keys(classes)
    .filter((key) => !!classes[key])
    .reduce(
      (classString: string, item: string) =>
        classString ? `${classString}${item ? ` ${item}` : ""}` : `${item}`,
      "",
    )

/**
 * Combines class names into a single string.
 * The `classnames` function takes one or more objects of class names and returns a single string of class names.
 * If the first argument is a string, the function simply joins all arguments with a space.
 * Otherwise, the function calls `convertObjectToString` with the first argument and returns the result.
 * @param classes One or more objects of class names.
 * @returns A single string of class names.
 */
const classnames = (
  ...classes: (IClassNamesObjectProps | IClassNamesProps)[]
): string => {
  if (classes[0] && typeof classes[0] === "string") {
    return classes.join(" ")
  }
  return convertObjectToString(classes[0] as IClassNamesObjectProps)
}

/**
 * Returns the previous value of a state or prop.
 * The `usePrevious` hook takes a value and returns the previous value of that value.
 * The hook uses the `useRef` and `useEffect` hooks to store and update the previous value.
 * @param value The value to track.
 * @returns The previous value of the value.
 */
function usePrevious(value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const MemoizedMoveChain = React.memo(MoveChain)
const MemoizedNodeContextMenu = React.memo(NodeContextMenu)
const MemoizedTreeNode = React.memo<TreeNodeProps>(
  ({ node, onToggle, contextMenu, setContextMenu, loadPgn }) => {
    const [moveContextMenu, setMoveContextMenu] = useState(null)
    const { clearPendingDelete, pendingDeleteMove } = useMoveState()

    const isSelected = node.isSelected()

    const handleMoveContextMenu = (moveContext) => {
      // If there's already a pending delete or active context menu, clear it
      if (pendingDeleteMove || contextMenu || moveContextMenu) {
        clearPendingDelete()
        setContextMenu(undefined)
        setMoveContextMenu(null)
      }

      // Set new move context menu
      setMoveContextMenu(moveContext)
    }

    const handleCloseAllMenus = () => {
      clearPendingDelete()
      setContextMenu(undefined)
      setMoveContextMenu(null)
    }

    return (
      <div
        className="tree-node relative left-[-4px] flex w-full overflow-hidden"
        key={node.data.id}
      >
        <div
          className={
            classnames({
              "node-content-wrapper": true,
              "node-selected !border-indigo-500 ": isSelected,
            }) +
            " pr-4 border w-full border-gray-400/80 bg-zinc-200 dark:bg-zinc-700 rounded-b-xl rounded-r-xl dark:border-gray-500/80"
          }
          onClick={(e) => {
            if (contextMenu === node.data.id) {
              setContextMenu(undefined)
              return
            }
            if (contextMenu || moveContextMenu) {
              handleCloseAllMenus()
            }
            if (node.data.id !== "" && node.hasChildren()) {
              onToggle(e)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            // TypeScript fix: cast e.target to HTMLElement and check for move-item
            const target = e.target as HTMLElement
            if (!target?.closest(".move-item")) {
              if (contextMenu === node.data.id) {
                //setContextMenu(undefined)
              } else {
                setMoveContextMenu(null) // Close move menu
                setContextMenu(node.data.id)
              }
            }
          }}
        >
          <div className="titles gap-2">
            <div className="relative flex">
              {node.data.opening && (
                <div className="node-subtitle z-20 w-fit rounded-br-full border-b border-r border-gray-400/80 bg-zinc-200 px-4 shadow-inner dark:border-gray-500/80 dark:bg-slate-600 dark:text-gray-300">
                  {node.data.opening}
                </div>
              )}
              {node.data.unfinished && !node.hasChildren() && (
                <div className="relative">
                  <div className="node-subtitle relative left-[-15px] z-10 w-fit rounded-br-full border-b border-r border-gray-400/80 bg-red-600/70 px-4 pl-5 text-gray-800/80 shadow-inner dark:border-gray-500/80 dark:bg-red-900 dark:text-gray-300">
                    Unfinished
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center pt-[5px]">
              <MemoizedMoveChain
                line={node.data}
                loadPgn={loadPgn}
                onMoveContextMenu={handleMoveContextMenu}
              />
              {!!node.options.childrenCount && (
                <div className="flex pb-[5px]">
                  {trailComponent}
                  {node.options.opened === true ? (
                    <div className="children-length h-[35px] w-fit rounded-full border border-indigo-400/40 bg-indigo-300/60 text-indigo-500/90 shadow-inner dark:bg-indigo-500/80 dark:text-indigo-200/90">
                      <div className="h-full p-2 px-4">
                        ⌄ {node.options.childrenCount} Lines
                      </div>
                    </div>
                  ) : (
                    <div className="children-length h-[35px] w-fit rounded-full border border-indigo-300/40 text-indigo-400/70 shadow-md">
                      <div className="h-full p-2 px-4">
                        + {node.options.childrenCount} Lines
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {node.hasChildren() && (
            <Icon
              name="RightChevron"
              className={
                node.options.opened
                  ? "h-6 w-6 -rotate-90 text-gray-600 dark:text-gray-300"
                  : "h-6 w-6 rotate-90 text-gray-600 dark:text-gray-300"
              }
            />
          )}

          {/* Line-level context menu */}
          {contextMenu === node.data.id && (
            <MemoizedNodeContextMenu
              node={node}
              setContextMenu={setContextMenu}
            />
          )}

          {/* Move-level context menu */}
          {moveContextMenu && (
            <PortalContextMenu
              isOpen={true}
              triggerRect={moveContextMenu.triggerRect}
              onClose={() => setMoveContextMenu(null)}
            >
              <MemoizedNodeContextMenu
                node={node}
                setContextMenu={() => setMoveContextMenu(null)}
                moveContext={moveContextMenu}
              />
            </PortalContextMenu>
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.node.data === nextProps.node.data &&
      prevProps.node.isSelected() === nextProps.node.isSelected() &&
      prevProps.contextMenu === nextProps.contextMenu &&
      prevProps.selectedLinePgn === nextProps.selectedLinePgn &&
      prevProps.selectedMoveIndex === nextProps.selectedMoveIndex &&
      prevProps.titleFilterValue === nextProps.titleFilterValue
    )
  },
)

/**
 * A component that displays a tree of chess openings.
 * The `ChessLinesTree` component takes a PGN string and a function to load a PGN string and displays a tree of chess openings.
 * The component uses the `useState`, `usePrevious`, `useChessProvider`, `useRepertoireManager`, and `useTreeState` hooks to manage state and render the tree.
 * The component also uses a filter function to filter the tree based on a title filter value.
 * @param pgn The PGN string.
 * @param loadPgn The function to load a PGN string.
 * @returns A component that displays a tree of chess openings.
 */
const ChessLinesTreeContent = ({ pgn, loadPgn }) => {
  // State variables
  const [titleFilterValue, setTitleFilterValue] = useState<string>("")
  const prevFilterValue = usePrevious(titleFilterValue)
  const prevPgn = usePrevious(pgn)
  const [selectedLinePgn, setSelectedLinePgn] = useState("")
  const [state, setState] = useState("loading")
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1)
  const [isFound, setIsFound] = useState(false)
  const [contextMenu, setContextMenu] = useState(undefined)
  const { setSearchHighlightText, setCurrentPositionState } = useMoveState()

  // Hooks
  const { chess, getFen } = useChessProvider()
  const { linesData, repertoireVersion, transpositionIndex } =
    useRepertoireProvider()
  const prevRepertoireVersion = usePrevious(repertoireVersion)
  const { required, handlers } = useTreeState({
    id: "tree",
    data: linesData,
    defaultOpened: false,
    multipleSelect: true,
    filter: titleFilterValue
      ? (node) => {
          if (
            titleFilterValue.toLowerCase().startsWith(":unfi") &&
            node.data.unfinished
          ) {
            return true
          }
          if (
            titleFilterValue.toLowerCase().startsWith(":t") &&
            node.data.transposition
          ) {
            return true
          }
          // Filter function
          if (!node.data.opening) {
            node.data.opening = ""
          }
          let words = node.data.opening.toLowerCase().split(" ")
          for (const word of words) {
            if (word.toLowerCase().startsWith(titleFilterValue.toLowerCase())) {
              return true
            }
          }
          if (
            node.data.opening
              .toLowerCase()
              .startsWith(titleFilterValue.toLowerCase())
          ) {
            return true
          }
          for (const move of node.data.moveSequence) {
            if (
              move.san.toLowerCase().startsWith(titleFilterValue.toLowerCase())
            ) {
              return true
            }
          }
          return false
        }
      : undefined,
  })

  // Update search handling
  const handleSearchChange = (e) => {
    const value = e.target.value
    setTitleFilterValue(value)
    setSearchHighlightText(value) // Update move state manager
  }

  useEffect(() => {
    // Force re-expansion after repertoire changes
    if (prevRepertoireVersion !== repertoireVersion && repertoireVersion > 0) {
      // Reset isFound to trigger expansion logic
      setIsFound(false)

      // Use setTimeout to ensure tree data is updated first
      setTimeout(() => {
        if (required.data[0] && handlers && pgn) {
          // Force the main effect to run by resetting isFound
          setIsFound(false)
        }
      }, 50) // Small delay to ensure tree is ready
    }
  }, [repertoireVersion, prevRepertoireVersion, required.data, handlers, pgn])

  // Handle changes in the PGN string and update the selected line and move index
  useEffect(() => {
    if (prevFilterValue !== titleFilterValue || prevPgn !== pgn) {
      setIsFound(false)
    }
    if (isFound || !required.data[0]) return

    function handleChildrenState(node): number {
      if (pgn === "") {
        setSelectedLinePgn("")
        setSelectedMoveIndex(0)
        setIsFound(true)
        treeHandlers.trees.tree.handlers.setSelected(node, false)
        for (const childNode of node.getChildren()) {
          treeHandlers.trees.tree.handlers.setSelected(childNode, false)
        }

        return 0
      }

      if (!isFound && node.data.pgn.startsWith(pgn)) {
        // Check self or children
        for (let i = 0; i < node.data.moveSequence.length; i++) {
          if (node.data.moveSequence[i].nextFen === getFen()) {
            // Found the selected line and move
            setSelectedLinePgn(node.data.pgn)
            setSelectedMoveIndex(i)
            treeHandlers.trees.tree.handlers.setSelected(node, true)
            setIsFound(true)
            break
          }
        }
      }
      let childrenCount = node.getChildren().length
      for (const childNode of node.getChildren()) {
        if (pgn === childNode.data.pgn) {
          // Perfect pgn match, this is the selected line
          treeHandlers.trees.tree.handlers.setSelected(childNode, true)
          childNode.setOpened(true)
          setSelectedLinePgn(pgn)
          // Also select the last move
          setSelectedMoveIndex(childNode.data.moveSequence.length - 1)
          setIsFound(true)
        } else if (pgn.includes(childNode.data.pgn)) {
          // Not perfect match,
          // one of children will be the selected line
          treeHandlers.trees.tree.handlers.setSelected(childNode, true)
          childNode.setOpened(true)
        } else {
          // Not selected, close the node
          treeHandlers.trees.tree.handlers.setSelected(childNode, false)
          childNode.setOpened(false)
        }

        // If childNode is opened, add its children count
        let subCount = handleChildrenState(childNode)
        if (childNode.isOpened()) {
          childrenCount += subCount
        }
      }

      // Update the node's children count
      node.options.childrenCount = node.isOpened()
        ? childrenCount
        : node.getChildren().length

      return childrenCount
    }
    let root = required.data[0]
    if (!root || !handlers) return

    if (root.getChildren().length !== root.data.children.length) {
      // Set the raw children if the node's children have changed
      handlers.setRawChildren(root, root.data.children, undefined, true)
    }
    refreshNodeChildren(root)

    // Refresh the node's children recursively
    function refreshNodeChildren(node) {
      for (const childNode of node.children) {
        if (
          childNode.data.flags.toBeUpdated ||
          childNode.getChildren().length !== childNode.data.children.length
        ) {
          handlers.setRawChildren(
            childNode,
            childNode.data.children,
            undefined,
            true,
          )
          childNode.data.flags.toBeUpdated = false
        }
        refreshNodeChildren(childNode)
      }
    }

    handleChildrenState(root)

    setState("loaded")
  }, [
    chess,
    pgn,
    prevFilterValue,
    titleFilterValue,
    handlers,
    required.data,
    isFound,
    prevPgn,
    contextMenu,
  ])

  // Update position tracking
  useEffect(() => {
    if (selectedLinePgn && selectedMoveIndex >= 0) {
      setCurrentPositionState(selectedLinePgn, selectedMoveIndex)
    }
  }, [selectedLinePgn, selectedMoveIndex, setCurrentPositionState])

  useEffect(() => {
    let s = document.getElementById("search")
    if (!s) {
      return
    }
    const handleKeyboardEvent = (keyboardEvent) => {
      const key = keyboardEvent.code || keyboardEvent.keyCode
      if (key === "Enter" || key === 13) {
        // Blur the search input on Enter key press
        s.blur()
      }
    }
    // Add an event listener to handle keyboard events
    s.addEventListener("keyup", handleKeyboardEvent)
    return () => {
      // Remove the event listener when the component unmounts
      s.removeEventListener("keyup", handleKeyboardEvent)
    }
  })

  const renderNode = useCallback(
    ({ node, onToggle }) => {
      if (node.data.id === "") {
        node.setOpened(true)
        return <div className="w-full"></div>
      }

      return (
        <MemoizedTreeNode
          key={node.data.id}
          node={node}
          onToggle={onToggle}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          loadPgn={loadPgn}
          selectedLinePgn={selectedLinePgn}
          selectedMoveIndex={selectedMoveIndex}
          titleFilterValue={titleFilterValue}
        />
      )
    },
    [
      contextMenu,
      loadPgn,
      selectedLinePgn,
      selectedMoveIndex,
      titleFilterValue,
    ],
  )

  return (
    <div className="flex h-full w-full flex-col items-end relative select-none">
      <div className="flex relative top-[-5px] h-[44px] w-8/12 pb-1 pr-2 text-indigo-400 pt-3 text-xl">
        <div className="relative flex w-full">
          <section className="w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-indigo-400/60"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="search"
              className="w-full rounded-md border border-gray-400/50 bg-gray-300 pl-10 pr-4 text-gray-500 shadow-inner outline-none dark:bg-gray-700 dark:text-gray-400"
              type="search"
              placeholder="Search"
              value={titleFilterValue}
              onChange={handleSearchChange}
            />
          </section>
        </div>
        {/* <section className="ml-2 flex cursor-pointer items-center gap-2 rounded-lg rounded-t border-x border-t border-zinc-400/50 bg-stone-300 px-2 text-gray-400 shadow-sm transition-all duration-300 ease-in-out dark:border-zinc-600 dark:bg-stone-800/50 dark:text-gray-500">
          <Icon name="Filter" className="h-4 w-4" />
          <p className="select-none">Filter</p>
        </section> */}
      </div>
      {state === "loading" ? (
        <LoadingScreen />
      ) : (
        <Tree
          {...required}
          {...handlers}
          classes={
            {
              treeWrapper: "flex flex-grow overflow-y-auto w-full",
              children: "h-full w-full",
              selectedNodeWrapper: "!bg-transparent",
            } as ClassesType
          }
          draggable={false}
          gapMode={"margin"}
          depthGap={8}
          disableLines={true}
          disableHorizontalLines={false}
          disableVerticalLines={false}
          verticalLineTopOffset={0}
          verticalLineOffset={0}
          renderNode={renderNode}
        />
      )}
    </div>
  )
}

// Wrap the main component with the provider
const ChessLinesTree = ({ pgn, loadPgn }) => {
  return (
    <MoveStateProvider>
      <ChessLinesTreeContent pgn={pgn} loadPgn={loadPgn} />
    </MoveStateProvider>
  )
}

export default ChessLinesTree
