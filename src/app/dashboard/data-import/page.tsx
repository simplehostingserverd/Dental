import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import DataImportWizard from "@/components/data-import/DataImportWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Users, Shield, FileText } from "lucide-react";

export default async function DataImportPage() {
	const user = await getCurrentUser();

	if (!user || user.type !== "practice") {
		redirect("/auth/signin");
	}

	// Check if user has permission to import data
	if (user.role !== "ADMIN" && user.role !== "DENTIST") {
		redirect("/dashboard");
	}

	// Get user's practice
	const practiceUser = await db.practiceUser.findUnique({
		where: { id: user.id },
		include: {
			practice: true,
		},
	});

	if (!practiceUser?.practice) {
		redirect("/dashboard");
	}

	// Get current patient count
	const patientCount = await db.patient.count({
		where: { practiceId: practiceUser.practice.id },
	});

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Importación de Datos</h1>
					<p className="text-muted-foreground">
						Importe datos de pacientes existentes a su práctica dental
					</p>
				</div>
			</div>

			{/* Practice Info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Database className="h-5 w-5" />
						Información de la Práctica
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Users className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<div className="font-semibold">{practiceUser.practice.name}</div>
								<div className="text-sm text-gray-600">Práctica Dental</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Users className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<div className="font-semibold">{patientCount}</div>
								<div className="text-sm text-gray-600">Pacientes Actuales</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Shield className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<div className="font-semibold">ID: {practiceUser.practice.id}</div>
								<div className="text-sm text-gray-600">Identificador Único</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Security Notice */}
			<Alert>
				<Shield className="h-4 w-4" />
				<AlertDescription>
					<strong>Seguridad de Datos:</strong> Todos los datos importados están protegidos por cifrado y 
					aislamiento de práctica. Los datos de su clínica están completamente separados de otras prácticas 
					y cumplen con las regulaciones de privacidad médica.
				</AlertDescription>
			</Alert>

			{/* Import Guidelines */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Guías de Importación
					</CardTitle>
					<CardDescription>
						Siga estas recomendaciones para una importación exitosa
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600">✓ Mejores Prácticas</h4>
							<ul className="space-y-2 text-sm">
								<li>• Descargue y use la plantilla proporcionada</li>
								<li>• Verifique que las fechas estén en formato YYYY-MM-DD</li>
								<li>• Asegúrese de que los emails sean válidos</li>
								<li>• Use números de teléfono con formato internacional</li>
								<li>• Revise los datos antes de importar</li>
								<li>• Haga una copia de seguridad de sus datos actuales</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-red-600">⚠ Evite Estos Errores</h4>
							<ul className="space-y-2 text-sm">
								<li>• No incluya pacientes duplicados</li>
								<li>• No use caracteres especiales en nombres</li>
								<li>• No deje campos obligatorios vacíos</li>
								<li>• No use formatos de fecha inconsistentes</li>
								<li>• No incluya información médica sensible en texto plano</li>
								<li>• No importe archivos de más de 50MB</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Import Wizard */}
			<DataImportWizard 
				practiceId={practiceUser.practice.id}
				onImportComplete={(result) => {
					// Handle import completion
					console.log("Import completed:", result);
				}}
			/>

			{/* Support Information */}
			<Card>
				<CardHeader>
					<CardTitle>¿Necesita Ayuda?</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h4 className="font-semibold mb-2">Soporte Técnico</h4>
							<p className="text-sm text-gray-600 mb-2">
								Si tiene problemas con la importación de datos, nuestro equipo está aquí para ayudar.
							</p>
							<div className="space-y-1 text-sm">
								<div>📧 Email: soporte@cognident.org</div>
								<div>📞 Teléfono: +52 55 1234-5678</div>
								<div>💬 Chat en vivo: Disponible 24/7</div>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Recursos Adicionales</h4>
							<div className="space-y-2 text-sm">
								<div>• <a href="/help/data-import" className="text-blue-600 hover:underline">Guía de Importación Detallada</a></div>
								<div>• <a href="/help/data-format" className="text-blue-600 hover:underline">Formatos de Datos Soportados</a></div>
								<div>• <a href="/help/troubleshooting" className="text-blue-600 hover:underline">Solución de Problemas</a></div>
								<div>• <a href="/help/security" className="text-blue-600 hover:underline">Seguridad y Privacidad</a></div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
