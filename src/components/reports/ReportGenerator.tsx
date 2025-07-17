"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Download,
	FileText,
	Calendar,
	Clock,
	Loader2,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

interface ReportType {
	id: string;
	name: string;
	description: string;
	requiredData: string[];
	supportedFormats: string[];
	estimatedSize: string;
}

interface ReportGeneratorProps {
	reportTypes: ReportType[];
	onGenerateReport: (reportType: string, options: ReportOptions) => Promise<void>;
}

interface ReportOptions {
	dateRange?: {
		start: Date;
		end: Date;
	};
	format: string;
	includeCharts: boolean;
	includeDetails: boolean;
	customFilters?: Record<string, unknown>;
}

export default function ReportGenerator({ reportTypes, onGenerateReport }: ReportGeneratorProps) {
	const [selectedReportType, setSelectedReportType] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [reportOptions, setReportOptions] = useState<ReportOptions>({
		format: "pdf",
		includeCharts: true,
		includeDetails: true,
		dateRange: {
			start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
			end: new Date()
		}
	});

	const handleGenerateReport = async () => {
		if (!selectedReportType) return;

		setIsGenerating(true);
		try {
			await onGenerateReport(selectedReportType, reportOptions);
			setShowDialog(false);
		} catch (error) {
			console.error("Error generating report:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	const selectedReport = reportTypes.find(r => r.id === selectedReportType);

	return (
		<div className="space-y-6">
			{/* Quick Report Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{reportTypes.slice(0, 3).map((report) => (
					<Card key={report.id} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<FileText className="h-8 w-8 text-blue-600" />
								<Badge variant="outline" className="text-xs">
									{report.supportedFormats[0].toUpperCase()}
								</Badge>
							</div>
							<CardTitle className="text-lg">{report.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 mb-4">
								{report.description}
							</p>
							<div className="flex items-center justify-between text-xs text-gray-500 mb-4">
								<span>Size: {report.estimatedSize}</span>
								<span>Data: {report.requiredData.length} sources</span>
							</div>
							<Dialog open={showDialog && selectedReportType === report.id} onOpenChange={setShowDialog}>
								<DialogTrigger asChild>
									<Button 
										type="button"
										className="w-full" 
										size="sm"
										onClick={() => setSelectedReportType(report.id)}
									>
										<Download className="mr-2 h-4 w-4" />
										Generate
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle>Generate {report.name}</DialogTitle>
									</DialogHeader>
									
									<div className="space-y-4">
										{/* Date Range */}
										<div className="space-y-2">
											<Label>Date Range</Label>
											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label className="text-xs">From</Label>
													<Input
														type="date"
														value={reportOptions.dateRange?.start.toISOString().split('T')[0]}
														onChange={(e) => setReportOptions(prev => ({
															...prev,
															dateRange: {
																...prev.dateRange!,
																start: new Date(e.target.value)
															}
														}))}
													/>
												</div>
												<div>
													<Label className="text-xs">To</Label>
													<Input
														type="date"
														value={reportOptions.dateRange?.end.toISOString().split('T')[0]}
														onChange={(e) => setReportOptions(prev => ({
															...prev,
															dateRange: {
																...prev.dateRange!,
																end: new Date(e.target.value)
															}
														}))}
													/>
												</div>
											</div>
										</div>

										{/* Format Selection */}
										<div className="space-y-2">
											<Label>Format</Label>
											<Select 
												value={reportOptions.format} 
												onValueChange={(value) => setReportOptions(prev => ({ ...prev, format: value }))}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{report.supportedFormats.map(format => (
														<SelectItem key={format} value={format}>
															{format.toUpperCase()}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Options */}
										<div className="space-y-3">
											<Label>Report Options</Label>
											<div className="space-y-2">
												<div className="flex items-center space-x-2">
													<input
														type="checkbox"
														id="includeCharts"
														checked={reportOptions.includeCharts}
														onChange={(e) => setReportOptions(prev => ({ 
															...prev, 
															includeCharts: e.target.checked 
														}))}
														className="rounded"
													/>
													<Label htmlFor="includeCharts" className="text-sm">
														Include charts and graphs
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														type="checkbox"
														id="includeDetails"
														checked={reportOptions.includeDetails}
														onChange={(e) => setReportOptions(prev => ({ 
															...prev, 
															includeDetails: e.target.checked 
														}))}
														className="rounded"
													/>
													<Label htmlFor="includeDetails" className="text-sm">
														Include detailed data tables
													</Label>
												</div>
											</div>
										</div>

										{/* Report Info */}
										<div className="bg-blue-50 p-3 rounded-lg">
											<div className="flex items-center space-x-2 text-sm text-blue-800">
												<Clock className="h-4 w-4" />
												<span>Estimated generation time: 10-30 seconds</span>
											</div>
											<div className="flex items-center space-x-2 text-sm text-blue-800 mt-1">
												<FileText className="h-4 w-4" />
												<span>Size: {report.estimatedSize}</span>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex justify-end space-x-3 pt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() => setShowDialog(false)}
												disabled={isGenerating}
											>
												Cancel
											</Button>
											<Button
												type="button"
												onClick={handleGenerateReport}
												disabled={isGenerating}
											>
												{isGenerating ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Generating...
													</>
												) : (
													<>
														<Download className="mr-2 h-4 w-4" />
														Generate Report
													</>
												)}
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				))}
			</div>

			{/* All Reports List */}
			<Card>
				<CardHeader>
					<CardTitle>All Available Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{reportTypes.map((report) => (
							<div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex-1">
									<h4 className="font-medium">{report.name}</h4>
									<p className="text-sm text-gray-600">{report.description}</p>
									<div className="flex items-center space-x-4 mt-2">
										<Badge variant="outline" className="text-xs">
											{report.supportedFormats.join(", ").toUpperCase()}
										</Badge>
										<span className="text-xs text-gray-500">
											{report.estimatedSize}
										</span>
										<span className="text-xs text-gray-500">
											{report.requiredData.length} data sources
										</span>
									</div>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button 
											type="button"
											variant="outline" 
											size="sm"
											onClick={() => setSelectedReportType(report.id)}
										>
											<Download className="mr-2 h-4 w-4" />
											Generate
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-md">
										<DialogHeader>
											<DialogTitle>Generate {report.name}</DialogTitle>
										</DialogHeader>
										
										<div className="space-y-4">
											{/* Same dialog content as above */}
											<div className="space-y-2">
												<Label>Date Range</Label>
												<div className="grid grid-cols-2 gap-2">
													<div>
														<Label className="text-xs">From</Label>
														<Input
															type="date"
															value={reportOptions.dateRange?.start.toISOString().split('T')[0]}
															onChange={(e) => setReportOptions(prev => ({
																...prev,
																dateRange: {
																	...prev.dateRange!,
																	start: new Date(e.target.value)
																}
															}))}
														/>
													</div>
													<div>
														<Label className="text-xs">To</Label>
														<Input
															type="date"
															value={reportOptions.dateRange?.end.toISOString().split('T')[0]}
															onChange={(e) => setReportOptions(prev => ({
																...prev,
																dateRange: {
																	...prev.dateRange!,
																	end: new Date(e.target.value)
																}
															}))}
														/>
													</div>
												</div>
											</div>

											<div className="flex justify-end space-x-3 pt-4">
												<Button type="button" variant="outline">
													Cancel
												</Button>
												<Button type="button" onClick={handleGenerateReport} disabled={isGenerating}>
													{isGenerating ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Generating...
														</>
													) : (
														<>
															<Download className="mr-2 h-4 w-4" />
															Generate Report
														</>
													)}
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
