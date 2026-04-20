import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900">
          BlogApp
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                My Posts
              </Link>
              <Link
                to="/create-post"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                Write
              </Link>
              <span className="text-sm text-gray-500">Hi, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
