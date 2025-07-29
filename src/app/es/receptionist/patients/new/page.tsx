"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	ArrowLeft,
	Calendar,
	Heart,
	Phone,
	Save,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Spanish translations
const translations = {
	title: "Nuevo Paciente",
	subtitle: "Registro de información del paciente",
	backToPatients: "Volver a Pacientes",
	save: "Guardar Paciente",
	cancel: "Cancelar",
	personalInfo: "Información Personal",
	contactInfo: "Información de Contacto",
	addressInfo: "Dirección",
	emergencyContact: "Contacto de Emergencia",
	insurance: "Seguro Médico",
	medicalHistory: "Historial Médico",
	required: "Requerido",
	optional: "Opcional",
	fields: {
		firstName: "Nombre(s)",
		lastName: "Apellidos",
		email: "Correo Electrónico",
		phone: "Teléfono",
		whatsapp: "WhatsApp",
		dateOfBirth: "Fecha de Nacimiento",
		gender: "Género",
		curp: "CURP",
		rfc: "RFC",
		street: "Calle y Número",
		city: "Ciudad",
		state: "Estado",
		zipCode: "Código Postal",
		country: "País",
		emergencyName: "Nombre del Contacto",
		emergencyPhone: "Teléfono de Emergencia",
		emergencyRelationship: "Parentesco",
		insuranceProvider: "Proveedor de Seguro",
		policyNumber: "Número de Póliza",
		groupNumber: "Número de Grupo",
		allergies: "Alergias",
		medications: "Medicamentos Actuales",
		conditions: "Condiciones Médicas",
		notes: "Notas Adicionales",
	},
	genderOptions: {
		male: "Masculino",
		female: "Femenino",
		other: "Otro",
	},
	insuranceProviders: {
		imss: "IMSS",
		issste: "ISSSTE",
		private: "Seguro Privado",
		none: "Sin Seguro",
	},
	mexicanStates: [
		"Aguascalientes",
		"Baja California",
		"Baja California Sur",
		"Campeche",
		"Chiapas",
		"Chihuahua",
		"Ciudad de México",
		"Coahuila",
		"Colima",
		"Durango",
		"Estado de México",
		"Guanajuato",
		"Guerrero",
		"Hidalgo",
		"Jalisco",
		"Michoacán",
		"Morelos",
		"Nayarit",
		"Nuevo León",
		"Oaxaca",
		"Puebla",
		"Querétaro",
		"Quintana Roo",
		"San Luis Potosí",
		"Sinaloa",
		"Sonora",
		"Tabasco",
		"Tamaulipas",
		"Tlaxcala",
		"Veracruz",
		"Yucatán",
		"Zacatecas",
	],
	success: "Paciente creado exitosamente",
	error: "Error al crear el paciente",
};

interface PatientFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	whatsapp: string;
	dateOfBirth: string;
	gender: string;
	curp: string;
	rfc: string;
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
	};
	emergencyContact: {
		name: string;
		phone: string;
		relationship: string;
	};
	insurance: {
		provider: string;
		policyNumber: string;
		groupNumber: string;
	};
	medicalHistory: {
		allergies: string;
		medications: string;
		conditions: string;
		notes: string;
	};
}

