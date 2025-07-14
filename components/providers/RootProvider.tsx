import React from 'react'

const RootProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <div>{children}</div>
  )
}

export default RootProvider