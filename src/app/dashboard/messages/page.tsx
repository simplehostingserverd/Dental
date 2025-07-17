"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowLeft,
	CheckCircle,
	Circle,
	Clock,
	Filter,
	MessageSquare,
	Plus,
	Reply,
	Search,
	Send,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Message {
	id: string;
	content: string;
	timestamp: string;
	senderId: string;
	patientId: string;
	isRead: boolean;
	patient: {
		firstName: string;
		lastName: string;
		email: string;
	};
	sender: {
		firstName: string;
		lastName: string;
	};
}

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export default function MessagesPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [showCompose, setShowCompose] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [composeContent, setComposeContent] = useState("");
	const [selectedPatient, setSelectedPatient] = useState("");
	const [isSending, setIsSending] = useState(false);

	// Fetch messages and patients from API
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Fetch messages
				const messagesResponse = await fetch("/api/dashboard/messages");
				if (messagesResponse.ok) {
					const messagesData = await messagesResponse.json();
					setMessages(messagesData.messages || []);
				}

				// Fetch patients
				const patientsResponse = await fetch("/api/dashboard/patients");
				if (patientsResponse.ok) {
					const patientsData = await patientsResponse.json();
					setPatients(patientsData.patients || []);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredMessages = messages.filter((message) => {
		const matchesSearch =
			message.patient.firstName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			message.patient.lastName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			message.content.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesFilter =
			filterStatus === "all" ||
			(filterStatus === "unread" && !message.isRead) ||
			(filterStatus === "read" && message.isRead);

		return matchesSearch && matchesFilter;
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		}
		if (diffInHours < 168) {
			// 7 days
			return date.toLocaleDateString([], {
				weekday: "short",
				hour: "2-digit",
				minute: "2-digit",
			});
		}
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleMarkAsRead = async (messageId: string) => {
		try {
			const response = await fetch(`/api/dashboard/messages/${messageId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isRead: true }),
			});

			if (response.ok) {
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === messageId ? { ...msg, isRead: true } : msg,
					),
				);
			}
		} catch (error) {
			console.error("Error marking message as read:", error);
		}
	};

	const handleSendReply = async () => {
		if (!replyContent.trim() || !selectedMessage) return;

		setIsSending(true);
		try {
			const response = await fetch("/api/dashboard/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: replyContent.trim(),
					patientId: selectedMessage.patientId,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				// Add the new message to the list
				setMessages((prev) => [data.message, ...prev]);
				setReplyContent("");
				setSelectedMessage(null);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to send reply");
			}
		} catch (error) {
			console.error("Error sending reply:", error);
			alert("Error sending reply");
		} finally {
			setIsSending(false);
		}
	};

	const handleSendNewMessage = async () => {
		if (!composeContent.trim() || !selectedPatient) return;

		setIsSending(true);
		try {
			const response = await fetch("/api/dashboard/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: composeContent.trim(),
					patientId: selectedPatient,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				// Add the new message to the list
				setMessages((prev) => [data.message, ...prev]);
				setComposeContent("");
				setSelectedPatient("");
				setShowCompose(false);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to send message");
			}
		} catch (error) {
			console.error("Error sending message:", error);
			alert("Error sending message");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Messages</h1>
					<p className="text-gray-600">
						Communicate with your patients and manage conversations
					</p>
				</div>
				<Button onClick={() => setShowCompose(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New Message
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search messages or patients..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Select value={filterStatus} onValueChange={setFilterStatus}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Messages</SelectItem>
						<SelectItem value="unread">Unread</SelectItem>
						<SelectItem value="read">Read</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Messages List */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
						<div className="border-gray-200 border-b px-6 py-4">
							<h2 className="font-semibold text-gray-900 text-lg">
								Patient Messages ({filteredMessages.length})
							</h2>
						</div>
						<div className="divide-y divide-gray-200">
							{isLoading ? (
								<div className="flex h-64 items-center justify-center">
									<div className="text-gray-500">Loading messages...</div>
								</div>
							) : filteredMessages.length > 0 ? (
								filteredMessages.map((message) => (
									<button
										key={message.id}
										type="button"
										className={`w-full cursor-pointer p-6 text-left transition-colors hover:bg-gray-50 ${
											!message.isRead ? "bg-blue-50" : ""
										}`}
										onClick={() => {
											setSelectedMessage(message);
											if (!message.isRead) {
												handleMarkAsRead(message.id);
											}
										}}
									>
										<div className="flex items-start justify-between">
											<div className="flex items-start space-x-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
													{message.patient.firstName.charAt(0)}
													{message.patient.lastName.charAt(0)}
												</div>
												<div className="flex-1">
													<div className="flex items-center space-x-2">
														<h3 className="font-medium text-gray-900">
															{message.patient.firstName}{" "}
															{message.patient.lastName}
														</h3>
														{!message.isRead && (
															<Circle className="h-2 w-2 fill-blue-600 text-blue-600" />
														)}
													</div>
													<p className="text-gray-600 text-sm">
														{message.patient.email}
													</p>
													<p className="mt-1 line-clamp-2 text-gray-800 text-sm">
														{message.content}
													</p>
												</div>
											</div>
											<div className="flex flex-col items-end space-y-1">
												<span className="text-gray-500 text-xs">
													{formatDate(message.timestamp)}
												</span>
												<Badge
													variant={message.isRead ? "secondary" : "default"}
												>
													{message.isRead ? "Read" : "Unread"}
												</Badge>
											</div>
										</div>
									</button>
								))
							) : (
								<div className="flex h-64 flex-col items-center justify-center">
									<MessageSquare className="mb-4 h-12 w-12 text-gray-400" />
									<p className="text-gray-500">No messages found</p>
									<p className="text-gray-400 text-sm">
										Try adjusting your search or filter criteria
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Message Details */}
					{selectedMessage && (
						<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
							<div className="border-gray-200 border-b px-6 py-4">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-gray-900 text-lg">
										Message Details
									</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedMessage(null)}
									>
										<ArrowLeft className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<div className="p-6">
								<div className="mb-4 flex items-center space-x-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
										{selectedMessage.patient.firstName.charAt(0)}
										{selectedMessage.patient.lastName.charAt(0)}
									</div>
									<div>
										<h4 className="font-medium text-gray-900">
											{selectedMessage.patient.firstName}{" "}
											{selectedMessage.patient.lastName}
										</h4>
										<p className="text-gray-600 text-sm">
											{selectedMessage.patient.email}
										</p>
									</div>
								</div>
								<div className="mb-4">
									<div className="flex items-center space-x-2 text-gray-500 text-sm">
										<Clock className="h-4 w-4" />
										<span>{formatDate(selectedMessage.timestamp)}</span>
									</div>
								</div>
								<div className="mb-6">
									<p className="text-gray-800">{selectedMessage.content}</p>
								</div>

								{/* Reply Form */}
								<div className="space-y-4">
									<Label htmlFor="reply">Reply to Patient</Label>
									<Textarea
										id="reply"
										placeholder="Type your reply..."
										value={replyContent}
										onChange={(e) => setReplyContent(e.target.value)}
										rows={4}
									/>
									<div className="flex space-x-2">
										<Button
											onClick={handleSendReply}
											disabled={!replyContent.trim() || isSending}
											className="flex-1"
										>
											<Send className="mr-2 h-4 w-4" />
											{isSending ? "Sending..." : "Send Reply"}
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Quick Actions */}
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<h3 className="mb-4 font-semibold text-gray-900 text-lg">
							Quick Actions
						</h3>
						<div className="space-y-3">
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => setShowCompose(true)}
							>
								<Plus className="mr-2 h-4 w-4" />
								Compose New Message
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Filter className="mr-2 h-4 w-4" />
								Mark All as Read
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Compose Message Modal */}
			{showCompose && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-lg">
								New Message
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setShowCompose(false);
									setComposeContent("");
									setSelectedPatient("");
								}}
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="patient-select">Select Patient</Label>
								<Select
									value={selectedPatient}
									onValueChange={setSelectedPatient}
								>
									<SelectTrigger>
										<SelectValue placeholder="Choose a patient..." />
									</SelectTrigger>
									<SelectContent>
										{patients.map((patient) => (
											<SelectItem key={patient.id} value={patient.id}>
												{patient.firstName} {patient.lastName} - {patient.email}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="compose-message">Message</Label>
								<Textarea
									id="compose-message"
									placeholder="Type your message..."
									value={composeContent}
									onChange={(e) => setComposeContent(e.target.value)}
									rows={6}
								/>
							</div>

							<div className="flex space-x-3">
								<Button
									onClick={handleSendNewMessage}
									disabled={
										!composeContent.trim() || !selectedPatient || isSending
									}
									className="flex-1"
								>
									<Send className="mr-2 h-4 w-4" />
									{isSending ? "Sending..." : "Send Message"}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setShowCompose(false);
										setComposeContent("");
										setSelectedPatient("");
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
