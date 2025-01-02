import React, { useState } from 'react'
    import { signInWithEmailAndPassword } from 'firebase/auth'
    import { auth } from '../firebase'
    import { useNavigate } from 'react-router-dom'

    export default function Login() {
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [error, setError] = useState('')
      const navigate = useNavigate()

      const handleLogin = async (e) => {
        e.preventDefault()
        try {
          await signInWithEmailAndPassword(auth, email, password)
          navigate('/dashboard')
        } catch (error) {
          setError('Invalid email or password')
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )
    }
