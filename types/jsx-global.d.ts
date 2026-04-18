import type React from 'react'

declare global {
  // React 19 types provide JSX under React.JSX; many files in this repo use JSX.Element.
  // This bridges the global JSX namespace to React.JSX for compatibility.
  namespace JSX {
    type Element = React.JSX.Element
  }
}

export {}
