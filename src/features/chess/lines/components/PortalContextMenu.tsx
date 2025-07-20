// Enhanced PortalContextMenu.tsx with bottom overflow protection
import React, { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface PortalContextMenuProps {
  children: React.ReactNode
  isOpen: boolean
  triggerRect?: DOMRect
  onClose: () => void
}

export const PortalContextMenu: React.FC<PortalContextMenuProps> = ({
  children,
  isOpen,
  triggerRect,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !triggerRect) return null

  // Calculate smart positioning
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // Estimate menu height (conservative estimate for both dialog states)
  const estimatedMenuHeight = 160 // Covers both initial and confirmation dialogs

  let x = Math.min(triggerRect.left, viewport.width - 300)
  let y = triggerRect.bottom + 4

  // Check if menu would overflow bottom
  const wouldOverflowBottom = y + estimatedMenuHeight > viewport.height - 16

  if (wouldOverflowBottom) {
    // Position above the trigger
    y = triggerRect.top - estimatedMenuHeight - 4

    // If still overflowing top, position at top of viewport
    if (y < 16) {
      y = 16
    }
  }

  // Ensure minimum margins
  x = Math.max(8, x)
  y = Math.max(8, y)

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[1000] max-w-[280px] w-max"
      style={{ left: x, top: y }}
    >
      {children}
    </div>,
    document.body,
  )
}
