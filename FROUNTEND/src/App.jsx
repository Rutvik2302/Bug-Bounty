import { useState } from 'react'
import './App.css'
import { Route, Routes, Link, Navigate, Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-blue-200 text-xl'>This is Bug-Bounty Project</h1>
    </>
  )
}

export default App
