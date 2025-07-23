"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	Shield, 
	Plus, 
	Edit, 
	Trash2, 
	Search, 
	Filter,
	Building2,
	Phone,
	Mail,
	Globe,
	CheckCircle,
	AlertCircle,
	Settings,
	Download,
	Upload,
	RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InsurancePayer {
	id: string;
	name: string;
	type: "primary" | "secondary" | "tertiary";
	payerCode: string;
	address: string;
	phone: string;
	email: string;
	website?: string;
	isActive: boolean;
	clearinghouseId?: string;
	eligibilityEndpoint?: string;
	claimsEndpoint?: string;
	remittanceEndpoint?: string;
	contractedRates: {
		preventive: number;
		basic: number;
		major: number;
		orthodontic: number;
	};
	createdAt: string;
	updatedAt: string;
}

interface Clearinghouse {
	id: string;
	name: string;
	type: "dental" | "medical" | "both";
	apiEndpoint: string;
	username: string;
	password: string;
	submitterId: string;
	receiverId: string;
	isActive: boolean;
	supportedTransactions: string[];
	testMode: boolean;
	lastSync: string;
	status: "connected" | "disconnected" | "error";
}

export default function InsuranceManagementPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [selectedPayer, setSelectedPayer] = useState<InsurancePayer | null>(null);
	const [selectedClearinghouse, setSelectedClearinghouse] = useState<Clearinghouse | null>(null);
	const [isPayerDialogOpen, setIsPayerDialogOpen] = useState(false);
	const [isClearinghouseDialogOpen, setIsClearinghouseDialogOpen] = useState(false);

	// Mock data for insurance payers
	const insurancePayers: InsurancePayer[] = [
		{
			id: "1",
			name: "Delta Dental",
			type: "primary",
			payerCode: "DELTA001",
			address: "123 Insurance Ave, Dallas, TX 75201",
			phone: "(800) 123-4567",
			email: "claims@deltadental.com",
			website: "https://deltadental.com",
			isActive: true,
			clearinghouseId: "1",
			eligibilityEndpoint: "https://api.deltadental.com/eligibility",
			claimsEndpoint: "https://api.deltadental.com/claims",
			remittanceEndpoint: "https://api.deltadental.com/remittance",
			contractedRates: {
				preventive: 100,
				basic: 80,
				major: 50,
				orthodontic: 50
			},
			createdAt: "2024-01-01",
			updatedAt: "2024-01-15"
		},
		{
			id: "2",
			name: "MetLife Dental",
			type: "primary",
			payerCode: "METLIFE001",
			address: "456 Coverage Blvd, Houston, TX 77001",
			phone: "(800) 234-5678",
			email: "dental@metlife.com",
			website: "https://metlife.com",
			isActive: true,
			clearinghouseId: "1",
			contractedRates: {
				preventive: 100,
				basic: 80,
				major: 60,
				orthodontic: 50
			},
			createdAt: "2024-01-02",
			updatedAt: "2024-01-14"
		},
		{
			id: "3",
			name: "Cigna Dental",
			type: "primary",
			payerCode: "CIGNA001",
			address: "789 Benefits St, Austin, TX 78701",
			phone: "(800) 345-6789",
			email: "claims@cigna.com",
			website: "https://cigna.com",
			isActive: true,
			clearinghouseId: "2",
			contractedRates: {
				preventive: 100,
				basic: 70,
				major: 50,
				orthodontic: 50
			},
			createdAt: "2024-01-03",
			updatedAt: "2024-01-13"
		}
	];

	// Mock data for clearinghouses
	const clearinghouses: Clearinghouse[] = [
		{
			id: "1",
			name: "DentalXChange",
			type: "dental",
			apiEndpoint: "https://api.dentalxchange.com",
			username: "practice_user",
			password: "encrypted_password",
			submitterId: "DXC12345",
			receiverId: "REC67890",
			isActive: true,
			supportedTransactions: ["270", "271", "837", "835", "276", "277"],
			testMode: false,
			lastSync: "2024-01-15 14:30:00",
			status: "connected"
		},
		{
			id: "2",
			name: "NEA FastAttach",
			type: "dental",
			apiEndpoint: "https://api.neafastattach.com",
			username: "practice_nea",
			password: "encrypted_password",
			submitterId: "NEA54321",
			receiverId: "REC09876",
			isActive: true,
			supportedTransactions: ["270", "271", "837", "835"],
			testMode: false,
			lastSync: "2024-01-15 13:45:00",
			status: "connected"
		},
		{
			id: "3",
			name: "ClaimConnect",
			type: "both",
			apiEndpoint: "https://api.claimconnect.com",
			username: "practice_cc",
			password: "encrypted_password",
			submitterId: "CC98765",
			receiverId: "REC13579",
			isActive: false,
			supportedTransactions: ["270", "271", "837", "835", "276", "277", "278"],
			testMode: true,
			lastSync: "2024-01-10 09:15:00",
			status: "disconnected"
		}
	];

	const filteredPayers = insurancePayers.filter(payer => {
		const matchesSearch = payer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			payer.payerCode.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterType === "all" || payer.type === filterType;
		return matchesSearch && matchesFilter;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "connected": return "bg-green-100 text-green-800";
			case "disconnected": return "bg-red-100 text-red-800";
			case "error": return "bg-orange-100 text-orange-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "primary": return "bg-blue-100 text-blue-800";
			case "secondary": return "bg-purple-100 text-purple-800";
			case "tertiary": return "bg-gray-100 text-gray-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const handleTestConnection = async (clearinghouseId: string) => {
		// Test clearinghouse connection
		try {
			const response = await fetch(`/api/clearinghouse/${clearinghouseId}/test`, {
				method: "POST"
			});
			if (response.ok) {
				alert("Connection test successful!");
			} else {
				alert("Connection test failed!");
			}
		} catch (error) {
			console.error("Connection test error:", error);
			alert("Connection test error!");
		}
	};

	const handleSyncEligibility = async (payerId: string) => {
		// Sync eligibility data
		try {
			const response = await fetch(`/api/insurance/${payerId}/eligibility`, {
				method: "POST"
			});
			if (response.ok) {
				alert("Eligibility sync completed!");
			} else {
				alert("Eligibility sync failed!");
			}
		} catch (error) {
			console.error("Eligibility sync error:", error);
			alert("Eligibility sync error!");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Header */}
			<nav className="border-gray-200 border-b bg-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo />
							</Link>
							<div className="ml-6 hidden md:block">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/dashboard"
										className="rounded-md px-3 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-900"
									>
										Dashboard
									</Link>
									<Link
										href="/dashboard/billing"
										className="rounded-md px-3 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-900"
									>
										Billing
									</Link>
									<span className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium">
										Insurance
									</span>
								</div>
							</div>
						</div>
						<Button asChild>
							<Link href="/dashboard/insurance/reports">
								<Download className="mr-2 h-4 w-4" />
								Reports
							</Link>
						</Button>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold text-3xl text-gray-900">Insurance Management</h1>
							<p className="mt-2 text-gray-600">Manage insurance payers and clearinghouse connections</p>
						</div>
						<div className="flex space-x-3">
							<Button variant="outline" onClick={() => setIsClearinghouseDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Clearinghouse
							</Button>
							<Button onClick={() => setIsPayerDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Payer
							</Button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Active Payers</p>
									<p className="font-bold text-2xl text-gray-900">
										{insurancePayers.filter(p => p.isActive).length}
									</p>
								</div>
								<Shield className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Connected Clearinghouses</p>
									<p className="font-bold text-2xl text-gray-900">
										{clearinghouses.filter(c => c.status === "connected").length}
									</p>
								</div>
								<Globe className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Primary Payers</p>
									<p className="font-bold text-2xl text-gray-900">
										{insurancePayers.filter(p => p.type === "primary").length}
									</p>
								</div>
								<Building2 className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Avg Coverage Rate</p>
									<p className="font-bold text-2xl text-gray-900">75%</p>
								</div>
								<CheckCircle className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="payers" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="payers">Insurance Payers</TabsTrigger>
						<TabsTrigger value="clearinghouses">Clearinghouses</TabsTrigger>
					</TabsList>

					<TabsContent value="payers">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Insurance Payers</CardTitle>
									<div className="flex space-x-4">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
											<Input
												placeholder="Search payers..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="pl-10 w-64"
											/>
										</div>
										<Select value={filterType} onValueChange={setFilterType}>
											<SelectTrigger className="w-40">
												<SelectValue placeholder="Filter by type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Types</SelectItem>
												<SelectItem value="primary">Primary</SelectItem>
												<SelectItem value="secondary">Secondary</SelectItem>
												<SelectItem value="tertiary">Tertiary</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredPayers.map((payer) => (
										<div key={payer.id} className="rounded-lg border border-gray-200 bg-white p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">{payer.name}</h3>
														<Badge className={getTypeColor(payer.type)}>
															{payer.type}
														</Badge>
														<Badge className={payer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
															{payer.isActive ? "Active" : "Inactive"}
														</Badge>
													</div>
													<div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
														<div>
															<span className="font-medium">Payer Code:</span> {payer.payerCode}
														</div>
														<div>
															<span className="font-medium">Phone:</span> {payer.phone}
														</div>
														<div>
															<span className="font-medium">Email:</span> {payer.email}
														</div>
														<div>
															<span className="font-medium">Clearinghouse:</span> {
																clearinghouses.find(c => c.id === payer.clearinghouseId)?.name || "Not assigned"
															}
														</div>
													</div>
													<div className="mt-3">
														<h4 className="font-medium text-gray-900 text-sm">Coverage Rates:</h4>
														<div className="mt-1 grid grid-cols-4 gap-4 text-sm text-gray-600">
															<div>Preventive: {payer.contractedRates.preventive}%</div>
															<div>Basic: {payer.contractedRates.basic}%</div>
															<div>Major: {payer.contractedRates.major}%</div>
															<div>Orthodontic: {payer.contractedRates.orthodontic}%</div>
														</div>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleSyncEligibility(payer.id)}
													>
														<RefreshCw className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setSelectedPayer(payer)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="clearinghouses">
						<Card>
							<CardHeader>
								<CardTitle>Clearinghouse Connections</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{clearinghouses.map((clearinghouse) => (
										<div key={clearinghouse.id} className="rounded-lg border border-gray-200 bg-white p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">{clearinghouse.name}</h3>
														<Badge className={getStatusColor(clearinghouse.status)}>
															{clearinghouse.status}
														</Badge>
														<Badge variant="outline">
															{clearinghouse.type}
														</Badge>
														{clearinghouse.testMode && (
															<Badge className="bg-yellow-100 text-yellow-800">
																Test Mode
															</Badge>
														)}
													</div>
													<div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
														<div>
															<span className="font-medium">Submitter ID:</span> {clearinghouse.submitterId}
														</div>
														<div>
															<span className="font-medium">Receiver ID:</span> {clearinghouse.receiverId}
														</div>
														<div>
															<span className="font-medium">Last Sync:</span> {clearinghouse.lastSync}
														</div>
														<div>
															<span className="font-medium">Transactions:</span> {clearinghouse.supportedTransactions.join(", ")}
														</div>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleTestConnection(clearinghouse.id)}
													>
														Test Connection
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setSelectedClearinghouse(clearinghouse)}
													>
														<Settings className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
