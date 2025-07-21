"use client";

import { Calendar, Edit, Eye, Heart, Plus, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	author: string;
	date: string;
	category: string;
	status: string;
	views: number;
	content: string;
	image: string;
}

// Sample blog posts data (in a real app, this would come from a database)
const initialBlogPosts: BlogPost[] = [
	{
		id: 1,
		title: "10 Ways to Improve Patient Experience in Your Dental Practice",
		excerpt:
			"Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
		author: "Dr. Sarah Johnson",
		date: "2024-01-15",
		category: "Patient Care",
		status: "Published",
		views: 1250,
		content: "Sample content for blog post 1",
		image:
			"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
	},
	{
		id: 2,
		title: "The Complete Guide to HIPAA Compliance for Dental Practices",
		excerpt:
			"Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.",
		author: "Michael Chen",
		date: "2024-01-12",
		category: "Compliance",
		status: "Published",
		views: 890,
		content: "Sample content for blog post 2",
		image:
			"https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
	},
	{
		id: 3,
		title: "How AI is Revolutionizing Dental Practice Management",
		excerpt:
			"Explore how artificial intelligence is transforming scheduling, patient care, and practice operations in modern dental offices.",
		author: "Dr. Emily Rodriguez",
		date: "2024-01-10",
		category: "Technology",
		status: "Draft",
		views: 0,
		content: "Sample content for blog post 3",
		image:
			"https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop",
	},
];

