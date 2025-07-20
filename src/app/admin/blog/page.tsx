"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

// Sample blog posts data (in a real app, this would come from a database)
const initialBlogPosts = [
  {
    id: 1,
    title: "10 Ways to Improve Patient Experience in Your Dental Practice",
    excerpt: "Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    category: "Patient Care",
    status: "Published",
    views: 1250
  },
  {
    id: 2,
    title: "The Complete Guide to HIPAA Compliance for Dental Practices",
    excerpt: "Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.",
    author: "Michael Chen",
    date: "2024-01-12",
    category: "Compliance",
    status: "Published",
    views: 890
  },
  {
    id: 3,
    title: "How AI is Revolutionizing Dental Practice Management",
    excerpt: "Explore how artificial intelligence is transforming scheduling, patient care, and practice operations in modern dental offices.",
    author: "Dr. Emily Rodriguez",
    date: "2024-01-10",
    category: "Technology",
    status: "Draft",
    views: 0
  }
];

export default function BlogAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Patient Care',
    status: 'Draft',
    image: ''
  });

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/admin/login";
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const post = {
      id: Math.max(...blogPosts.map(p => p.id)) + 1,
      ...newPost,
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    setBlogPosts([post, ...blogPosts]);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Patient Care',
      status: 'Draft',
      image: ''
    });
    setShowNewPostForm(false);
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setBlogPosts(blogPosts.map(post =>
      post.id === id ? { ...post, status: newStatus } : post
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-bold text-xl">DentalCloud Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                View Blog
              </Link>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-gray-400 mt-2">Create and manage your blog posts</p>
          </div>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium">Total Posts</h3>
            <p className="text-2xl font-bold text-white">{blogPosts.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium">Published</h3>
            <p className="text-2xl font-bold text-green-400">
              {blogPosts.filter(p => p.status === 'Published').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {blogPosts.filter(p => p.status === 'Draft').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium">Total Views</h3>
            <p className="text-2xl font-bold text-blue-400">
              {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Patient Care">Patient Care</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={newPost.image}
                  onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use Unsplash or other image URLs. Recommended size: 800x400px
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={10}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{post.title}</div>
                        <div className="text-sm text-gray-400 mt-1">{post.excerpt.substring(0, 100)}...</div>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <User className="h-4 w-4 mr-2" />
                        {post.author}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleStatusChange(post.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${
                          post.status === 'Published' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Eye className="h-4 w-4 mr-2" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
