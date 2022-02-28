import React, { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
  return <div style={{ padding: '2rem' }}>{children}</div>
}

export default Layout
