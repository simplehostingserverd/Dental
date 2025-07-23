"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickActionsService } from "@/lib/services/quick-actions";
import {
	AlertTriangle,
	Bell,
	Bookmark,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	FileText,
	Mail,
	MessageSquare,
	Phone,
	Play,
	Plus,
	Printer,
	RotateCcw,
	Search,
	Send,
	Settings,
	Star,
	Upload,
	UserPlus,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data for recent actions
const recentActions = [
	{
		id: "1",
		action: "Scheduled appointment",
		patient: "Sarah Johnson",
		timestamp: "2025-07-17T10:30:00",
		type: "appointment",
	},
	{
		id: "2",
		action: "Processed payment",
		patient: "Michael Chen",
		timestamp: "2025-07-17T09:15:00",
		type: "payment",
	},
	{
		id: "3",
		action: "Sent reminder",
		patient: "Emily Davis",
		timestamp: "2025-07-17T08:45:00",
		type: "communication",
	},
];

const quickActionTemplates = [
	{
		id: "1",
		name: "Emergency Appointment",
		description: "Schedule urgent same-day appointment",
		icon: AlertTriangle,
		color: "bg-red-100 text-red-600",
		category: "scheduling",
		isFavorite: true,
	},
	{
		id: "2",
		name: "Payment Collection",
		description: "Process patient payment quickly",
		icon: CreditCard,
		color: "bg-green-100 text-green-600",
		category: "billing",
		isFavorite: true,
	},
	{
		id: "3",
		name: "Insurance Verification",
		description: "Verify patient insurance coverage",
		icon: CheckCircle,
		color: "bg-blue-100 text-blue-600",
		category: "insurance",
		isFavorite: false,
	},
	{
		id: "4",
		name: "Send Forms",
		description: "Email forms to patient",
		icon: Send,
		color: "bg-purple-100 text-purple-600",
		category: "communication",
		isFavorite: true,
	},
	{
		id: "5",
		name: "Print Schedule",
		description: "Print today's appointment schedule",
		icon: Printer,
		color: "bg-gray-100 text-gray-600",
		category: "reports",
		isFavorite: false,
	},
	{
		id: "6",
		name: "New Patient Intake",
		description: "Start new patient registration",
		icon: UserPlus,
		color: "bg-orange-100 text-orange-600",
		category: "patient",
		isFavorite: true,
	},
];

export default function QuickActionsPage() {
	const [showActionDialog, setShowActionDialog] = useState(false);
	const [selectedAction, setSelectedAction] = useState<
		(typeof quickActionTemplates)[0] | null
	>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

	// Quick action form states
	const [selectedPatient, setSelectedPatient] = useState("");
	const [appointmentDate, setAppointmentDate] = useState("");
	const [appointmentTime, setAppointmentTime] = useState("");
	const [paymentAmount, setPaymentAmount] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");

	const handleQuickAction = (action: (typeof quickActionTemplates)[0]) => {
		setSelectedAction(action);
		setShowActionDialog(true);
	};

	const handleExecuteAction = async () => {
		if (!selectedAction) return;

		const actionData = {
			patientId: selectedPatient,
			appointmentDate,
			appointmentTime,
			paymentAmount,
			paymentMethod,
		};

		// Map action names to action types
		const actionTypeMap: Record<string, string> = {
			"Emergency Appointment": "emergency-appointment",
			"Payment Collection": "payment-collection",
			"Insurance Verification": "insurance-verification",
			"Send Forms": "send-forms",
			"Print Schedule": "print-schedule",
			"New Patient Intake": "patient-intake",
		};

		const actionType = actionTypeMap[selectedAction.name];
		if (actionType) {
			const result = await QuickActionsService.executeAction(
				actionType,
				actionData,
			);
			if (result.success) {
				setShowActionDialog(false);
				setSelectedAction(null);
				// Reset form states
				setSelectedPatient("");
				setAppointmentDate("");
				setAppointmentTime("");
				setPaymentAmount("");
				setPaymentMethod("");
			}
		}
	};

	const toggleFavorite = (actionId: string) => {
		// TODO: Implement favorite toggle
		console.log("Toggle favorite:", actionId);
	};

	const filteredActions = quickActionTemplates.filter((action) => {
		const matchesSearch =
			action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			action.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			categoryFilter === "all" || action.category === categoryFilter;

		const matchesFavorites = !showFavoritesOnly || action.isFavorite;

		return matchesSearch && matchesCategory && matchesFavorites;
	});

	const renderActionForm = () => {
		if (!selectedAction) return null;

		switch (selectedAction.category) {
			case "scheduling":
				return (
					<div className="space-y-4">
						<div>
							<Label>Patient</Label>
							<Select
								value={selectedPatient}
								onValueChange={setSelectedPatient}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient1">Sarah Johnson</SelectItem>
									<SelectItem value="patient2">Michael Chen</SelectItem>
									<SelectItem value="patient3">Emily Davis</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Date</Label>
								<Input
									type="date"
									value={appointmentDate}
									onChange={(e) => setAppointmentDate(e.target.value)}
								/>
							</div>
							<div>
								<Label>Time</Label>
								<Input
									type="time"
									value={appointmentTime}
									onChange={(e) => setAppointmentTime(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<Label>Appointment Type</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="emergency">Emergency</SelectItem>
									<SelectItem value="consultation">Consultation</SelectItem>
									<SelectItem value="cleaning">Cleaning</SelectItem>
									<SelectItem value="checkup">Check-up</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);

			case "billing":
				return (
					<div className="space-y-4">
						<div>
							<Label>Patient</Label>
							<Select
								value={selectedPatient}
								onValueChange={setSelectedPatient}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient1">Sarah Johnson</SelectItem>
									<SelectItem value="patient2">Michael Chen</SelectItem>
									<SelectItem value="patient3">Emily Davis</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Payment Amount</Label>
							<Input
								type="number"
								placeholder="0.00"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
							/>
						</div>
						<div>
							<Label>Payment Method</Label>
							<Select value={paymentMethod} onValueChange={setPaymentMethod}>
								<SelectTrigger>
									<SelectValue placeholder="Select method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="cash">Cash</SelectItem>
									<SelectItem value="credit">Credit Card</SelectItem>
									<SelectItem value="debit">Debit Card</SelectItem>
									<SelectItem value="check">Check</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);

			case "communication":
				return (
					<div className="space-y-4">
						<div>
							<Label>Patient</Label>
							<Select
								value={selectedPatient}
								onValueChange={setSelectedPatient}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient1">Sarah Johnson</SelectItem>
									<SelectItem value="patient2">Michael Chen</SelectItem>
									<SelectItem value="patient3">Emily Davis</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Form Type</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select form" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="intake">New Patient Intake</SelectItem>
									<SelectItem value="medical">Medical History</SelectItem>
									<SelectItem value="consent">Consent Form</SelectItem>
									<SelectItem value="financial">Financial Agreement</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Delivery Method</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="sms">SMS</SelectItem>
									<SelectItem value="portal">Patient Portal</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);

			default:
				return (
					<div className="space-y-4">
						<div>
							<Label>Patient (Optional)</Label>
							<Select
								value={selectedPatient}
								onValueChange={setSelectedPatient}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient1">Sarah Johnson</SelectItem>
									<SelectItem value="patient2">Michael Chen</SelectItem>
									<SelectItem value="patient3">Emily Davis</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Quick Actions
					</h1>
					<p className="text-gray-600">
						Streamline common tasks with one-click actions
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<Settings className="mr-2 h-4 w-4" />
						Customize
					</Button>
					<Button variant="outline">
						<Plus className="mr-2 h-4 w-4" />
						Create Action
					</Button>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Actions Today</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">24</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+8</span> from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Time Saved</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">2.5h</div>
						<p className="text-muted-foreground text-xs">
							Estimated time saved today
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Most Used</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-lg">Payment Collection</div>
						<p className="text-muted-foreground text-xs">Used 8 times today</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Favorites</CardTitle>
						<Bookmark className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{quickActionTemplates.filter((a) => a.isFavorite).length}
						</div>
						<p className="text-muted-foreground text-xs">
							Quick access actions
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search actions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Select value={categoryFilter} onValueChange={setCategoryFilter}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="scheduling">Scheduling</SelectItem>
						<SelectItem value="billing">Billing</SelectItem>
						<SelectItem value="communication">Communication</SelectItem>
						<SelectItem value="patient">Patient</SelectItem>
						<SelectItem value="reports">Reports</SelectItem>
						<SelectItem value="insurance">Insurance</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant={showFavoritesOnly ? "default" : "outline"}
					onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
				>
					<Star className="mr-2 h-4 w-4" />
					Favorites Only
				</Button>
			</div>

			{/* Quick Actions Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredActions.map((action) => {
					const IconComponent = action.icon;
					return (
						<Card
							key={action.id}
							className="cursor-pointer transition-shadow hover:shadow-md"
						>
							<CardContent className="p-6">
								<div className="mb-4 flex items-start justify-between">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}
									>
										<IconComponent className="h-6 w-6" />
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											toggleFavorite(action.id);
										}}
									>
										<Star
											className={`h-4 w-4 ${action.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
										/>
									</Button>
								</div>
								<h3 className="mb-2 font-medium text-gray-900">
									{action.name}
								</h3>
								<p className="mb-4 text-gray-600 text-sm">
									{action.description}
								</p>
								<div className="flex items-center justify-between">
									<Badge variant="outline" className="text-xs">
										{action.category}
									</Badge>
									<Button size="sm" onClick={() => handleQuickAction(action)}>
										<Play className="mr-1 h-3 w-3" />
										Execute
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recent Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{recentActions.map((action) => (
							<div
								key={action.id}
								className="flex items-center justify-between py-2"
							>
								<div className="flex items-center space-x-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
										{action.type === "appointment" && (
											<Calendar className="h-4 w-4 text-blue-600" />
										)}
										{action.type === "payment" && (
											<CreditCard className="h-4 w-4 text-blue-600" />
										)}
										{action.type === "communication" && (
											<MessageSquare className="h-4 w-4 text-blue-600" />
										)}
									</div>
									<div>
										<p className="font-medium text-sm">{action.action}</p>
										<p className="text-gray-500 text-xs">
											{action.patient} •{" "}
											{new Date(action.timestamp).toLocaleTimeString()}
										</p>
									</div>
								</div>
								<Button variant="ghost" size="sm">
									<RotateCcw className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Action Execution Dialog */}
			<Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedAction && (
								<div className="flex items-center space-x-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedAction.color}`}
									>
										<selectedAction.icon className="h-5 w-5" />
									</div>
									<div>
										<h3 className="font-medium">{selectedAction.name}</h3>
										<p className="text-gray-600 text-sm">
											{selectedAction.description}
										</p>
									</div>
								</div>
							)}
						</DialogTitle>
					</DialogHeader>

					{renderActionForm()}

					<div className="flex justify-end space-x-3 pt-4">
						<Button
							variant="outline"
							onClick={() => setShowActionDialog(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleExecuteAction}>
							<Play className="mr-2 h-4 w-4" />
							Execute Action
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
