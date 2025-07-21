"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, X, Phone, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
	id: string;
	content: string;
	sender: 'user' | 'bot';
	timestamp: Date;
}

interface HelpChatbotProps {
	isOpen: boolean;
	onClose: () => void;
}

export function HelpChatbot({ isOpen, onClose }: HelpChatbotProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			content: 'Hello! I\'m here to help you with Cognident. How can I assist you today?',
			sender: 'bot',
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
		}
	}, [messages]);

	const sendMessage = async () => {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputMessage,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, userMessage]);
		setInputMessage('');
		setIsLoading(true);

		try {
			const response = await fetch('/api/chat/help', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: inputMessage,
					context: 'Help Center Chat',
				}),
			});

			if (response.ok) {
				const data = await response.json();
				const botMessage: Message = {
					id: (Date.now() + 1).toString(),
					content: data.response,
					sender: 'bot',
					timestamp: new Date(),
				};
				setMessages(prev => [...prev, botMessage]);
			} else {
				throw new Error('Failed to get response');
			}
		} catch (error) {
			console.error('Chat error:', error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: 'I apologize, but I\'m having trouble responding right now. Please try again or contact our support team.',
				sender: 'bot',
				timestamp: new Date(),
			};
			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<Card className="w-full max-w-md h-[600px] flex flex-col">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="flex items-center gap-2">
						<Bot className="h-5 w-5 text-blue-600" />
						Cognident Help Assistant
					</CardTitle>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="flex-1 flex flex-col p-4">
					<ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
						<div className="space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.sender === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`flex items-start gap-2 max-w-[80%] ${
											message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
										}`}
									>
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center ${
												message.sender === 'user'
													? 'bg-blue-600 text-white'
													: 'bg-gray-200 text-gray-600'
											}`}
										>
											{message.sender === 'user' ? (
												<User className="h-4 w-4" />
											) : (
												<Bot className="h-4 w-4" />
											)}
										</div>
										<div
											className={`rounded-lg px-3 py-2 ${
												message.sender === 'user'
													? 'bg-blue-600 text-white'
													: 'bg-gray-100 text-gray-900'
											}`}
										>
											<p className="text-sm">{message.content}</p>
											<p className="text-xs opacity-70 mt-1">
												{message.timestamp.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</p>
										</div>
									</div>
								</div>
							))}
							{isLoading && (
								<div className="flex justify-start">
									<div className="flex items-start gap-2">
										<div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
											<Bot className="h-4 w-4" />
										</div>
										<div className="bg-gray-100 rounded-lg px-3 py-2">
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
												<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
												<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</ScrollArea>
					
					{/* Quick Actions */}
					<div className="flex gap-2 my-3">
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => window.open('tel:+19563575588')}
						>
							<Phone className="h-3 w-3" />
							Call
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							asChild
						>
							<Link href="/contact">
								<Mail className="h-3 w-3" />
								Email
							</Link>
						</Button>
					</div>

					{/* Input */}
					<div className="flex gap-2">
						<Input
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your question..."
							disabled={isLoading}
							className="flex-1"
						/>
						<Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
