'use client'

export default function KitSlot({ children, exiting }) {
  return (
    <div
      className="w-full h-full transition-all duration-300 ease-in-out"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateY(-8px)' : 'translateY(0px)',
      }}
    >
      {children}
    </div>
  )
}