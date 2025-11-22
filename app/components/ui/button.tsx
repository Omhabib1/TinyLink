'use client'
import React from 'react'
export function Button({ children, ...props }: any) {
  return (
    <button {...props} className={(props.className||'') + ' px-4 py-2 rounded'}>
      {children}
    </button>
  )
}
export default Button
