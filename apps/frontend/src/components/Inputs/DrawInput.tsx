'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import BaseInput, { BaseInputProps } from "./BaseInput"
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import Button from "../Button";

import { HiOutlineTrash } from "react-icons/hi";



type DrawInputProps = {
  baseInputProps?: BaseInputProps
  title?: string
  isRequired?: boolean
}

const DrawInput = forwardRef<ReactSketchCanvasRef, DrawInputProps>((props, ref) => {

  const {
    title,
    isRequired,
    baseInputProps
  } = props

  const canvasRef = useRef<ReactSketchCanvasRef>(null)

  useImperativeHandle(ref, () => canvasRef.current!, [])


  const [isDrawing, setIsDrawing] = useState(false)

  const handleChange = async () => {
    if (await canvasRef.current?.getSketchingTime() !== 0) {
      setIsDrawing(true)
    }
  }

  const handleReset = () => {
    setIsDrawing(false)
    canvasRef.current?.clearCanvas()
  }


  return <BaseInput {...baseInputProps} isRequired={isRequired}>
    <div className="relative border border-indigo-500 rounded-sm overflow-hidden">
      <ReactSketchCanvas
        ref={canvasRef}
        withTimestamp
        strokeColor="black"
        style={{}}
        onChange={handleChange}
      />
      {!isDrawing && title && <p className="pointer-events-none absolute text-indigo-400 top-2.5 left-2.5">{title}</p>}
      {isDrawing && <Button
        startContent={<HiOutlineTrash />}
        onClick={handleReset}
        className="h-[auto] min-w-[auto] min-h-[auto] top-2.5 right-2.5 absolute p-2"
      />}
    </div>
  </BaseInput>

})

export default DrawInput