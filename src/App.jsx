import React, { useEffect, useState } from 'react'
    import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
    import { auth } from './firebase'
    import { onAuthStateChanged } from 'firebase/auth'
    import Login from './pages/Login'
    import Dashboard from './pages/Dashboard'
    import InventoryManagement from './pages/InventoryManagement'
    import SalesTracking from './pages/SalesTracking'
    import Reports from './pages/Reports'
    import Settings from './pages/Settings'

    function App() {
      const [user, setUser] = useState(null)
      const [loading, setLoading] = useState(true)

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
        return () => unsubscribe()
      }, [])

      if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
      }

      return (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/inventory-management"
              element={user ? <InventoryManagement /> : <Navigate to="/" />}
            />
            <Route
              path="/sales-tracking"
              element={user ? <SalesTracking /> : <Navigate to="/" />}
            />
            <Route
              path="/reports"
              element={user ? <Reports /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/" />}
            />
          </Routes>
        </BrowserRouter>
      )
    }

    export default App
