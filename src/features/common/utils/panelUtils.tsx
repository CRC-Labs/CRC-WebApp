interface panel {
  name: string
  icon: string
}

/**
   * Returns the panel at the given index.
   * If the index is -1, returns the last panel.
   * If the index is equal to the number of panels, returns the first panel.
   * Otherwise, returns the panel at the given index.
   * @param panelIndex The index of the panel to return.
   * @returns The panel at the given index.
   */
export function getPanel(panelIndex: number, panels: panel[]): panel {
  if (panelIndex === -1) {
    return panels[panels.length - 1]
  }
  if (panelIndex === panels.length) {
    return panels[0]
  }
  return panels[panelIndex]
}

export function validatePanelIndex(
  value: number,
  panelsLength: number,
): number | null {
  if (value === -1) {
    return panelsLength - 1
  }
  if (value === panelsLength) {
    return 0
  }
  if (value < 0 || value >= panelsLength) {
    return null
  }
  return value
}
