import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500 mt-4 mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage
