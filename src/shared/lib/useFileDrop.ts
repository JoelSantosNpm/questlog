'use client'

import { DragEvent, useCallback, useState } from 'react'

interface UseFileDropProps {
  onDropFile: (file: File) => void
  disabled?: boolean
}

export function useFileDrop({ onDropFile, disabled }: UseFileDropProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [disabled])

  const handleDrop = useCallback((e: DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      onDropFile(droppedFile)
    }
  }, [disabled, onDropFile])

  return {
    isDragging,
    handleDrag,
    handleDrop
  }
}
