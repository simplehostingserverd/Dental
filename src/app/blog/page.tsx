import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Calendar, User, ArrowRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DentalCloud Blog - Dental Practice Management Insights',
  description: 'Expert insights, tips, and best practices for dental practice management, patient care, and practice growth.',
  keywords: 'dental practice management, dental tips, practice growth, patient care, dental technology',
};

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Improve Patient Experience in Your Dental Practice",
    excerpt: "Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    category: "Patient Care",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "The Complete Guide to HIPAA Compliance for Dental Practices",
    excerpt: "Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.",
    author: "Michael Chen",
    date: "2024-01-12",
    category: "Compliance",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "How AI is Revolutionizing Dental Practice Management",
    excerpt: "Explore how artificial intelligence is transforming scheduling, patient care, and practice operations in modern dental offices.",
    author: "Dr. Emily Rodriguez",
    date: "2024-01-10",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Maximizing Revenue: Dental Practice Financial Best Practices",
    excerpt: "Learn proven strategies to optimize your practice's financial performance and increase profitability.",
    author: "Dr. James Wilson",
    date: "2024-01-08",
    category: "Business",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "7 min read"
  },
  {
    id: 5,
    title: "Digital Transformation in Dentistry: A Step-by-Step Guide",
    excerpt: "Navigate the digital transformation of your dental practice with our comprehensive implementation guide.",
    author: "Dr. Lisa Park",
    date: "2024-01-05",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "Building a Strong Online Presence for Your Dental Practice",
    excerpt: "Essential strategies for marketing your dental practice online and attracting new patients in the digital age.",
    author: "Marketing Team",
    date: "2024-01-03",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read"
  }
];

const categories = ["All", "Patient Care", "Technology", "Business", "Compliance", "Marketing"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-bold text-xl">DentalCloud</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-white font-medium">
                Blog
              </Link>
              <Link href="/#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link 
                href="/auth/signin" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            DentalCloud <span className="text-blue-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Expert insights, tips, and best practices for dental practice management, 
            patient care, and practice growth from industry professionals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full transition-colors ${
                  category === "All" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center text-sm font-medium"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with DentalCloud
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get the latest insights and tips delivered to your inbox weekly.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-blue-400 mr-3" />
                <span className="font-bold text-xl">DentalCloud</span>
              </div>
              <p className="text-gray-400">
                Next-generation dental practice management software designed for modern practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DentalCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
