"use client";

import { ArrowLeft, MessageSquare, Send, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
					content: newMessage.trim(),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setMessages((prev) => [...prev, data.message]);
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
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(new Date(date));
	};

	const formatDate = (date: Date) => {
		const messageDate = new Date(date);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (messageDate.toDateString() === today.toDateString()) {
			return "Today";
		}
		if (messageDate.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		}
		return messageDate.toLocaleDateString();
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
							<h1 className="font-bold text-gray-900 text-xl">Messages</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-lg bg-white shadow-sm">
					{/* Messages Header */}
					<div className="border-gray-200 border-b px-6 py-4">
						<h2 className="font-semibold text-gray-900 text-lg">
							Dental Team Communication
						</h2>
						<p className="mt-1 text-gray-600 text-sm">
							Send messages to your dental care team
						</p>
					</div>

					{/* Messages Container */}
					<div className="flex h-96 flex-col">
						{/* Messages List */}
						<div className="flex-1 overflow-y-auto p-6">
							{isLoading ? (
								<div className="flex h-full items-center justify-center">
									<div className="text-gray-500">Loading messages...</div>
								</div>
							) : messages.length > 0 ? (
								<div className="space-y-4">
									{messages.map((message, index) => {
										const previousMessage = messages[index - 1];
										const showDate =
											index === 0 ||
											(previousMessage &&
												formatDate(previousMessage.timestamp) !==
												formatDate(message.timestamp));

										return (
											<div key={message.id}>
												{showDate && (
													<div className="mb-4 flex justify-center">
														<span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-xs">
															{formatDate(message.timestamp)}
														</span>
													</div>
												)}
												<div
													className={`flex ${message.senderType === "patient" ? "justify-end" : "justify-start"}`}
												>
													<div
														className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
															message.senderType === "patient"
																? "bg-blue-600 text-gray-900"
																: "bg-gray-100 text-gray-900"
														}`}
													>
														{message.senderType === "staff" && (
															<div className="mb-1 font-medium text-xs opacity-75">
																{message.senderName}
															</div>
														)}
														<div className="text-sm">{message.content}</div>
														<div
															className={`mt-1 text-xs ${
																message.senderType === "patient"
																	? "text-blue-100"
																	: "text-gray-500"
															}`}
														>
															{formatTime(message.timestamp)}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="flex h-full flex-col items-center justify-center text-center">
									<MessageSquare className="mb-4 h-12 w-12 text-gray-600" />
									<h3 className="mb-2 font-medium text-gray-900 text-lg">
										No messages yet
									</h3>
									<p className="mb-4 text-gray-500">
										Start a conversation with your dental team
									</p>
								</div>
							)}
						</div>

						{/* Message Input */}
						<div className="border-gray-200 border-t p-4">
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
									type="button"
									onClick={sendMessage}
									disabled={!newMessage.trim() || isSending}
									className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-gray-900 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isSending ? (
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<Send className="h-4 w-4" />
									)}
								</button>
							</div>
							<p className="mt-2 text-gray-500 text-xs">
								Press Enter to send, Shift+Enter for new line
							</p>
						</div>
					</div>
				</div>

				{/* Quick Message Templates */}
				<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
					<h3 className="mb-4 font-semibold text-gray-900 text-lg">
						Quick Messages
					</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{[
							"I need to reschedule my appointment",
							"I have a question about my treatment",
							"I'm experiencing some discomfort",
							"Can you send me my treatment plan?",
							"I need to update my insurance information",
							"Thank you for the excellent care!",
						].map((template, index) => (
							<button
								type="button"
								key={`template-${template.slice(0, 20)}-${index}`}
								onClick={() => setNewMessage(template)}
								className="rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
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
