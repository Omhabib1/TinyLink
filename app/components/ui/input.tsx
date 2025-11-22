'use client'
import React from 'react'
export function Input(props: any) {
  return <input {...props} className={(props.className||'') + ' px-3 py-2 border rounded'} />
}
export default Input
