import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

// ─── Skeleton loader card ───────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
  </div>
)

// ─── Post Card ───────────────────────────────────────────────
const PostCard = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const preview = post.content
    ? post.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
    : ''

  return (
    <Link to={`/posts/${post.slug}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-400 hover:shadow-sm transition cursor-pointer">

        {/* Author + Date */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
            {post.authorUsername?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{post.authorUsername}</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 transition">
          {post.title}
        </h2>

        {/* Preview */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{preview}</p>

        {/* Footer: Tags + Stats */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>👁 {post.viewCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>

      </div>
    </Link>
  )
}

// ─── Main HomePage ───────────────────────────────────────────
const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchPosts()
  }, [page, search])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = { page, size: 6 }
      if (search) params.search = search
      const res = await api.get('/posts', { params })
      setPosts(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Failed to fetch posts', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    setSearch(searchInput)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPage(0)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <p className="text-gray-500 mt-1">Discover stories and ideas from our writers</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-gray-700 transition"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* Search result label */}
      {search && (
        <p className="text-sm text-gray-500 mb-4">
          Showing results for <span className="font-medium text-gray-800">"{search}"</span>
        </p>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-700">No posts found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {search ? 'Try a different search term' : 'Be the first to write something!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 text-sm rounded-lg border transition
                ${page === i
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages - 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}

export default HomePage