export default function NewPatientPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<PatientFormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		whatsapp: "",
		dateOfBirth: "",
		gender: "",
		curp: "",
		rfc: "",
		address: {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "México",
		},
		emergencyContact: {
			name: "",
			phone: "",
			relationship: "",
		},
		insurance: {
			provider: "",
			policyNumber: "",
			groupNumber: "",
		},
		medicalHistory: {
			allergies: "",
			medications: "",
			conditions: "",
			notes: "",
		},
	});

	const handleInputChange = (field: string, value: string) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".");
			if (parent && child) {
				setFormData((prev) => ({
					...prev,
					[parent]: {
						...(prev[parent as keyof PatientFormData] as Record<string, unknown>),
						[child]: value,
					},
				}));
			}
		} else {
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/dashboard/patients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert(translations.success);
				router.push("/es/receptionist/patients");
			} else {
				const errorData = await response.json();
				alert(`${translations.error}: ${errorData.error}`);
			}
		} catch (error) {
			console.error("Error creating patient:", error);
			alert(translations.error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			{/* Header */}
			<nav className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<HeaderLogo />
							<div className="ml-4">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/es/receptionist"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Dashboard
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Citas
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white"
									>
										Pacientes
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge className="border-0 bg-gradient-to-r from-green-600 via-white to-red-600 px-3 py-1 text-gray-900">
								🇲🇽 México
							</Badge>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold text-3xl text-white">
								{translations.title}
							</h1>
							<p className="mt-2 text-gray-400">{translations.subtitle}</p>
						</div>
						<Link href="/es/receptionist/patients">
							<Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
								<ArrowLeft className="mr-2 h-4 w-4" />
								{translations.backToPatients}
							</Button>
						</Link>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Personal Information */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<User className="mr-2 h-5 w-5" />
								{translations.personalInfo}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="firstName" className="text-gray-300">
										{translations.fields.firstName} *
									</Label>
									<Input
										id="firstName"
										value={formData.firstName}
										onChange={(e) => handleInputChange("firstName", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										required
									/>
								</div>
								<div>
									<Label htmlFor="lastName" className="text-gray-300">
										{translations.fields.lastName} *
									</Label>
									<Input
										id="lastName"
										value={formData.lastName}
										onChange={(e) => handleInputChange("lastName", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										required
									/>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div>
									<Label htmlFor="dateOfBirth" className="text-gray-300">
										{translations.fields.dateOfBirth} *
									</Label>
									<Input
										id="dateOfBirth"
										type="date"
										value={formData.dateOfBirth}
										onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										required
									/>
								</div>
								<div>
									<Label htmlFor="gender" className="text-gray-300">
										{translations.fields.gender}
									</Label>
									<Select
										value={formData.gender}
										onValueChange={(value) => handleInputChange("gender", value)}
									>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar..." />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">{translations.genderOptions.male}</SelectItem>
											<SelectItem value="female">{translations.genderOptions.female}</SelectItem>
											<SelectItem value="other">{translations.genderOptions.other}</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="curp" className="text-gray-300">
										{translations.fields.curp}
									</Label>
									<Input
										id="curp"
										value={formData.curp}
										onChange={(e) => handleInputChange("curp", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										placeholder="AAAA######HHHHHH##"
									/>
								</div>
								<div>
									<Label htmlFor="rfc" className="text-gray-300">
										{translations.fields.rfc}
									</Label>
									<Input
										id="rfc"
										value={formData.rfc}
										onChange={(e) => handleInputChange("rfc", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										placeholder="AAAA######AAA"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<Phone className="mr-2 h-5 w-5" />
								{translations.contactInfo}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="email" className="text-gray-300">
										{translations.fields.email} *
									</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										required
									/>
								</div>
								<div>
									<Label htmlFor="phone" className="text-gray-300">
										{translations.fields.phone} *
									</Label>
									<Input
										id="phone"
										value={formData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										placeholder="+52 55 1234 5678"
										required
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="whatsapp" className="text-gray-300">
									{translations.fields.whatsapp}
								</Label>
								<Input
									id="whatsapp"
									value={formData.whatsapp}
									onChange={(e) => handleInputChange("whatsapp", e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
									placeholder="+52 55 1234 5678"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Address Information */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<Calendar className="mr-2 h-5 w-5" />
								{translations.addressInfo}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="street" className="text-gray-300">
									{translations.fields.street}
								</Label>
								<Input
									id="street"
									value={formData.address.street}
									onChange={(e) => handleInputChange("address.street", e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
								/>
							</div>
							<div className="grid gap-4 md:grid-cols-3">
								<div>
									<Label htmlFor="city" className="text-gray-300">
										{translations.fields.city}
									</Label>
									<Input
										id="city"
										value={formData.address.city}
										onChange={(e) => handleInputChange("address.city", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
									/>
								</div>
								<div>
									<Label htmlFor="state" className="text-gray-300">
										{translations.fields.state}
									</Label>
									<Select
										value={formData.address.state}
										onValueChange={(value) => handleInputChange("address.state", value)}
									>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar estado..." />
										</SelectTrigger>
										<SelectContent>
											{translations.mexicanStates.map((state) => (
												<SelectItem key={state} value={state}>
													{state}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="zipCode" className="text-gray-300">
										{translations.fields.zipCode}
									</Label>
									<Input
										id="zipCode"
										value={formData.address.zipCode}
										onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										placeholder="12345"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Emergency Contact */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<Users className="mr-2 h-5 w-5" />
								{translations.emergencyContact}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="emergencyName" className="text-gray-300">
										{translations.fields.emergencyName}
									</Label>
									<Input
										id="emergencyName"
										value={formData.emergencyContact.name}
										onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
									/>
								</div>
								<div>
									<Label htmlFor="emergencyPhone" className="text-gray-300">
										{translations.fields.emergencyPhone}
									</Label>
									<Input
										id="emergencyPhone"
										value={formData.emergencyContact.phone}
										onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										placeholder="+52 55 1234 5678"
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="emergencyRelationship" className="text-gray-300">
									{translations.fields.emergencyRelationship}
								</Label>
								<Input
									id="emergencyRelationship"
									value={formData.emergencyContact.relationship}
									onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
									placeholder="Padre, Madre, Esposo/a, Hermano/a, etc."
								/>
							</div>
						</CardContent>
					</Card>

					{/* Insurance */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<Heart className="mr-2 h-5 w-5" />
								{translations.insurance}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="insuranceProvider" className="text-gray-300">
									{translations.fields.insuranceProvider}
								</Label>
								<Select
									value={formData.insurance.provider}
									onValueChange={(value) => handleInputChange("insurance.provider", value)}
								>
									<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
										<SelectValue placeholder="Seleccionar proveedor..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="imss">{translations.insuranceProviders.imss}</SelectItem>
										<SelectItem value="issste">{translations.insuranceProviders.issste}</SelectItem>
										<SelectItem value="private">{translations.insuranceProviders.private}</SelectItem>
										<SelectItem value="none">{translations.insuranceProviders.none}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="policyNumber" className="text-gray-300">
										{translations.fields.policyNumber}
									</Label>
									<Input
										id="policyNumber"
										value={formData.insurance.policyNumber}
										onChange={(e) => handleInputChange("insurance.policyNumber", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
									/>
								</div>
								<div>
									<Label htmlFor="groupNumber" className="text-gray-300">
										{translations.fields.groupNumber}
									</Label>
									<Input
										id="groupNumber"
										value={formData.insurance.groupNumber}
										onChange={(e) => handleInputChange("insurance.groupNumber", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Medical History */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="flex items-center text-white">
								<Heart className="mr-2 h-5 w-5" />
								{translations.medicalHistory}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="allergies" className="text-gray-300">
										{translations.fields.allergies}
									</Label>
									<Textarea
										id="allergies"
										value={formData.medicalHistory.allergies}
										onChange={(e) => handleInputChange("medicalHistory.allergies", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										rows={3}
									/>
								</div>
								<div>
									<Label htmlFor="medications" className="text-gray-300">
										{translations.fields.medications}
									</Label>
									<Textarea
										id="medications"
										value={formData.medicalHistory.medications}
										onChange={(e) => handleInputChange("medicalHistory.medications", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										rows={3}
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="conditions" className="text-gray-300">
									{translations.fields.conditions}
								</Label>
								<Textarea
									id="conditions"
									value={formData.medicalHistory.conditions}
									onChange={(e) => handleInputChange("medicalHistory.conditions", e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
									rows={3}
								/>
							</div>
							<div>
								<Label htmlFor="notes" className="text-gray-300">
									{translations.fields.notes}
								</Label>
								<Textarea
									id="notes"
									value={formData.medicalHistory.notes}
									onChange={(e) => handleInputChange("medicalHistory.notes", e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Form Actions */}
					<div className="flex justify-end space-x-4">
						<Link href="/es/receptionist/patients">
							<Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
								{translations.cancel}
							</Button>
						</Link>
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{isLoading ? (
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							{translations.save}
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
}