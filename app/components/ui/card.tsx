import React from 'react'
export function Card({ children }: any) {
  return <div className="border rounded-lg p-4 bg-white">{children}</div>
}
export function CardHeader({ children }: any) { return <div className="mb-2">{children}</div> }
export function CardTitle({ children, className='', any }: any) { return <h3 className={className}>{children}</h3> }
export function CardContent({ children }: any) { return <div>{children}</div> }
