"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, MessageSquare, User } from "lucide-react";
import Link from "next/link";

interface Message {
	id: string;
	content: string;
	timestamp: Date;
	senderId: string;
	senderName: string;
	senderType: "patient" | "staff";
	isRead: boolean;
}

export default function MessagesPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
		try {
			const response = await fetch("/api/patient/messages");
			if (response.ok) {
				const data = await response.json();
				setMessages(data.messages || []);
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async () => {
		if (!newMessage.trim()) return;

		setIsSending(true);
		try {
			const response = await fetch("/api/patient/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: newMessage.trim()
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setMessages(prev => [...prev, data.message]);
				setNewMessage("");
			} else {
				alert("Failed to send message");
			}
		} catch (error) {
			alert("Error sending message");
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		}).format(new Date(date));
	};

	const formatDate = (date: Date) => {
		const messageDate = new Date(date);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (messageDate.toDateString() === today.toDateString()) {
			return "Today";
		} else if (messageDate.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return messageDate.toLocaleDateString();
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link 
								href="/patient/dashboard"
								className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
							>
								<ArrowLeft className="h-5 w-5" />
							</Link>
							<h1 className="font-bold text-xl text-gray-900">Messages</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-lg bg-white shadow-sm">
					{/* Messages Header */}
					<div className="border-b border-gray-200 px-6 py-4">
						<h2 className="text-lg font-semibold text-gray-900">Dental Team Communication</h2>
						<p className="mt-1 text-sm text-gray-600">
							Send messages to your dental care team
						</p>
					</div>

					{/* Messages Container */}
					<div className="flex h-96 flex-col">
						{/* Messages List */}
						<div className="flex-1 overflow-y-auto p-6">
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<div className="text-gray-500">Loading messages...</div>
								</div>
							) : messages.length > 0 ? (
								<div className="space-y-4">
									{messages.map((message, index) => {
										const showDate = index === 0 || 
											formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
										
										return (
											<div key={message.id}>
												{showDate && (
													<div className="flex justify-center mb-4">
														<span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
															{formatDate(message.timestamp)}
														</span>
													</div>
												)}
												<div className={`flex ${message.senderType === "patient" ? "justify-end" : "justify-start"}`}>
													<div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
														message.senderType === "patient"
															? "bg-blue-600 text-white"
															: "bg-gray-100 text-gray-900"
													}`}>
														{message.senderType === "staff" && (
															<div className="text-xs font-medium mb-1 opacity-75">
																{message.senderName}
															</div>
														)}
														<div className="text-sm">{message.content}</div>
														<div className={`text-xs mt-1 ${
															message.senderType === "patient" ? "text-blue-100" : "text-gray-500"
														}`}>
															{formatTime(message.timestamp)}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-full text-center">
									<MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
									<p className="text-gray-500 mb-4">
										Start a conversation with your dental team
									</p>
								</div>
							)}
						</div>

						{/* Message Input */}
						<div className="border-t border-gray-200 p-4">
							<div className="flex space-x-4">
								<div className="flex-1">
									<textarea
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="Type your message..."
										rows={2}
										className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<button
									onClick={sendMessage}
									disabled={!newMessage.trim() || isSending}
									className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isSending ? (
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<Send className="h-4 w-4" />
									)}
								</button>
							</div>
							<p className="mt-2 text-xs text-gray-500">
								Press Enter to send, Shift+Enter for new line
							</p>
						</div>
					</div>
				</div>

				{/* Quick Message Templates */}
				<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Messages</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{[
							"I need to reschedule my appointment",
							"I have a question about my treatment",
							"I'm experiencing some discomfort",
							"Can you send me my treatment plan?",
							"I need to update my insurance information",
							"Thank you for the excellent care!"
						].map((template, index) => (
							<button
								key={index}
								onClick={() => setNewMessage(template)}
								className="rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
							>
								{template}
							</button>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
