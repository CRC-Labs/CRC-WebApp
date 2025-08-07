import React, { useEffect, useRef } from "react"

import * as d3 from "d3"
import { isEqual } from "lodash/lang"

import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"
import RadialMenu from "@/features/chess/sunburst/components/RadialMenu"
import {
  firstIsUppercase,
  getPieceImagePathFromSan,
} from "@/features/common/utils/utils"

/**
 * A custom hook that returns the previous value of a variable.
 * The `usePrevious` hook takes a value and returns the previous value of that value.
 * The hook uses the `useRef` and `useEffect` hooks to store and update the previous value.
 * @param value The value to get the previous value of.
 * @returns The previous value of the value.
 */
function usePrevious(value) {
  const ref = useRef(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
/**
 * A component that displays a sunburst chart of chess openings.
 * The `ChessSunburst` component takes a `showMenu` boolean and a `setShowMenu` function as props and displays a sunburst chart of chess openings.
 * The component uses the `useRef`, `usePrevious`, `useEffect`, `useBoardProvider`, and `isEqual` functions to manage state and render the sunburst chart.
 * The `useEffect` hook handles changes in the props and renders the sunburst chart.
 * @param showMenu A boolean indicating whether to show the menu.
 * @param setShowMenu A function to set the `showMenu` state.
 * @returns A component that displays a sunburst chart of chess openings.
 */
const Sunburst = (props) => {
  const svgRef = useRef(undefined)

  const { boardApi, playTemporaryMoves, resetBoard } = useBoardProvider()
  const prevProps = usePrevious(props)
  let showMenu = props.showMenu
  let setShowMenu = props.setShowMenu

  useEffect(() => {
    if (!prevProps) {
      renderSunburst(undefined, props)
    } else if (
      prevProps.fen !== props.fen ||
      !isEqual(prevProps.data, props.data)
    ) {
      renderSunburst(
        {
          ...prevProps,
          data: props.prevData || prevProps.data,
        },
        props,
      )
    }
  }, [props.fen, props.data, props.prevData])

  /**
   * A function that renders the sunburst chart based on changes in the props.
   * The function takes `prevProps` and `newProps` as arguments and uses D3.js to render the sunburst chart.
   * The function uses the `d3` library to select and manipulate SVG elements.
   * The function uses the `useBoardProvider`, `findCurrentNode`, `clicked`, `clickedBack`, `labelTransform`, `getPieceImagePathFromSan`, `firstIsUppercase`, `isEqual`, `eraseAll`, `labelVisible`, `arcVisible`, and `transitionTo` functions to manage state and render the sunburst chart.
   * @param prevProps The previous props.
   * @param newProps The new props.
   * @returns A function that renders the sunburst chart based on changes in the props.
   */
  const renderSunburst = (prevProps, newProps) => {
    // Disable pointer events for clickable elements
    d3.selectAll("#Sunburst-svg > .clickable").style("pointer-events", "none")

    const firstRender = !prevProps
    let transition = false
    let renderProps
    if (firstRender) {
      renderProps = newProps
    } else {
      // Si la FEN a changé, nous allons utiliser les anciennes props pour le rendu initial de la transition
      if (prevProps.fen === newProps.fen) {
        renderProps = newProps
      } else {
        renderProps = prevProps
        transition = true
      }
    }
    if (!renderProps.data) return

    // Erase all existing elements
    eraseAll()

    // Create a hierarchy of the data and sort it
    const tmpRoot = d3
      .hierarchy(props.data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)

    // Partition the hierarchy and set the root node
    let root = d3.partition().size([2 * Math.PI, tmpRoot.height + 1])(tmpRoot)

    // Set the `current` property of each node to its current position
    root.each((d) => {
      d.current = {
        x0: d.x0,
        x1: d.x1,
        y0: d.y0,
        y1: d.y1,
      }
    })

    // Initialize variables for the current and transition nodes
    let currentNode
    let transitionNode

    // If this is a transition, find the current and transition nodes based on the previous and new FEN strings
    if (transition) {
      currentNode = findCurrentNode(root, prevProps.fen)
      transitionNode = findCurrentNode(root, newProps.fen)
    } else {
      // If this is not a transition, find the current node based on the current FEN string
      currentNode = findCurrentNode(root, props.fen)
    }

    // If the current node is not found, try to find it based on the new FEN string
    if (!currentNode) {
      currentNode = findCurrentNode(root, newProps.fen)
      // If the current node is still not found, return
      if (!currentNode) {
        return
      }
    }

    // Check if the currentNode is not the root node
    if (currentNode.depth !== 0) {
      // Check if a transitionNode is defined
      if (transitionNode !== undefined) {
        // Check if the depth of the transitionNode is less than the depth of the currentNode
        if (transitionNode.depth < currentNode.depth) {
          // If the transition is a dezoom, reduce the y values of each node by 1
          root.each((d) => {
            let p = currentNode
            d.current = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: d.y0 - 1,
              y1: d.y1 - 1,
            }
          })
        }
      }
    }

    // Set the width of the sunburst chart
    const width = 900

    // Set the radius of the sunburst chart
    const radius = width / 6

    // Create an arc generator for the sunburst chart
    const arc = d3
      .arc()
      .startAngle((d) => d.x0) // Set the start angle of the arc
      .endAngle((d) => d.x1) // Set the end angle of the arc
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005)) // Set the padding angle of the arc
      .padRadius(radius * 1.5) // Set the padding radius of the arc
      .innerRadius((d) => d.y0 * radius) // Set the inner radius of the arc
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1)) // Set the outer radius of the arc

    // Select the SVG element with the ID "Sunburst-svg"
    const svg = d3.select("#Sunburst-svg")

    // Set the viewBox attribute of the SVG element to [0, 0, width, width]
    svg.attr("viewBox", [0, 0, width, width])

    // Set the pointer-events attribute of the SVG element to "none"
    svg.attr("pointer-events", "none")

    // Set the touch-action style of the SVG element to "none"
    svg.style("touch-action", "none")

    // Set the user-select style of the SVG element to "none"
    svg.style("user-select", "none")

    // Set the font style of the SVG element to "10px sans-serif"
    svg.style("font", "10px sans-serif")

    // Create a new group element and append it to the SVG element
    const g = svg.append("g")

    // Set the pointer-events attribute of the group element to "none"
    g.attr("pointer-events", "none")

    // Set the touch-action style of the group element to "none"
    g.style("touch-action", "none")

    // Set the user-select style of the group element to "none"
    g.style("user-select", "none")

    // Set the transform attribute of the group element to translate the element to the center of the SVG element
    g.attr("transform", `translate(${width / 2},${width / 2})`)

    const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .attr("pointer-events", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-opacity", (d) => (arcVisible(d.current) ? 1 : 0))
      .attr("stroke-width", "1")
      .attr("fill-opacity", (d) => (arcVisible(d.current) ? 1 : 0))
      .style("user-select", "none")
      .style("touch-action", "none")
      .attr("d", (d) => arc(d.current))

    // Filter the path elements based on whether they are visible using the `arcVisible` function
    path
      .filter((d) => arcVisible(d))
      .style("cursor", "pointer")
      .attr("pointer-events", "fill")
      .attr("class", (d) => {
        // Check if the move property of the data is undefined
        if (!d.data.move) {
          return ""
        }
        // Check if the color property of the move property is "b"
        if (d.data.move.color === "b") {
          return "clickable fill-zinc-800"
        } else {
          return "clickable fill-zinc-100"
        }
      })
      .on("contextmenu", (event, d) => {
        // Prevent the default context menu
        event.preventDefault()
        // Stop the event from propagating
        event.stopPropagation()

        let shapes = []
        let moves = []
        if (d.depth === 2) {
          // If the depth of the data is 2, add the parent move to the moves array
          moves.push(d.parent.data.move)
        }
        // Add the current move to the moves array
        moves.push(d.data.move)

        // Add the shape to the shapes array
        shapes.push({
          orig: d.data.move.from,
          dest: d.data.move.to,
          modifiers: {
            lineWidth: 6,
          },
          brush: d.data.move.suggestion ? "green" : "blue",
        })

        // Play the temporary moves and set the auto shapes
        playTemporaryMoves(moves)
        boardApi.current.setAutoShapes(shapes)
        setShowMenu(d.data)
      })
      .on("click", (event, d) => {
        // Call the clicked function with the data and newProps
        clicked(d, newProps)
      })

    // Add this helper function to calculate text width estimation
    function estimateTextWidth(text: string, fontSize: number): number {
      // Rough estimation: each character is approximately 0.6 * fontSize pixels wide
      // Adjust this multiplier based on your font
      return text.length * fontSize * 0.6
    }

    // Create a new group element and append it to the `g` element
    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("g")
      .attr("dy", "0.35em")
      .attr("class", (d) => {
        // ✅ Dynamic font sizing based on text length and segment size
        const segmentWidth = getSegmentWidth(d, radius)
        const moveText =
          d.data.move.san.startsWith("O-O") ||
          !firstIsUppercase(d.data.move.san)
            ? d.data.move.san
            : d.data.move.san.slice(1)

        let fontSize = 32 // Base size for text-4xl

        // Special case for promotion moves
        if (d.data.move.san.includes("=")) {
          fontSize = 24 // text-2xl
        }

        // Calculate if text fits in segment
        let estimatedWidth = estimateTextWidth(moveText, fontSize)

        // If text is too wide, reduce font size
        if (estimatedWidth > segmentWidth * 0.8) {
          // Use 80% of available space
          if (estimatedWidth > segmentWidth * 1.2) {
            fontSize = 16 // text-xl
          } else if (estimatedWidth > segmentWidth) {
            fontSize = 20 // text-2xl
          }
        }

        // Convert fontSize to Tailwind class
        let sizeClass = "text-3xl"
        if (fontSize <= 16) sizeClass = "text-xl"
        else if (fontSize <= 20) sizeClass = "text-xl"
        else if (fontSize <= 24) sizeClass = "text-2xl"

        // Set the class based on move color
        if (d.data.move.color === "b") {
          return "font-bold stroke-[#cccccc] " + sizeClass
        }
        return "font-bold stroke-[#333333] " + sizeClass
      })
      .attr("fill", (d) => {
        if (d.data.move.suggestion) {
          return "#65a30d"
        }
        if (d.data.move.color === "b") {
          return "#333333"
        }
        return "#cccccc"
      })
      .attr("fill-opacity", (d) => +labelVisible(d.current))
      .attr("transform", (d) => {
        // ✅ Enhanced label transform with text-aware positioning
        return enhancedLabelTransform(d, radius)
      })
      .append("text")
      .text((d) => {
        if (
          d.data.move.san.startsWith("O-O") ||
          !firstIsUppercase(d.data.move.san)
        ) {
          return d.data.move.san
        } else {
          return d.data.move.san.slice(1)
        }
      })
      .select(function () {
        return this.parentNode
      })
      .filter(function (d) {
        if (
          !d.data.move.san.startsWith("O-O") &&
          firstIsUppercase(d.data.move.san)
        ) {
          return true
        }
        return false
      })
      .append("image")
      .attr("xlink:href", (d) => {
        return getPieceImagePathFromSan(d.data.move.san, d.data.move.color)
      })
      .attr("x", (d) => {
        // ✅ Dynamic image positioning based on text length
        const textLength = d.data.move.san.length
        if (textLength >= 4) return "-80"
        return "-60"
      })
      .attr("y", "-40")

    const parent = g
      .append("circle")
      .style("user-select", "none")
      .datum(root)
      .attr("r", radius)
      .attr("pointer-events", "fill")
      .attr("class", (d) => {
        let pointer
        if (!root.data.move) {
          pointer = ""
          return "fill-zinc-500"
        } else {
          pointer = "cursor-pointer "
        }
        if (root.data.move.color === "b") {
          return pointer + "clickable z-10 fill-zinc-800"
        } else {
          return pointer + "clickable z-10 fill-zinc-100"
        }
      })
      .attr("stroke", "#000")
      .attr("stroke-width", "1")
      .attr("stroke-opacity", "0.5")
      .on("click", () => {
        clickedBack(currentNode, newProps)
      })

    if (transition) {
      transitionTo(
        parent,
        root,
        currentNode,
        transitionNode,
        g,
        path,
        label,
        arc,
        radius,
        props,
        newProps,
      )
    }
  }
  d3.selectAll("#Sunburst-svg > .clickable").style("pointer-events", "fill")

  if (!prevProps) {
    renderSunburst(undefined, props)
  }
  return (
    <>
      {showMenu !== false ? (
        <RadialMenu
          position={props.showMenu}
          deleteMoveFromRepertoire={props.deleteMoveFromRepertoire}
          closeMenu={(e) => {
            e.preventDefault()
            boardApi.current.setAutoShapes([])
            resetBoard()
            setShowMenu(false)
          }}
        />
      ) : (
        <></>
      )}

      <svg
        ref={svgRef}
        className="relative z-20 h-full w-full"
        // style={{ height: props.height, width: props.width, display: "table" }}
        id="Sunburst-svg"
      />
    </>
  )
}

