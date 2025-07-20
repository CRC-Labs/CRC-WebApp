export function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  } else {
    return value
  }
}

export function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value)
    }
  }
  return value
}

export function getWidthAndHeight() {
  let width
  let height
  if (window.innerWidth >= window.innerHeight) {
    //paysage or square
    width = window.innerWidth / 2
    height = Math.min(window.innerHeight, width)
    width = height
  } else {
    //landscape
    //width=window.innerWidth
    height = window.innerHeight / 2
    width = Math.min(window.innerWidth, height)
    height = width
  }
  return [width, height]
}

export function getWindowWidthAndHeight() {
  let orientation
  const diff = Math.abs(window.innerWidth - window.innerHeight)
  const ratio = window.innerWidth / window.innerHeight

  if (window.innerWidth >= window.innerHeight) {
    //paysage or square
    if (ratio <= 1.2) {
      //pretty squary
      orientation = "square"
    } else if (ratio <= 1.5) {
      orientation = "sm-landscape"
    } else {
      orientation = "lg-landscape"
    }
  } else {
    if (ratio >= 0.8) {
      //pretty squary
      orientation = "square"
    } else if (ratio >= 0.6) {
      orientation = "sm-portrait"
    } else {
      orientation = "lg-portrait"
    }
  }
  return [window.innerWidth, window.innerHeight, orientation]
}