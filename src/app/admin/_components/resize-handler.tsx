export default function ResizeHandler({ onResize }: { onResize: (e: unknown) => void }) {
  return (
    <div onMouseDown={onResize} onTouchStart={onResize} className="absolute top-0 right-0 h-full w-2.5 cursor-col-resize touch-none select-none">
      <span className="sr-only">resize</span>
    </div>
  )
}