/**
 * A function that handles a click event on a node in the sunburst chart.
 * The `clicked` function takes a node and props and calls the `onSelect` function with the selected move(s).
 * If the node is a move node, the function calls the `onSelect` function with the selected move and its parent move.
 * If the node is not a move node, the function calls the `onSelect` function with the selected move.
 * @param d The node that was clicked.
 * @param props The props of the sunburst chart.
 */
function clicked(d, props) {
  if (d.depth === 2) {
    // If the node is a move node, call the `onSelect` function with the selected move and its parent move
    props.onSelect && props.onSelect(d.data.move, d.parent.data.move)
  } else {
    // If the node is not a move node, call the `onSelect` function with the selected move
    props.onSelect && props.onSelect(d.data.move)
  }
}

/**
 * A function that determines whether an arc is visible in the sunburst chart.
 * The `arcVisible` function takes a node and returns a boolean indicating whether the arc is visible.
 * The function checks if the node's depth is between 1 and 3 and if the arc has a positive extent.
 * @param d The node to check.
 * @returns A boolean indicating whether the arc is visible.
 */
function arcVisible(d) {
  // Check if the node's depth is between 1 and 3 and if the arc has a positive extent
  return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0
}

/**
 * A function that determines whether a label is visible in the sunburst chart.
 * The `labelVisible` function takes a node and returns a boolean indicating whether the label is visible.
 * The function checks if the node's depth is between 1 and 3 and if the label has a minimum area.
 * @param d The node to check.
 * @returns A boolean indicating whether the label is visible.
 */
