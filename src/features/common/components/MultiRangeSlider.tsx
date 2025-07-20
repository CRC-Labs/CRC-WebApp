import React, { useCallback, useEffect, useRef } from "react"

import classnames from "classnames"
import { Icon } from "../utils/icons"


function MultiRangeSlider({
  min,
  max,
  minTurn,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
  locked,
  width,
}) {
  const minValRef = useRef(null)
  const maxValRef = useRef(null)
  const range = useRef(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal)
      const maxPercent = getPercent(+maxValRef.current.value) // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value)
      const maxPercent = getPercent(maxVal)

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxVal, getPercent])

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1)
          if (value >= minTurn) {
            setMinVal(value)
            event.target.value = value.toString()
          }
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1)
          setMaxVal(value)
          event.target.value = value.toString()
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider relative">
        {locked && (
          <div
            className="absolute flex flex-col text-gray-600 dark:text-gray-100"
            style={{
              top: "5px",
              left: ((minTurn - 1) / 39) * 97 + "%",
            }}
          >
            <p style={{ paddingLeft: 1 + width / 90 }}>|</p>
            <Icon
              name="LockClosed"
              style={{
                position: "absolute",
                width: width / 32,
                height: width / 32,
                right: width / 160 - 1,
                top: 6 - width / 130,
              }}
            />
          </div>
        )}
        <div className="slider__track ml-2 bg-indigo-400/40" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  )
}

export default MultiRangeSlider
