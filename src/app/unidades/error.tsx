'use client'

import { error } from "console"
import Error from "next/error"


export default function ErrorPage() {
  return (
    <div>
      <h1>Error while login</h1>
     { <p>Error: {Error.displayName}</p>}
    </div>
  )
}