function labelVisible(d) {
  // Check if the node's depth is between 1 and 3 and if the label has a minimum area
  return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
}

// Add this function to calculate available space in a segment
function getSegmentWidth(d: any, radius: number): number {
  const currentRadius = ((d.current.y0 + d.current.y1) / 2) * radius
  const angularWidth = d.current.x1 - d.current.x0
  // Calculate the arc length at the text radius
  return currentRadius * angularWidth
}

/**
 * A function that transforms the label of a node in the sunburst chart.
 * The `labelTransform` function takes a node, radius, and withIcon boolean and returns a string representing the label transformation.
 * The function computes the angle, x, and y values for the label and returns a string representing the label transformation.
 * If `withIcon` is true, the function adjusts the label position based on the angle.
 * @param node The node to transform the label of.
 * @param radius The radius of the sunburst chart.
 * @param withIcon A boolean indicating whether to adjust the label position based on the angle.
 * @returns A string representing the label transformation.
 */
function enhancedLabelTransform(
  node: any,
  radius: number,
  withIcon = false,
): string {
  const d = node.current
  const angle = 90
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
  const baseY = ((d.y0 + d.y1) / 2) * (radius - 5)

  const moveText =
    node.data.move.san.startsWith("O-O") ||
    !firstIsUppercase(node.data.move.san)
      ? node.data.move.san
      : node.data.move.san.slice(1)

  const textLength = moveText.length
  const normalizedAngle = (x - angle + 360) % 360

  let adjustedY = baseY

  // ✅ Step 1: Initial positioning logic
  if (withIcon) {
    if (normalizedAngle >= 90 && normalizedAngle <= 270) {
      // LEFT SIDE: Move labels INWARD
      adjustedY = baseY + Math.max(4, textLength * 1.5)
    } else {
      // RIGHT SIDE: Move labels OUTWARD
      adjustedY = baseY + Math.max(15, textLength * 3) + 5
    }
  } else {
    if (normalizedAngle >= 90 && normalizedAngle <= 270) {
      // LEFT SIDE: Move labels INWARD
      adjustedY = baseY + Math.max(2, textLength) - 13
    } else {
      // RIGHT SIDE: Move labels OUTWARD
      adjustedY = baseY + Math.max(8, textLength * 2) + 13
    }
  }

  // ✅ Step 2: Fine-tune by MODIFYING the existing adjustedY
  if (normalizedAngle >= 160 && normalizedAngle <= 200) {
    // Right side area - add extra outward push
    adjustedY += 3 // ✅ ADD to existing position, don't replace
  } else if (normalizedAngle >= 90 && normalizedAngle < 160) {
    // Left side area - adjust for "Nbd7" and similar labels
    adjustedY -= Math.max(2, textLength * 0.5) // ✅ SUBTRACT to move more inward
  } else if (normalizedAngle >= 250 && normalizedAngle <= 290) {
    // Bottom area - slight adjustment
    adjustedY += 2 // ✅ ADD to existing position
  }

  return `rotate(${x - angle}) translate(${adjustedY},0) rotate(${-x + angle})`
}

