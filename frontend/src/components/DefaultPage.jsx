import React from 'react'
import { Flash } from '../flash'

const DefaultPage = ({children}) => {

  return (
    <>
      <Flash/>
      {children}
    </>
  )
}

export default DefaultPage