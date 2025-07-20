import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { ClerkProvider } from '@clerk/nextjs'

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem>
        {children}
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default RootProvider