function transitionTo(
  parent,
  root,
  currentNode,
  transitionNode,
  g,
  path,
  label,
  arc,
  radius,
  props,
  newProps,
) {
  if (transitionNode !== undefined) {
    let p = transitionNode
    parent.datum(p.parent || root)
    if (transitionNode.depth > currentNode.depth) {
      root.each((d) => {
        d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        }
      })
    } else {
      //dezoom
      root.each((d) => {
        d.target = {
          x0: d.x0,
          x1: d.x1,
          y0: d.y0,
          y1: d.y1,
        }
      })
    }
  } else {
    props.updateData && props.updateData(newProps.fen)
    return
  }

  const t = g
    .transition()
    .on("start", () => {
      d3.selectAll("#Sunburst-svg > .clickable").style("pointer-events", "none")
      //document.getElementById("Sunburst-svg").style.pointerEvents = "none"
    })
    .on("end", () => {
      //document.getElementById("Sunburst-svg").style.pointerEvents = "all"
      d3.selectAll("#Sunburst-svg > .clickable").style("pointer-events", "fill")

      if (transitionNode !== undefined) {
        if (transitionNode.depth > currentNode.depth) {
          currentNode = transitionNode
          props.updateData &&
            props.updateData(
              transitionNode.data.move.nextFen,
              transitionNode.data.move,
            )
        }
        currentNode = transitionNode
      } else {
      }
    })
    .duration(100)

  // Transition the data on all arcs, even the ones that aren’t visible,
  // so that if this transition is interrupted, entering arcs will start
  // the next transition from the desired position.
  path
    .transition(t)
    .tween("data", (d) => {
      const i = d3.interpolate(d.current, d.target)
      return (t) => {
        d.current = i(t)
      }
    })
    .filter(function (d) {
      return +this.getAttribute("fill-opacity") || arcVisible(d.target)
    })
    .attr("fill-opacity", (d) => (arcVisible(d.target) ? 1 : 0))
    .attr("stroke-opacity", (d) => (arcVisible(d.target) ? 1 : 0))
    .attrTween("d", (d) => () => arc(d.current))

  label
    .filter(function (d) {
      return +this.getAttribute("fill-opacity") || labelVisible(d.target)
    })
    .transition(t)
    .attr("fill-opacity", (d) => +labelVisible(d.target))
    .attrTween("transform", (d) => () => enhancedLabelTransform(d, radius))
}

