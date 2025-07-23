"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Bot,
	Maximize2,
	MessageCircle,
	Minimize2,
	Send,
	User,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	text: string;
	sender: "user" | "agent" | "bot";
	timestamp: Date;
	senderName?: string;
}

interface LiveAgentChatbotProps {
	className?: string;
}

export function LiveAgentChatbot({ className }: LiveAgentChatbotProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: "Hello! I'm here to help you with any questions about Cognident. How can I assist you today?",
			sender: "bot",
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = async () => {
		if (!inputMessage.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputMessage,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputMessage("");
		setIsTyping(true);

		// Simulate bot/agent response
		setTimeout(
			() => {
				const responses = [
					"Thank you for your question! Let me help you with that.",
					"I understand your concern. Here's what I can tell you about Cognident...",
					"That's a great question! Our dental practice management system offers...",
					"I'd be happy to connect you with a live agent for more detailed assistance. Would you like me to do that?",
					"Based on your question, I think our scheduling features would be perfect for your practice.",
				];

				const randomIndex = Math.floor(Math.random() * responses.length);
				const botResponse: Message = {
					id: (Date.now() + 1).toString(),
					text:
						responses[randomIndex] ||
						"I'm here to help you with any questions.",
					sender: isConnectedToAgent ? "agent" : "bot",
					timestamp: new Date(),
					senderName: isConnectedToAgent ? "Sarah (Support Agent)" : undefined,
				};

				setMessages((prev) => [...prev, botResponse]);
				setIsTyping(false);
			},
			1000 + Math.random() * 2000,
		);
	};

	const connectToAgent = () => {
		setIsConnectedToAgent(true);
		const agentMessage: Message = {
			id: Date.now().toString(),
			text: "Hi! I'm Sarah, a live support agent. I've taken over from the bot and I'm here to help you personally. What specific questions do you have about Cognident?",
			sender: "agent",
			timestamp: new Date(),
			senderName: "Sarah (Support Agent)",
		};
		setMessages((prev) => [...prev, agentMessage]);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	if (!isOpen) {
		return (
			<div className={`fixed right-6 bottom-6 z-50 ${className}`}>
				<Button
					onClick={() => setIsOpen(true)}
					className="h-14 w-14 rounded-full bg-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
					size="icon"
				>
					<MessageCircle className="h-6 w-6" />
				</Button>
			</div>
		);
	}

	return (
		<div className={`fixed right-6 bottom-6 z-50 ${className}`}>
			<div
				className={`rounded-lg border bg-white shadow-2xl transition-all duration-200 ${
					isMinimized ? "h-16 w-80" : "h-96 w-80"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-4 text-white">
					<div className="flex items-center space-x-2">
						<div className="h-3 w-3 rounded-full bg-green-400" />
						<span className="font-medium">
							{isConnectedToAgent ? "Live Agent" : "Cognident Support"}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMinimized(!isMinimized)}
							className="h-8 w-8 p-0 text-white hover:bg-blue-700"
						>
							{isMinimized ? (
								<Maximize2 className="h-4 w-4" />
							) : (
								<Minimize2 className="h-4 w-4" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(false)}
							className="h-8 w-8 p-0 text-white hover:bg-blue-700"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{!isMinimized && (
					<>
						{/* Messages */}
						<div className="h-64 space-y-3 overflow-y-auto p-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.sender === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`max-w-xs rounded-lg px-3 py-2 ${
											message.sender === "user"
												? "bg-blue-600 text-white"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{message.senderName && (
											<div className="mb-1 font-medium text-blue-600 text-xs">
												{message.senderName}
											</div>
										)}
										<div className="text-sm">{message.text}</div>
										<div
											className={`mt-1 text-xs ${
												message.sender === "user"
													? "text-blue-100"
													: "text-gray-500"
											}`}
										>
											{message.timestamp.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								</div>
							))}
							{isTyping && (
								<div className="flex justify-start">
									<div className="rounded-lg bg-gray-100 px-3 py-2 text-gray-800">
										<div className="flex space-x-1">
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input */}
						<div className="border-t p-4">
							{!isConnectedToAgent && (
								<Button
									onClick={connectToAgent}
									variant="outline"
									size="sm"
									className="mb-2 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
								>
									Connect to Live Agent
								</Button>
							)}
							<div className="flex space-x-2">
								<Input
									value={inputMessage}
									onChange={(e) => setInputMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Type your message..."
									className="flex-1 text-purple-800 placeholder:text-purple-400"
								/>
								<Button
									onClick={sendMessage}
									size="sm"
									className="bg-blue-600 hover:bg-blue-700"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
