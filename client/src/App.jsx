import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import WebsiteEditor from './pages/Editor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'

export const serverUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

function App() {
  useGetCurrentUser()

  const { userData } = useSelector(state => state.user)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#08090d] text-white">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/dashboard"
            element={userData ? <Dashboard /> : <Home />}
          />

          <Route
            path="/generate"
            element={userData ? <Generate /> : <Home />}
          />

          <Route
            path="/editor/:id"
            element={userData ? <WebsiteEditor /> : <Home />}
          />

          <Route
            path="/site/:id"
            element={<LiveSite />}
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App