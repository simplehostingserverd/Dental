"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertCircle,
	CheckCircle,
	Download,
	FileText,
	Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface ImportProgress {
	total: number;
	processed: number;
	successful: number;
	failed: number;
	errors: Array<{ row: number; error: string; data?: any }>;
}

interface DataImportWizardProps {
	practiceId: string;
	onImportComplete?: (result: any) => void;
}

export default function DataImportWizard({
	practiceId,
	onImportComplete,
}: DataImportWizardProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState<ImportProgress | null>(null);
	const [importResult, setImportResult] = useState<any>(null);
	const [activeTab, setActiveTab] = useState("upload");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setImportResult(null);
			setProgress(null);
		}
	};

	const handleImport = async () => {
		if (!selectedFile) return;

		setIsUploading(true);
		setActiveTab("progress");

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("practiceId", practiceId);

			const response = await fetch("/api/data-import", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				setImportResult(result);
				setProgress(result.progress);
				setActiveTab("results");
				onImportComplete?.(result);
			} else {
				throw new Error(result.error || "Import failed");
			}
		} catch (error) {
			console.error("Import error:", error);
			setImportResult({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
			setActiveTab("results");
		} finally {
			setIsUploading(false);
		}
	};

	const downloadTemplate = () => {
		const template = [
			{
				firstName: "Juan",
				lastName: "Pérez",
				dateOfBirth: "1985-03-15",
				gender: "Male",
				phone: "+52 55 1234-5678",
				email: "juan.perez@email.com",
				"address.street": "Av. Insurgentes Sur 123",
				"address.city": "Ciudad de México",
				"address.state": "CDMX",
				"address.zipCode": "03100",
				"address.country": "México",
				"emergencyContact.name": "María Pérez",
				"emergencyContact.phone": "+52 55 8765-4321",
				"emergencyContact.relationship": "Esposa",
				"insurance.provider": "IMSS",
				"insurance.policyNumber": "12345678901",
				"insurance.groupNumber": "GRP001",
			},
		];

		const csvContent = [
			Object.keys(template[0] || {}).join(","),
			...template.map((row) => Object.values(row).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "patient_import_template.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	const downloadErrorReport = () => {
		if (!progress?.errors.length) return;

		const errorReport = progress.errors.map((error) => ({
			row: error.row,
			error: error.error,
			data: JSON.stringify(error.data),
		}));

		const csvContent = [
			"Row,Error,Data",
			...errorReport.map((row) => `${row.row},"${row.error}","${row.data}"`),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "import_errors.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="h-5 w-5" />
					Importar Datos de Pacientes
				</CardTitle>
				<CardDescription>
					Importe datos de pacientes existentes desde archivos CSV, Excel o JSON
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="upload">Subir Archivo</TabsTrigger>
						<TabsTrigger value="progress" disabled={!isUploading && !progress}>
							Progreso
						</TabsTrigger>
						<TabsTrigger value="results" disabled={!importResult}>
							Resultados
						</TabsTrigger>
					</TabsList>

					<TabsContent value="upload" className="space-y-6">
						<div className="space-y-4">
							<div>
								<Label htmlFor="file-upload">Seleccionar Archivo</Label>
								<div className="mt-2">
									<Input
										ref={fileInputRef}
										id="file-upload"
										type="file"
										accept=".csv,.xlsx,.xls,.json"
										onChange={handleFileSelect}
										className="cursor-pointer"
									/>
								</div>
								<p className="mt-1 text-gray-500 text-sm">
									Formatos soportados: CSV, Excel (.xlsx, .xls), JSON
								</p>
							</div>

							{selectedFile && (
								<Alert>
									<FileText className="h-4 w-4" />
									<AlertDescription>
										Archivo seleccionado: {selectedFile.name} (
										{(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
									</AlertDescription>
								</Alert>
							)}

							<div className="flex gap-4">
								<Button
									onClick={handleImport}
									disabled={!selectedFile || isUploading}
									className="flex-1"
								>
									{isUploading ? "Importando..." : "Iniciar Importación"}
								</Button>
								<Button variant="outline" onClick={downloadTemplate}>
									<Download className="mr-2 h-4 w-4" />
									Descargar Plantilla
								</Button>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-semibold text-lg">
								Formato de Datos Requerido
							</h3>
							<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
								<div>
									<h4 className="font-medium">Campos Obligatorios:</h4>
									<ul className="list-inside list-disc space-y-1 text-gray-600">
										<li>firstName (Nombre)</li>
										<li>lastName (Apellido)</li>
										<li>dateOfBirth (Fecha de Nacimiento)</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium">Campos Opcionales:</h4>
									<ul className="list-inside list-disc space-y-1 text-gray-600">
										<li>gender (Género)</li>
										<li>phone (Teléfono)</li>
										<li>email (Correo Electrónico)</li>
										<li>address.* (Dirección)</li>
										<li>emergencyContact.* (Contacto de Emergencia)</li>
										<li>insurance.* (Seguro)</li>
									</ul>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="progress" className="space-y-6">
						{isUploading && (
							<div className="space-y-4">
								<div className="text-center">
									<h3 className="font-semibold text-lg">Importando Datos...</h3>
									<p className="text-gray-600">
										Por favor espere mientras procesamos su archivo
									</p>
								</div>
								<div className="h-2 w-full rounded-full bg-gray-200">
									<div
										className="h-2 animate-pulse rounded-full bg-blue-600"
										style={{ width: "50%" }}
									/>
								</div>
							</div>
						)}

						{progress && (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div className="text-center">
										<div className="font-bold text-2xl text-blue-600">
											{progress.total}
										</div>
										<div className="text-gray-600 text-sm">Total</div>
									</div>
									<div className="text-center">
										<div className="font-bold text-2xl text-green-600">
											{progress.successful}
										</div>
										<div className="text-gray-600 text-sm">Exitosos</div>
									</div>
									<div className="text-center">
										<div className="font-bold text-2xl text-red-600">
											{progress.failed}
										</div>
										<div className="text-gray-600 text-sm">Fallidos</div>
									</div>
									<div className="text-center">
										<div className="font-bold text-2xl text-gray-600">
											{progress.processed}
										</div>
										<div className="text-gray-600 text-sm">Procesados</div>
									</div>
								</div>
								<Progress value={(progress.processed / progress.total) * 100} />
							</div>
						)}
					</TabsContent>

					<TabsContent value="results" className="space-y-6">
						{importResult && (
							<div className="space-y-4">
								{importResult.success ? (
									<Alert>
										<CheckCircle className="h-4 w-4" />
										<AlertDescription>{importResult.message}</AlertDescription>
									</Alert>
								) : (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											Error: {importResult.error}
										</AlertDescription>
									</Alert>
								)}

								{progress && progress.errors.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">Errores de Importación</h4>
											<Button
												variant="outline"
												size="sm"
												onClick={downloadErrorReport}
											>
												<Download className="mr-2 h-4 w-4" />
												Descargar Reporte de Errores
											</Button>
										</div>
										<div className="max-h-60 overflow-y-auto rounded border p-4">
											{progress.errors.slice(0, 10).map((error, index) => (
												<div
													key={index}
													className="border-b py-1 text-sm last:border-b-0"
												>
													<span className="font-medium">Fila {error.row}:</span>{" "}
													{error.error}
												</div>
											))}
											{progress.errors.length > 10 && (
												<div className="pt-2 text-gray-500 text-sm">
													... y {progress.errors.length - 10} errores más
												</div>
											)}
										</div>
									</div>
								)}

								<div className="flex gap-4">
									<Button
										onClick={() => {
											setActiveTab("upload");
											setSelectedFile(null);
											setImportResult(null);
											setProgress(null);
											if (fileInputRef.current) {
												fileInputRef.current.value = "";
											}
										}}
									>
										Importar Otro Archivo
									</Button>
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
