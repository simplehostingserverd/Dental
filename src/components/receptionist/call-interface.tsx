"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Phone,
	PhoneCall,
	PhoneOff,
	User,
	Clock,
	Mic,
	MicOff,
} from "lucide-react";
import { toast } from "sonner";

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	email?: string;
}

interface CallInterfaceProps {
	patients?: Patient[];
	onCallInitiated?: (callData: any) => void;
}

export function CallInterface({ patients = [], onCallInitiated }: CallInterfaceProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [notes, setNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentCall, setCurrentCall] = useState<any>(null);
	const [callDuration, setCallDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);

	// Timer for call duration
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (currentCall && currentCall.status === 'connected') {
			interval = setInterval(() => {
				setCallDuration(prev => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [currentCall]);

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const handlePatientSelect = (patientId: string) => {
		const patient = patients.find(p => p.id === patientId);
		if (patient) {
			setSelectedPatient(patient);
			setPhoneNumber(patient.phone || "");
		}
	};

	const formatPhoneNumber = (value: string) => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, '');
		
		// Format as (XXX) XXX-XXXX
		if (digits.length >= 10) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
		} else if (digits.length >= 6) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
		} else if (digits.length >= 3) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
		}
		return digits;
	};

	const handlePhoneChange = (value: string) => {
		const formatted = formatPhoneNumber(value);
		setPhoneNumber(formatted);
	};

	const initiateCall = async () => {
		if (!phoneNumber.trim()) {
			toast.error("Please enter a phone number");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch('/api/voice/call', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					to: phoneNumber.replace(/\D/g, ''), // Send only digits
					patientId: selectedPatient?.id,
					callType: 'outbound',
					notes: notes.trim(),
				}),
			});

			const data = await response.json();

			if (data.success) {
				setCurrentCall({
					sid: data.callSid,
					status: 'initiated',
					to: data.to,
					from: data.from,
				});
				
				toast.success("Call initiated successfully!");
				onCallInitiated?.(data);
				
				// Reset form but keep dialog open to show call status
				setNotes("");
			} else {
				toast.error(data.error || "Failed to initiate call");
			}
		} catch (error) {
			console.error("Call error:", error);
			toast.error("Failed to initiate call");
		} finally {
			setIsLoading(false);
		}
	};

	const endCall = async () => {
		if (!currentCall) return;

		try {
			// In a real implementation, you'd call Twilio to end the call
			setCurrentCall(null);
			setCallDuration(0);
			setIsOpen(false);
			toast.success("Call ended");
		} catch (error) {
			console.error("End call error:", error);
			toast.error("Failed to end call");
		}
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
		// In a real implementation, you'd mute/unmute the microphone
		toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Phone className="h-4 w-4" />
					Call
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PhoneCall className="h-5 w-5" />
						{currentCall ? "Active Call" : "Make a Call"}
					</DialogTitle>
				</DialogHeader>

				{currentCall ? (
					// Active call interface
					<div className="space-y-4">
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<User className="h-5 w-5 text-gray-500" />
								<span className="font-medium">
									{selectedPatient 
										? `${selectedPatient.firstName} ${selectedPatient.lastName}`
										: phoneNumber
									}
								</span>
							</div>
							<Badge variant={currentCall.status === 'connected' ? 'default' : 'secondary'}>
								{currentCall.status}
							</Badge>
						</div>

						{currentCall.status === 'connected' && (
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 text-lg font-mono">
									<Clock className="h-4 w-4" />
									{formatDuration(callDuration)}
								</div>
							</div>
						)}

						<div className="flex justify-center gap-4">
							<Button
								variant={isMuted ? "destructive" : "outline"}
								size="sm"
								onClick={toggleMute}
								className="gap-2"
							>
								{isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
								{isMuted ? "Unmute" : "Mute"}
							</Button>
							
							<Button
								variant="destructive"
								size="sm"
								onClick={endCall}
								className="gap-2"
							>
								<PhoneOff className="h-4 w-4" />
								End Call
							</Button>
						</div>
					</div>
				) : (
					// Call setup interface
					<div className="space-y-4">
						<div>
							<Label htmlFor="patient-select">Select Patient (Optional)</Label>
							<Select onValueChange={handlePatientSelect}>
								<SelectTrigger>
									<SelectValue placeholder="Choose a patient..." />
								</SelectTrigger>
								<SelectContent>
									{patients.map((patient) => (
										<SelectItem key={patient.id} value={patient.id}>
											{patient.firstName} {patient.lastName} - {patient.phone}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								type="tel"
								value={phoneNumber}
								onChange={(e) => handlePhoneChange(e.target.value)}
								placeholder="(555) 123-4567"
								maxLength={14}
							/>
						</div>

						<div>
							<Label htmlFor="notes">Call Notes (Optional)</Label>
							<Textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Purpose of call, reminders, etc..."
								rows={3}
							/>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={initiateCall}
								disabled={isLoading || !phoneNumber.trim()}
								className="flex-1 gap-2"
							>
								<PhoneCall className="h-4 w-4" />
								{isLoading ? "Calling..." : "Start Call"}
							</Button>
							<Button
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