/**
 * A function that handles a click event on the back button in the sunburst chart.
 * The `clickedBack` function takes a currentNode and props and calls the `undo` function if the currentNode has a move.
 * If the currentNode does not have a move, the function does nothing.
 * @param currentNode The current node in the sunburst chart.
 * @param props The props of the sunburst chart.
 */
function clickedBack(currentNode, props) {
  if (currentNode.data.move !== null) {
    // If the currentNode has a move, call the `undo` function
    props.undo && props.undo()
  }
}

/**
 * A function that finds the current node in the sunburst chart based on the FEN string.
 * The `findCurrentNode` function takes a root node and a FEN string and returns the current node in the sunburst chart.
 * The function searches the root node and its children for a node with a matching FEN string.
 * If a matching node is found, the function returns the node.
 * If a matching node is not found, the function returns undefined.
 * @param root The root node of the sunburst chart.
 * @param fen The FEN string to search for.
 * @returns The current node in the sunburst chart.
 */
function findCurrentNode(root, fen) {
  // Check if the root node has a matching FEN string
  if (root.data.fen === fen) {
    return root
  }
  // Check the children of the root node for a matching FEN string
  for (var childId in root.children) {
    let childNode = root.children[childId]
    if (childNode.data.move.nextFen === fen) {
      return childNode
    }
    // Check the children of the child node for a matching FEN string
    for (var subChildId in childNode.children) {
      let subChildNode = childNode.children[subChildId]
      if (subChildNode.data.move.nextFen === fen) {
        return subChildNode
      }
    }
  }
  // If a matching node is not found, return undefined
  return undefined
}

function eraseAll() {
  document.querySelectorAll("#Sunburst-svg > g").forEach((node) => {
    node.remove()
  })
}

export default Sunburst
