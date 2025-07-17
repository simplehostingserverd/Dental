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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Activity,
	AlertTriangle,
	Bell,
	Calendar,
	CheckCircle,
	CheckSquare,
	Clock,
	Filter,
	MoreHorizontal,
	Pause,
	Play,
	Plus,
	RotateCcw,
	Search,
	Settings,
	Target,
	TrendingUp,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";

// Mock data
const tasks = [
	{
		id: "1",
		title: "Verify insurance for Sarah Johnson",
		description: "Call Blue Cross to verify coverage for upcoming procedure",
		priority: "high",
		status: "pending",
		assignedTo: "Receptionist",
		dueDate: "2025-07-17",
		createdAt: "2025-07-17T08:30:00",
		patient: "Sarah Johnson",
		category: "insurance",
	},
	{
		id: "2",
		title: "Follow up on payment from Michael Chen",
		description: "Patient has outstanding balance of $150",
		priority: "medium",
		status: "in_progress",
		assignedTo: "Receptionist",
		dueDate: "2025-07-18",
		createdAt: "2025-07-16T14:20:00",
		patient: "Michael Chen",
		category: "billing",
	},
	{
		id: "3",
		title: "Schedule cleaning for Emily Davis",
		description: "Patient requested 6-month cleaning appointment",
		priority: "low",
		status: "completed",
		assignedTo: "Receptionist",
		dueDate: "2025-07-16",
		createdAt: "2025-07-15T10:15:00",
		patient: "Emily Davis",
		category: "scheduling",
	},
	{
		id: "4",
		title: "Room 2 needs cleaning supplies",
		description: "Restock cleaning supplies and check equipment",
		priority: "medium",
		status: "pending",
		assignedTo: "Staff",
		dueDate: "2025-07-17",
		createdAt: "2025-07-17T09:45:00",
		patient: null,
		category: "maintenance",
	},
];

const workflows = [
	{
		id: "1",
		name: "New Patient Onboarding",
		description:
			"Complete workflow for new patient registration and first appointment",
		status: "active",
		steps: 8,
		completedSteps: 5,
		triggerType: "manual",
		lastRun: "2025-07-17T10:30:00",
		runCount: 24,
	},
	{
		id: "2",
		name: "Appointment Reminder Sequence",
		description: "Automated reminders 24h, 2h, and 30min before appointments",
		status: "active",
		steps: 3,
		completedSteps: 3,
		triggerType: "scheduled",
		lastRun: "2025-07-17T08:00:00",
		runCount: 156,
	},
	{
		id: "3",
		name: "Insurance Verification Process",
		description: "Verify patient insurance before scheduled procedures",
		status: "paused",
		steps: 5,
		completedSteps: 2,
		triggerType: "event",
		lastRun: "2025-07-16T15:20:00",
		runCount: 89,
	},
	{
		id: "4",
		name: "Post-Treatment Follow-up",
		description: "Follow up with patients 24h and 1 week after treatment",
		status: "active",
		steps: 4,
		completedSteps: 4,
		triggerType: "event",
		lastRun: "2025-07-17T12:15:00",
		runCount: 67,
	},
];

const automationRules = [
	{
		id: "1",
		name: "Late Appointment Alert",
		description: "Send alert when patient is 15+ minutes late",
		trigger: "appointment_late",
		action: "send_notification",
		isActive: true,
		lastTriggered: "2025-07-17T14:45:00",
		triggerCount: 12,
	},
	{
		id: "2",
		name: "Payment Reminder",
		description: "Send payment reminder for overdue balances",
		trigger: "payment_overdue",
		action: "send_sms",
		isActive: true,
		lastTriggered: "2025-07-16T09:30:00",
		triggerCount: 8,
	},
	{
		id: "3",
		name: "Insurance Expiry Alert",
		description: "Alert when patient insurance is expiring soon",
		trigger: "insurance_expiring",
		action: "create_task",
		isActive: false,
		lastTriggered: "2025-07-10T11:20:00",
		triggerCount: 3,
	},
];

