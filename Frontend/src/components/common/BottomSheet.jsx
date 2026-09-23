import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const SNAP_POINTS = {
  PEEK: 'peek',
  HALF: 'half',
  FULL: 'full',
}

export const DEFAULT_SNAP_HEIGHTS = {
  [SNAP_POINTS.PEEK]: '18vh',
  [SNAP_POINTS.HALF]: '48vh',
  [SNAP_POINTS.FULL]: '92vh',
}

const BottomSheet = ({
  snapPoint = SNAP_POINTS.HALF,
  onSnapChange,
  snapHeights = DEFAULT_SNAP_HEIGHTS,
  children,
  className = '',
}) => {
  const sheetRef = useRef(null)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)
  const pointerState = useRef({ active: false })

  // Smoothly animate height when snapPoint changes programmatically
  useEffect(() => {
    if (!sheetRef.current || pointerState.current.active) return undefined

    const targetHeight = snapHeights[snapPoint] || snapHeights[SNAP_POINTS.HALF]

    gsap.to(sheetRef.current, {
      height: targetHeight,
      y: 0,
      duration: 0.35,
      ease: 'power3.out',
    })

    return undefined
  }, [snapPoint, snapHeights])

  const handleDragStart = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragStartY.current = event.clientY
    dragStartHeight.current = sheetRef.current
      ? sheetRef.current.getBoundingClientRect().height
      : window.innerHeight * 0.48
    pointerState.current.active = true
  }

  const handleDragMove = (event) => {
    if (!pointerState.current.active || !sheetRef.current) return

    const delta = event.clientY - dragStartY.current
    let targetHeight = dragStartHeight.current - delta
    const minHeight = window.innerHeight * 0.14
    const maxHeight = window.innerHeight * 0.94

    // Apply rubber-band resistance beyond boundaries
    if (targetHeight > maxHeight) {
      targetHeight = maxHeight + (targetHeight - maxHeight) * 0.15
    } else if (targetHeight < minHeight) {
      targetHeight = minHeight - (minHeight - targetHeight) * 0.15
    }

    gsap.set(sheetRef.current, { height: targetHeight, y: 0 })
  }

  const handleDragEnd = (event) => {
    if (!sheetRef.current || !pointerState.current.active) return

    pointerState.current.active = false
    const delta = event.clientY - dragStartY.current
    const currentHeight = sheetRef.current.getBoundingClientRect().height
    const vh = window.innerHeight

    let nextSnap = SNAP_POINTS.HALF

    if (delta < -35) {
      // Swiped Upwards
      if (currentHeight > vh * 0.50) {
        nextSnap = SNAP_POINTS.FULL
      } else {
        nextSnap = SNAP_POINTS.HALF
      }
    } else if (delta > 35) {
      // Swiped Downwards
      if (currentHeight < vh * 0.36) {
        nextSnap = SNAP_POINTS.PEEK
      } else {
        nextSnap = SNAP_POINTS.HALF
      }
    } else {
      // Geometric closeness to closest snap point
      if (currentHeight < vh * 0.28) {
        nextSnap = SNAP_POINTS.PEEK
      } else if (currentHeight > vh * 0.65) {
        nextSnap = SNAP_POINTS.FULL
      } else {
        nextSnap = SNAP_POINTS.HALF
      }
    }

    onSnapChange?.(nextSnap)

    gsap.to(sheetRef.current, {
      height: snapHeights[nextSnap] || DEFAULT_SNAP_HEIGHTS[nextSnap],
      y: 0,
      duration: 0.35,
      ease: 'power3.out',
    })
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <section
        ref={sheetRef}
        style={{ touchAction: 'none' }}
        className={`pointer-events-auto flex w-full max-w-lg flex-col overflow-hidden rounded-t-[26px] sm:rounded-t-[30px] border-t border-black/5 bg-[#fbf9f8] shadow-[0_-8px_32px_rgba(0,0,0,0.16)] backdrop-blur-md transition-[border-radius] ${className}`}
      >
        {/* Native Drag Handle Bar */}
        <div
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onLostPointerCapture={handleDragEnd}
          className="flex cursor-grab select-none flex-col items-center justify-center px-4 pt-2.5 pb-2 active:cursor-grabbing"
        >
          <div className="h-1.5 w-11 rounded-full bg-[#d0cac5] transition-all hover:bg-[#b0a9a3]" />
        </div>

        {/* Sheet Content Area with mobile safe area bottom padding */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-1 sm:px-5">
          {children}
        </div>
      </section>
    </div>
  )
}

export default BottomSheet