export default function BlogAdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
	const [showNewPostForm, setShowNewPostForm] = useState(false);
	const [newPost, setNewPost] = useState({
		title: "",
		excerpt: "",
		content: "",
		author: "",
		category: "Patient Care",
		status: "Draft",
		image: "",
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
			<div className="flex min-h-screen items-center justify-center bg-gray-900">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	const handleCreatePost = (e: React.FormEvent) => {
		e.preventDefault();
		const post: BlogPost = {
			id: Math.max(...blogPosts.map((p) => p.id)) + 1,
			title: newPost.title,
			excerpt: newPost.excerpt,
			content: newPost.content,
			author: newPost.author,
			category: newPost.category,
			status: newPost.status,
			image: newPost.image,
			date: new Date().toISOString().split("T")[0] as string,
			views: 0,
		};
		setBlogPosts([post, ...blogPosts]);
		setNewPost({
			title: "",
			excerpt: "",
			content: "",
			author: "",
			category: "Patient Care",
			status: "Draft",
			image: "",
		});
		setShowNewPostForm(false);
	};

	const handleDeletePost = (id: number) => {
		if (confirm("Are you sure you want to delete this post?")) {
			setBlogPosts(blogPosts.filter((post) => post.id !== id));
		}
	};

	const handleStatusChange = (id: number, newStatus: string) => {
		setBlogPosts(
			blogPosts.map((post) =>
				post.id === id ? { ...post, status: newStatus } : post,
			),
		);
	};

	const handleLogout = () => {
		localStorage.removeItem("adminAuthenticated");
		window.location.href = "/admin/login";
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation */}
			<nav className="border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<Heart className="mr-3 h-8 w-8 text-blue-400" />
							<span className="font-bold text-xl">DentalCloud Admin</span>
						</Link>
						<div className="flex items-center space-x-4">
							<Link
								href="/blog"
								className="text-gray-300 transition-colors hover:text-white"
							>
								View Blog
							</Link>
							<Link
								href="/"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Home
							</Link>
							<button
								type="button"
								onClick={handleLogout}
								className="rounded bg-red-600 px-3 py-1 text-sm transition-colors hover:bg-red-700"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="font-bold text-3xl">Blog Management</h1>
						<p className="mt-2 text-gray-400">
							Create and manage your blog posts
						</p>
					</div>
					<button
						onClick={() => setShowNewPostForm(true)}
						className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium transition-colors hover:bg-blue-700"
					>
						<Plus className="mr-2 h-4 w-4" />
						New Post
					</button>
				</div>

				{/* Stats */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="font-medium text-gray-400 text-sm">Total Posts</h3>
						<p className="font-bold text-2xl text-white">{blogPosts.length}</p>
					</div>
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="font-medium text-gray-400 text-sm">Published</h3>
						<p className="font-bold text-2xl text-green-400">
							{blogPosts.filter((p) => p.status === "Published").length}
						</p>
					</div>
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="font-medium text-gray-400 text-sm">Drafts</h3>
						<p className="font-bold text-2xl text-yellow-400">
							{blogPosts.filter((p) => p.status === "Draft").length}
						</p>
					</div>
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="font-medium text-gray-400 text-sm">Total Views</h3>
						<p className="font-bold text-2xl text-blue-400">
							{blogPosts
								.reduce((sum, post) => sum + post.views, 0)
								.toLocaleString()}
						</p>
					</div>
				</div>

				{/* New Post Form */}
				{showNewPostForm && (
					<div className="mb-8 rounded-lg bg-gray-800 p-6">
						<h2 className="mb-4 font-bold text-xl">Create New Post</h2>
						<form onSubmit={handleCreatePost} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label
										htmlFor="post-title"
										className="mb-2 block font-medium text-gray-300 text-sm"
									>
										Title
									</label>
									<input
										id="post-title"
										type="text"
										value={newPost.title}
										onChange={(e) =>
											setNewPost({ ...newPost, title: e.target.value })
										}
										className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="post-author"
										className="mb-2 block font-medium text-gray-300 text-sm"
									>
										Author
									</label>
									<input
										id="post-author"
										type="text"
										value={newPost.author}
										onChange={(e) =>
											setNewPost({ ...newPost, author: e.target.value })
										}
										className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label
										htmlFor="post-category"
										className="mb-2 block font-medium text-gray-300 text-sm"
									>
										Category
									</label>
									<select
										id="post-category"
										value={newPost.category}
										onChange={(e) =>
											setNewPost({ ...newPost, category: e.target.value })
										}
										className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="Patient Care">Patient Care</option>
										<option value="Technology">Technology</option>
										<option value="Business">Business</option>
										<option value="Compliance">Compliance</option>
										<option value="Marketing">Marketing</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="post-status"
										className="mb-2 block font-medium text-gray-300 text-sm"
									>
										Status
									</label>
									<select
										id="post-status"
										value={newPost.status}
										onChange={(e) =>
											setNewPost({ ...newPost, status: e.target.value })
										}
										className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="Draft">Draft</option>
										<option value="Published">Published</option>
									</select>
								</div>
							</div>
							<div>
								<label
									htmlFor="post-image"
									className="mb-2 block font-medium text-gray-300 text-sm"
								>
									Featured Image URL
								</label>
								<input
									id="post-image"
									type="url"
									value={newPost.image}
									onChange={(e) =>
										setNewPost({ ...newPost, image: e.target.value })
									}
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="https://example.com/image.jpg"
								/>
								<p className="mt-1 text-gray-400 text-xs">
									Use Unsplash or other image URLs. Recommended size: 800x400px
								</p>
							</div>
							<div>
								<label
									htmlFor="post-excerpt"
									className="mb-2 block font-medium text-gray-300 text-sm"
								>
									Excerpt
								</label>
								<textarea
									id="post-excerpt"
									value={newPost.excerpt}
									onChange={(e) =>
										setNewPost({ ...newPost, excerpt: e.target.value })
									}
									rows={3}
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="post-content"
									className="mb-2 block font-medium text-gray-300 text-sm"
								>
									Content
								</label>
								<textarea
									id="post-content"
									value={newPost.content}
									onChange={(e) =>
										setNewPost({ ...newPost, content: e.target.value })
									}
									rows={10}
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Write your blog post content here..."
									required
								/>
							</div>
							<div className="flex gap-4">
								<button
									type="submit"
									className="rounded-md bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700"
								>
									Create Post
								</button>
								<button
									type="button"
									onClick={() => setShowNewPostForm(false)}
									className="rounded-md bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Posts Table */}
				<div className="overflow-hidden rounded-lg bg-gray-800">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-700">
								<tr>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Post
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Author
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Category
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Views
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-300 text-xs uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{blogPosts.map((post) => (
									<tr key={post.id} className="hover:bg-gray-700">
										<td className="px-6 py-4">
											<div>
												<div className="font-medium text-sm text-white">
													{post.title}
												</div>
												<div className="mt-1 text-gray-400 text-sm">
													{post.excerpt.substring(0, 100)}...
												</div>
												<div className="mt-2 flex items-center text-gray-500 text-xs">
													<Calendar className="mr-1 h-3 w-3" />
													{new Date(post.date).toLocaleDateString()}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center text-gray-300 text-sm">
												<User className="mr-2 h-4 w-4" />
												{post.author}
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex rounded-full bg-blue-600 px-2 py-1 font-semibold text-white text-xs">
												{post.category}
											</span>
										</td>
										<td className="px-6 py-4">
											<select
												value={post.status}
												onChange={(e) =>
													handleStatusChange(post.id, e.target.value)
												}
												className={`rounded-full border-0 px-2 py-1 font-semibold text-xs ${
													post.status === "Published"
														? "bg-green-600 text-white"
														: "bg-yellow-600 text-white"
												}`}
											>
												<option value="Draft">Draft</option>
												<option value="Published">Published</option>
											</select>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center text-gray-300 text-sm">
												<Eye className="mr-2 h-4 w-4" />
												{post.views.toLocaleString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-2">
												<Link
													href={`/blog/${post.id}`}
													className="text-blue-400 transition-colors hover:text-blue-300"
												>
													<Eye className="h-4 w-4" />
												</Link>
												<button className="text-gray-400 transition-colors hover:text-white">
													<Edit className="h-4 w-4" />
												</button>
												<button
													onClick={() => handleDeletePost(post.id)}
													className="text-red-400 transition-colors hover:text-red-300"
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