export default function TasksPage() {
	const [showTaskDialog, setShowTaskDialog] = useState(false);
	const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		priority: "",
		assignedTo: "",
		dueDate: "",
		category: "",
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			case "active":
				return "bg-green-100 text-green-800";
			case "paused":
				return "bg-yellow-100 text-yellow-800";
			case "inactive":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-4 w-4" />;
			case "in_progress":
				return <Clock className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "overdue":
				return <AlertTriangle className="h-4 w-4" />;
			case "active":
				return <Play className="h-4 w-4" />;
			case "paused":
				return <Pause className="h-4 w-4" />;
			case "inactive":
				return <XCircle className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const handleCreateTask = () => {
		if (
			!newTask.title ||
			!newTask.priority ||
			!newTask.assignedTo ||
			!newTask.dueDate
		) {
			alert("Please fill in all required fields");
			return;
		}

		// TODO: Implement task creation
		console.log("Creating task:", newTask);
		setShowTaskDialog(false);
		setNewTask({
			title: "",
			description: "",
			priority: "",
			assignedTo: "",
			dueDate: "",
			category: "",
		});
	};

	const handleTaskStatusChange = (taskId: string, newStatus: string) => {
		// TODO: Implement task status update
		console.log("Updating task status:", { taskId, newStatus });
	};

	const handleWorkflowAction = (workflowId: string, action: string) => {
		// TODO: Implement workflow actions
		console.log("Workflow action:", { workflowId, action });
	};

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.patient?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || task.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const pendingTasks = tasks.filter((t) => t.status === "pending").length;
	const inProgressTasks = tasks.filter(
		(t) => t.status === "in_progress",
	).length;
	const completedTasks = tasks.filter((t) => t.status === "completed").length;
	const activeWorkflows = workflows.filter((w) => w.status === "active").length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Tasks & Workflows
					</h1>
					<p className="text-gray-600">
						Manage daily tasks, automate workflows, and track productivity
					</p>
				</div>
				<div className="flex space-x-3">
					<Dialog
						open={showWorkflowDialog}
						onOpenChange={setShowWorkflowDialog}
					>
						<DialogTrigger asChild>
							<Button type="button" variant="outline">
								<Zap className="mr-2 h-4 w-4" />
								Create Workflow
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Workflow</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Workflow Name</Label>
									<Input placeholder="Enter workflow name" />
								</div>
								<div>
									<Label>Description</Label>
									<Textarea placeholder="Describe the workflow..." rows={3} />
								</div>
								<div>
									<Label>Trigger Type</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select trigger" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="manual">Manual</SelectItem>
											<SelectItem value="scheduled">Scheduled</SelectItem>
											<SelectItem value="event">Event-based</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowWorkflowDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button">Create Workflow</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
						<DialogTrigger asChild>
							<Button type="button">
								<Plus className="mr-2 h-4 w-4" />
								New Task
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Task</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Task Title *</Label>
									<Input
										placeholder="Enter task title"
										value={newTask.title}
										onChange={(e) =>
											setNewTask((prev) => ({ ...prev, title: e.target.value }))
										}
									/>
								</div>
								<div>
									<Label>Description</Label>
									<Textarea
										placeholder="Task description..."
										value={newTask.description}
										onChange={(e) =>
											setNewTask((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										rows={3}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label>Priority *</Label>
										<Select
											value={newTask.priority}
											onValueChange={(value) =>
												setNewTask((prev) => ({ ...prev, priority: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">Low</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="high">High</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Assigned To *</Label>
										<Select
											value={newTask.assignedTo}
											onValueChange={(value) =>
												setNewTask((prev) => ({ ...prev, assignedTo: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Assign to" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Receptionist">
													Receptionist
												</SelectItem>
												<SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
												<SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
												<SelectItem value="Staff">Staff</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label>Due Date *</Label>
										<Input
											type="date"
											value={newTask.dueDate}
											onChange={(e) =>
												setNewTask((prev) => ({
													...prev,
													dueDate: e.target.value,
												}))
											}
										/>
									</div>
									<div>
										<Label>Category</Label>
										<Select
											value={newTask.category}
											onValueChange={(value) =>
												setNewTask((prev) => ({ ...prev, category: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="scheduling">Scheduling</SelectItem>
												<SelectItem value="billing">Billing</SelectItem>
												<SelectItem value="insurance">Insurance</SelectItem>
												<SelectItem value="maintenance">Maintenance</SelectItem>
												<SelectItem value="follow-up">Follow-up</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowTaskDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button" onClick={handleCreateTask}>
										<Plus className="mr-2 h-4 w-4" />
										Create Task
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Pending Tasks</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{pendingTasks}</div>
						<p className="text-muted-foreground text-xs">
							{inProgressTasks} in progress
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Completed Today
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{completedTasks}</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+2</span> from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Active Workflows
						</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{activeWorkflows}</div>
						<p className="text-muted-foreground text-xs">
							{workflows.length - activeWorkflows} paused
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Productivity</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">87%</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+5%</span> this week
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tasks and Workflows Tabs */}
			<Tabs defaultValue="tasks" className="space-y-4">
				<TabsList>
					<TabsTrigger value="tasks">My Tasks</TabsTrigger>
					<TabsTrigger value="workflows">Workflows</TabsTrigger>
					<TabsTrigger value="automation">Automation Rules</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
				</TabsList>

				{/* Tasks Tab */}
				<TabsContent value="tasks" className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative max-w-md flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search tasks..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Filter className="mr-2 h-4 w-4" />
									Status: {statusFilter === "all" ? "All" : statusFilter}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => setStatusFilter("all")}>
									All Tasks
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("pending")}>
									Pending
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setStatusFilter("in_progress")}
								>
									In Progress
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("completed")}>
									Completed
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="space-y-4">
						{filteredTasks.map((task) => (
							<Card key={task.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-start space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
												<CheckSquare className="h-5 w-5 text-blue-600" />
											</div>
											<div className="flex-1">
												<h4 className="font-medium">{task.title}</h4>
												<p className="mt-1 text-gray-600 text-sm">
													{task.description}
												</p>
												<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
													<span className="flex items-center">
														<User className="mr-1 h-3 w-3" />
														{task.assignedTo}
													</span>
													<span className="flex items-center">
														<Calendar className="mr-1 h-3 w-3" />
														Due: {new Date(task.dueDate).toLocaleDateString()}
													</span>
													{task.patient && (
														<span className="flex items-center">
															<User className="mr-1 h-3 w-3" />
															{task.patient}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="mb-2 flex items-center space-x-2">
												<Badge className={getPriorityColor(task.priority)}>
													{task.priority}
												</Badge>
												<Badge className={getStatusColor(task.status)}>
													{getStatusIcon(task.status)}
													<span className="ml-1">
														{task.status.replace("_", " ")}
													</span>
												</Badge>
											</div>
											<div className="flex space-x-2">
												{task.status === "pending" && (
													<Button
														size="sm"
														onClick={() =>
															handleTaskStatusChange(task.id, "in_progress")
														}
													>
														Start
													</Button>
												)}
												{task.status === "in_progress" && (
													<Button
														size="sm"
														onClick={() =>
															handleTaskStatusChange(task.id, "completed")
														}
													>
														Complete
													</Button>
												)}
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>Edit Task</DropdownMenuItem>
														<DropdownMenuItem>Reassign</DropdownMenuItem>
														<DropdownMenuItem>Set Reminder</DropdownMenuItem>
														<DropdownMenuItem className="text-red-600">
															Delete Task
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Workflows Tab */}
				<TabsContent value="workflows" className="space-y-4">
					<div className="space-y-4">
						{workflows.map((workflow) => (
							<Card key={workflow.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-start space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
												<Zap className="h-5 w-5 text-purple-600" />
											</div>
											<div className="flex-1">
												<h4 className="font-medium">{workflow.name}</h4>
												<p className="mt-1 text-gray-600 text-sm">
													{workflow.description}
												</p>
												<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
													<span>
														Progress: {workflow.completedSteps}/{workflow.steps}{" "}
														steps
													</span>
													<span>Trigger: {workflow.triggerType}</span>
													<span>Runs: {workflow.runCount}</span>
													<span>
														Last run:{" "}
														{new Date(workflow.lastRun).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<Badge className={getStatusColor(workflow.status)}>
												{getStatusIcon(workflow.status)}
												<span className="ml-1">{workflow.status}</span>
											</Badge>
											<div className="mt-2 flex space-x-2">
												{workflow.status === "active" && (
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															handleWorkflowAction(workflow.id, "pause")
														}
													>
														<Pause className="h-4 w-4" />
													</Button>
												)}
												{workflow.status === "paused" && (
													<Button
														size="sm"
														onClick={() =>
															handleWorkflowAction(workflow.id, "resume")
														}
													>
														<Play className="h-4 w-4" />
													</Button>
												)}
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleWorkflowAction(workflow.id, "run")
													}
												>
													<RotateCcw className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="outline">
													<Settings className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Automation Rules Tab */}
				<TabsContent value="automation" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-lg">Automation Rules</h3>
						<Button variant="outline">
							<Plus className="mr-2 h-4 w-4" />
							Create Rule
						</Button>
					</div>

					<div className="space-y-4">
						{automationRules.map((rule) => (
							<Card key={rule.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-start space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
												<Target className="h-5 w-5 text-orange-600" />
											</div>
											<div className="flex-1">
												<h4 className="font-medium">{rule.name}</h4>
												<p className="mt-1 text-gray-600 text-sm">
													{rule.description}
												</p>
												<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
													<span>Trigger: {rule.trigger.replace("_", " ")}</span>
													<span>Action: {rule.action.replace("_", " ")}</span>
													<span>Triggered: {rule.triggerCount} times</span>
													{rule.lastTriggered && (
														<span>
															Last:{" "}
															{new Date(
																rule.lastTriggered,
															).toLocaleDateString()}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<Badge
												className={
													rule.isActive
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}
											>
												{rule.isActive ? "Active" : "Inactive"}
											</Badge>
											<div className="mt-2 flex space-x-2">
												<Button size="sm" variant="outline">
													{rule.isActive ? "Disable" : "Enable"}
												</Button>
												<Button size="sm" variant="outline">
													<Settings className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value="analytics" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Task Completion Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl text-green-600">94%</div>
								<p className="text-gray-600 text-sm">
									Tasks completed on time this week
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Average Task Duration
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl text-blue-600">2.3h</div>
								<p className="text-gray-600 text-sm">
									Average time to complete tasks
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Workflow Efficiency</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl text-purple-600">87%</div>
								<p className="text-gray-600 text-sm">
									Workflows completing successfully
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
