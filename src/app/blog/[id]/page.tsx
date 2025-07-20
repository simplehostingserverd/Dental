import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Calendar, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Improve Patient Experience in Your Dental Practice",
    excerpt: "Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
    content: `
      <p>Patient experience is the cornerstone of a successful dental practice. In today's competitive healthcare landscape, providing exceptional patient care goes beyond clinical excellence—it encompasses every touchpoint of the patient journey.</p>
      
      <h2>1. Streamline Your Appointment Scheduling</h2>
      <p>Modern patients expect convenience and flexibility when booking appointments. Implement online scheduling systems that allow patients to book, reschedule, or cancel appointments 24/7. This reduces phone calls to your office and gives patients control over their scheduling preferences.</p>
      
      <h2>2. Create a Welcoming Environment</h2>
      <p>Your office environment sets the tone for the entire patient experience. Ensure your waiting area is comfortable, clean, and calming. Consider amenities like complimentary Wi-Fi, refreshments, and entertainment options to make waiting more pleasant.</p>
      
      <h2>3. Implement Clear Communication</h2>
      <p>Transparent communication builds trust and reduces patient anxiety. Explain procedures clearly, discuss treatment options thoroughly, and provide written estimates for all services. Use visual aids and models to help patients understand their treatment plans.</p>
      
      <h2>4. Reduce Wait Times</h2>
      <p>Respect your patients' time by maintaining an efficient schedule. If delays are unavoidable, communicate proactively and offer alternatives such as rescheduling or providing updates on wait times.</p>
      
      <h2>5. Personalize the Experience</h2>
      <p>Remember personal details about your patients and their preferences. Use patient management software to track important information and create personalized treatment experiences that make patients feel valued.</p>
    `,
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
    content: `
      <p>HIPAA compliance is not optional for dental practices—it's a legal requirement that protects patient privacy and your practice from costly violations. Understanding and implementing proper HIPAA protocols is essential for every dental professional.</p>
      
      <h2>Understanding HIPAA Basics</h2>
      <p>The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting patient health information. For dental practices, this means implementing safeguards for both physical and electronic protected health information (PHI).</p>
      
      <h2>Physical Safeguards</h2>
      <p>Secure your physical environment by controlling access to areas where PHI is stored or accessed. This includes locking file cabinets, securing computer workstations, and ensuring patient information is not visible to unauthorized individuals.</p>
      
      <h2>Administrative Safeguards</h2>
      <p>Develop comprehensive policies and procedures for handling PHI. Train all staff members on HIPAA requirements and conduct regular security assessments to identify potential vulnerabilities.</p>
      
      <h2>Technical Safeguards</h2>
      <p>Implement technical controls such as access controls, audit logs, and encryption for electronic PHI. Ensure your practice management software is HIPAA-compliant and regularly update security measures.</p>
    `,
    author: "Michael Chen",
    date: "2024-01-12",
    category: "Compliance",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    readTime: "8 min read"
  }
  // Add more blog posts as needed
];

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === parseInt(params.id));
  
  if (!post) {
    return {
      title: 'Post Not Found - DentalCloud Blog',
    };
  }

  return {
    title: `${post.title} - DentalCloud Blog`,
    description: post.excerpt,
    keywords: `dental practice, ${post.category.toLowerCase()}, dental management`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.id === parseInt(params.id));

  if (!post) {
    notFound();
  }

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

      {/* Back to Blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 lg:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-gray-400">
              <p>Written by <span className="text-white font-medium">{post.author}</span></p>
            </div>
            <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              Share this article
            </button>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <article key={relatedPost.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${relatedPost.id}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
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
