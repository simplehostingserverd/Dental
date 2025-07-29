import DataImportWizard from "@/components/data-import/DataImportWizard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { ArrowLeft, Database, FileText, Shield, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DataImportPageES() {
	const user = await getCurrentUser();

	if (!user || user.type !== "practice") {
		redirect("/es/auth/signin");
	}

	// Check if user has permission to import data
	if (user.role !== "ADMIN" && user.role !== "DENTIST") {
		redirect("/es/dashboard");
	}

	// Get user's practice
	const practiceUser = await db.practiceUser.findUnique({
		where: { id: user.id },
		include: {
			practice: true,
		},
	});

	if (!practiceUser?.practice) {
		redirect("/es/dashboard");
	}

	// Get current patient count
	const patientCount = await db.patient.count({
		where: { practiceId: practiceUser.practice.id },
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
			<div className="container mx-auto space-y-6">
				{/* Header */}
				<div className="mb-6 flex items-center gap-4">
					<Link
						href="/es/dashboard"
						className="flex items-center text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al Panel
					</Link>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-3xl text-gray-900 tracking-tight">
							Importación de Datos de Pacientes
						</h1>
						<p className="mt-2 text-gray-600">
							Importe sus 6,500+ pacientes existentes de manera segura y
							eficiente
						</p>
					</div>
				</div>

				{/* Practice Info */}
				<Card className="border-green-200 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-800">
							<Database className="h-5 w-5" />
							Información de la Clínica Dental
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-green-100 p-3">
									<Users className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">
										{practiceUser.practice.name}
									</div>
									<div className="text-gray-600 text-sm">
										Clínica Dental Mexicana
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-blue-100 p-3">
									<Users className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">
										{patientCount.toLocaleString()}
									</div>
									<div className="text-gray-600 text-sm">
										Pacientes Registrados
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-red-100 p-3">
									<Shield className="h-6 w-6 text-red-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">
										ID: {practiceUser.practice.id.slice(0, 8)}...
									</div>
									<div className="text-gray-600 text-sm">
										Identificador Único
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Security Notice */}
				<Alert className="border-green-200 bg-green-50">
					<Shield className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-800">
						<strong>🔒 Seguridad Garantizada:</strong> Sus datos están
						protegidos con cifrado de nivel bancario. Cada clínica dental tiene
						un ID único que garantiza el aislamiento completo de datos. Los
						pacientes de "Beautiful Smiles Dental Clinic", "Creative Smile
						Dental Clinic" y "Wizard Dental Clinic" permanecen completamente
						separados y seguros.
					</AlertDescription>
				</Alert>

				{/* Multi-Practice Information */}
				<Card className="border-blue-200 bg-blue-50/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-800">
							<Database className="h-5 w-5" />
							Sistema Multi-Clínica
						</CardTitle>
						<CardDescription className="text-blue-700">
							Gestión segura para múltiples ubicaciones dentales
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="rounded-lg border border-blue-200 bg-white p-4">
								<h4 className="mb-2 font-semibold text-blue-800">
									🏥 Beautiful Smiles Dental Clinic
								</h4>
								<p className="text-blue-700 text-sm">
									ID único asignado automáticamente
								</p>
								<p className="mt-1 text-blue-600 text-xs">
									Datos completamente aislados
								</p>
							</div>
							<div className="rounded-lg border border-blue-200 bg-white p-4">
								<h4 className="mb-2 font-semibold text-blue-800">
									😊 Creative Smile Dental Clinic
								</h4>
								<p className="text-blue-700 text-sm">
									ID único asignado automáticamente
								</p>
								<p className="mt-1 text-blue-600 text-xs">
									Datos completamente aislados
								</p>
							</div>
							<div className="rounded-lg border border-blue-200 bg-white p-4">
								<h4 className="mb-2 font-semibold text-blue-800">
									🧙‍♂️ Wizard Dental Clinic
								</h4>
								<p className="text-blue-700 text-sm">
									ID único asignado automáticamente
								</p>
								<p className="mt-1 text-blue-600 text-xs">
									Datos completamente aislados
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Import Guidelines */}
				<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-800">
							<FileText className="h-5 w-5" />
							Guía para Importar 6,500+ Pacientes
						</CardTitle>
						<CardDescription>
							Recomendaciones para una importación masiva exitosa
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="space-y-3">
								<h4 className="font-semibold text-green-600">
									✅ Para Importación Masiva
								</h4>
								<ul className="space-y-2 text-sm">
									<li>• Divida archivos grandes en lotes de 1,000 pacientes</li>
									<li>• Use la plantilla CSV proporcionada</li>
									<li>• Verifique formato de fechas: YYYY-MM-DD</li>
									<li>• Incluya números telefónicos mexicanos: +52</li>
									<li>• Valide direcciones mexicanas completas</li>
									<li>• Incluya información de IMSS/ISSSTE si aplica</li>
									<li>• Haga respaldo antes de importar</li>
								</ul>
							</div>
							<div className="space-y-3">
								<h4 className="font-semibold text-red-600">
									⚠️ Evite Estos Errores
								</h4>
								<ul className="space-y-2 text-sm">
									<li>• No mezcle datos de diferentes clínicas</li>
									<li>• No use caracteres especiales en nombres</li>
									<li>• No incluya pacientes duplicados</li>
									<li>• No omita campos obligatorios</li>
									<li>• No use formatos de fecha inconsistentes</li>
									<li>• No exceda 50MB por archivo</li>
									<li>• No incluya información médica sensible</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Import Wizard */}
				<DataImportWizard
					practiceId={practiceUser.practice.id}
					onImportComplete={(result) => {
						console.log("Importación completada:", result);
					}}
				/>

				{/* Support Information */}
				<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-gray-800">
							🇲🇽 Soporte para Clínicas Mexicanas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-3 font-semibold text-green-600">
									Soporte Técnico 24/7
								</h4>
								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<span>📧</span>
										<span>mexico@cognident.org</span>
									</div>
									<div className="flex items-center gap-2">
										<span>📞</span>
										<span>+52 55 1234-5678</span>
									</div>
									<div className="flex items-center gap-2">
										<span>💬</span>
										<span>WhatsApp: +52 55 8765-4321</span>
									</div>
									<div className="flex items-center gap-2">
										<span>🕐</span>
										<span>Horario: 24/7 (Zona Horaria México)</span>
									</div>
								</div>
							</div>
							<div>
								<h4 className="mb-3 font-semibold text-blue-600">
									Recursos Especializados
								</h4>
								<div className="space-y-2 text-sm">
									<div>
										•{" "}
										<a
											href="/es/help/importacion-masiva"
											className="text-blue-600 hover:underline"
										>
											Guía de Importación Masiva
										</a>
									</div>
									<div>
										•{" "}
										<a
											href="/es/help/formatos-mexico"
											className="text-blue-600 hover:underline"
										>
											Formatos para Clínicas Mexicanas
										</a>
									</div>
									<div>
										•{" "}
										<a
											href="/es/help/seguridad-datos"
											className="text-blue-600 hover:underline"
										>
											Seguridad y Privacidad
										</a>
									</div>
									<div>
										•{" "}
										<a
											href="/es/help/multi-clinica"
											className="text-blue-600 hover:underline"
										>
											Gestión Multi-Clínica
										</a>
									</div>
									<div>
										•{" "}
										<a
											href="/es/help/cumplimiento-nom"
											className="text-blue-600 hover:underline"
										>
											Cumplimiento NOM-004-SSA3
										</a>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
