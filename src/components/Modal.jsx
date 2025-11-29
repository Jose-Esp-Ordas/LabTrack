import React from 'react'

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <>
      <div className='h-full w-full fixed top-0 left-0 backdrop-blur-md flex justify-center items-center'>
        <div className='bg-indigo-950 p-4 rounded shadow-md relative'>
          {/* Close button uses onClose so the prop is actually used */}
          {onClose && (
            <button
              onClick={onClose}
              className='absolute top-2 right-2 text-white bg-rosita rounded-full w-8 h-8 flex items-center justify-center'
              aria-label='Cerrar'
            >
              ×
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
