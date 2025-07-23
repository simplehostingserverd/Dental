/**
 * Spanish Translations for Cognident
 * Complete translation system for Mexico dental clinics
 */

export const spanishTranslations = {
	// Common UI Elements
	common: {
		loading: "Cargando...",
		save: "Guardar",
		cancel: "Cancelar",
		delete: "Eliminar",
		edit: "Editar",
		view: "Ver",
		search: "Buscar",
		filter: "Filtrar",
		add: "Agregar",
		remove: "Quitar",
		confirm: "Confirmar",
		back: "Regresar",
		next: "Siguiente",
		previous: "Anterior",
		close: "Cerrar",
		open: "Abrir",
		yes: "Sí",
		no: "No",
		ok: "Aceptar",
		error: "Error",
		success: "Éxito",
		warning: "Advertencia",
		info: "Información",
	},

	// Navigation
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		billing: "Facturación",
		communications: "Comunicaciones",
		reports: "Reportes",
		settings: "Configuración",
		help: "Ayuda",
		logout: "Cerrar Sesión",
		profile: "Perfil",
	},

	// Authentication
	auth: {
		signIn: "Iniciar Sesión",
		signUp: "Registrarse",
		signOut: "Cerrar Sesión",
		email: "Correo Electrónico",
		password: "Contraseña",
		confirmPassword: "Confirmar Contraseña",
		forgotPassword: "¿Olvidaste tu contraseña?",
		rememberMe: "Recordarme",
		createAccount: "Crear Cuenta",
		alreadyHaveAccount: "¿Ya tienes una cuenta?",
		dontHaveAccount: "¿No tienes una cuenta?",
		invalidCredentials: "Credenciales inválidas",
		passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
		emailRequired: "El correo electrónico es requerido",
		passwordRequired: "La contraseña es requerida",
	},

	// Dashboard
	dashboard: {
		welcome: "Bienvenido",
		overview: "Resumen",
		todayStats: "Estadísticas de Hoy",
		quickActions: "Acciones Rápidas",
		recentActivity: "Actividad Reciente",
		upcomingAppointments: "Próximas Citas",
		todayAppointments: "Citas de Hoy",
		totalPatients: "Total de Pacientes",
		revenue: "Ingresos",
		pendingTasks: "Tareas Pendientes",
	},

	// Appointments
	appointments: {
		title: "Gestión de Citas",
		newAppointment: "Nueva Cita",
		editAppointment: "Editar Cita",
		deleteAppointment: "Eliminar Cita",
		rescheduleAppointment: "Reprogramar Cita",
		appointmentDetails: "Detalles de la Cita",
		patient: "Paciente",
		doctor: "Doctor",
		date: "Fecha",
		time: "Hora",
		duration: "Duración",
		type: "Tipo",
		status: "Estado",
		notes: "Notas",
		reason: "Motivo",

		// Appointment Types
		types: {
			consultation: "Consulta General",
			cleaning: "Limpieza Dental",
			filling: "Empaste",
			extraction: "Extracción",
			rootCanal: "Endodoncia",
			orthodontics: "Ortodoncia",
			surgery: "Cirugía Oral",
			emergency: "Emergencia",
			checkup: "Revisión",
			whitening: "Blanqueamiento",
			implant: "Implante",
			crown: "Corona",
		},

		// Appointment Status
		appointmentStatus: {
			scheduled: "Programada",
			confirmed: "Confirmada",
			inProgress: "En Progreso",
			completed: "Completada",
			cancelled: "Cancelada",
			noShow: "No Asistió",
			rescheduled: "Reprogramada",
		},
	},

	// Patients
	patients: {
		title: "Gestión de Pacientes",
		newPatient: "Nuevo Paciente",
		editPatient: "Editar Paciente",
		patientProfile: "Perfil del Paciente",
		personalInfo: "Información Personal",
		contactInfo: "Información de Contacto",
		medicalHistory: "Historial Médico",
		dentalHistory: "Historial Dental",
		insuranceInfo: "Información del Seguro",
		emergencyContact: "Contacto de Emergencia",

		// Personal Information
		firstName: "Nombre",
		lastName: "Apellido",
		fullName: "Nombre Completo",
		dateOfBirth: "Fecha de Nacimiento",
		age: "Edad",
		gender: "Género",
		address: "Dirección",
		city: "Ciudad",
		state: "Estado",
		zipCode: "Código Postal",
		country: "País",

		// Contact Information
		phone: "Teléfono",
		mobile: "Celular",
		email: "Correo Electrónico",
		whatsapp: "WhatsApp",
		telegram: "Telegram",
		signal: "Signal",
		preferredContact: "Método de Contacto Preferido",

		// Medical Information
		allergies: "Alergias",
		medications: "Medicamentos",
		medicalConditions: "Condiciones Médicas",
		bloodType: "Tipo de Sangre",
		emergencyContactName: "Nombre del Contacto de Emergencia",
		emergencyContactPhone: "Teléfono del Contacto de Emergencia",
		relationship: "Parentesco",

		// Insurance
		insuranceProvider: "Proveedor de Seguro",
		policyNumber: "Número de Póliza",
		groupNumber: "Número de Grupo",

		// Patient Status
		patientStatus: {
			active: "Activo",
			inactive: "Inactivo",
			new: "Nuevo",
			pending: "Pendiente",
		},
	},

	// Communications
	communications: {
		title: "Centro de Comunicaciones",
		newMessage: "Nuevo Mensaje",
		sendMessage: "Enviar Mensaje",
		messageHistory: "Historial de Mensajes",
		templates: "Plantillas",
		reminders: "Recordatorios",
		notifications: "Notificaciones",

		// Message Types
		types: {
			appointment: "Recordatorio de Cita",
			followUp: "Seguimiento",
			promotion: "Promoción",
			general: "General",
			emergency: "Emergencia",
		},

		// Platforms
		platforms: {
			whatsapp: "WhatsApp",
			telegram: "Telegram",
			signal: "Signal",
			sms: "SMS",
			email: "Correo Electrónico",
			phone: "Teléfono",
		},

		// Message Templates
		messageTemplates: {
			appointmentReminder: "Recordatorio de Cita",
			appointmentConfirmation: "Confirmación de Cita",
			followUpCare: "Cuidados Post-Tratamiento",
			paymentReminder: "Recordatorio de Pago",
			birthdayWish: "Felicitación de Cumpleaños",
			promotionalOffer: "Oferta Promocional",
		},
	},

	// Billing
	billing: {
		title: "Gestión de Facturación",
		newInvoice: "Nueva Factura",
		paymentHistory: "Historial de Pagos",
		pendingPayments: "Pagos Pendientes",
		invoice: "Factura",
		receipt: "Recibo",
		payment: "Pago",
		amount: "Monto",
		total: "Total",
		subtotal: "Subtotal",
		tax: "Impuesto",
		discount: "Descuento",
		dueDate: "Fecha de Vencimiento",
		paymentMethod: "Método de Pago",

		// Payment Methods
		paymentMethods: {
			cash: "Efectivo",
			card: "Tarjeta",
			transfer: "Transferencia",
			check: "Cheque",
			insurance: "Seguro",
		},

		// Payment Status
		paymentStatus: {
			paid: "Pagado",
			pending: "Pendiente",
			overdue: "Vencido",
			partial: "Parcial",
			cancelled: "Cancelado",
		},
	},

	// Reports
	reports: {
		title: "Reportes y Análisis",
		generateReport: "Generar Reporte",
		dailyReport: "Reporte Diario",
		weeklyReport: "Reporte Semanal",
		monthlyReport: "Reporte Mensual",
		yearlyReport: "Reporte Anual",
		customReport: "Reporte Personalizado",

		// Report Types
		types: {
			appointments: "Reporte de Citas",
			revenue: "Reporte de Ingresos",
			patients: "Reporte de Pacientes",
			treatments: "Reporte de Tratamientos",
			performance: "Reporte de Rendimiento",
		},
	},

	// Settings
	settings: {
		title: "Configuración",
		general: "General",
		account: "Cuenta",
		notifications: "Notificaciones",
		privacy: "Privacidad",
		security: "Seguridad",
		integrations: "Integraciones",
		backup: "Respaldo",

		// Notification Settings
		emailNotifications: "Notificaciones por Email",
		smsNotifications: "Notificaciones por SMS",
		pushNotifications: "Notificaciones Push",
		appointmentReminders: "Recordatorios de Citas",
		paymentReminders: "Recordatorios de Pago",
	},

	// Forms
	forms: {
		required: "Requerido",
		optional: "Opcional",
		pleaseSelect: "Por favor selecciona",
		selectOption: "Selecciona una opción",
		enterValue: "Ingresa un valor",
		invalidFormat: "Formato inválido",
		fieldRequired: "Este campo es requerido",
		emailInvalid: "Correo electrónico inválido",
		phoneInvalid: "Número de teléfono inválido",
		dateInvalid: "Fecha inválida",
	},

	// Messages
	messages: {
		success: {
			saved: "Guardado exitosamente",
			deleted: "Eliminado exitosamente",
			updated: "Actualizado exitosamente",
			created: "Creado exitosamente",
			sent: "Enviado exitosamente",
		},
		error: {
			general: "Ocurrió un error",
			notFound: "No encontrado",
			unauthorized: "No autorizado",
			forbidden: "Prohibido",
			serverError: "Error del servidor",
			networkError: "Error de conexión",
		},
		confirmation: {
			delete: "¿Estás seguro de que quieres eliminar esto?",
			cancel: "¿Estás seguro de que quieres cancelar?",
			save: "¿Quieres guardar los cambios?",
			logout: "¿Estás seguro de que quieres cerrar sesión?",
		},
	},

	// Time and Date
	time: {
		today: "Hoy",
		yesterday: "Ayer",
		tomorrow: "Mañana",
		thisWeek: "Esta Semana",
		thisMonth: "Este Mes",
		thisYear: "Este Año",

		// Days of the week
		days: {
			monday: "Lunes",
			tuesday: "Martes",
			wednesday: "Miércoles",
			thursday: "Jueves",
			friday: "Viernes",
			saturday: "Sábado",
			sunday: "Domingo",
		},

		// Months
		months: {
			january: "Enero",
			february: "Febrero",
			march: "Marzo",
			april: "Abril",
			may: "Mayo",
			june: "Junio",
			july: "Julio",
			august: "Agosto",
			september: "Septiembre",
			october: "Octubre",
			november: "Noviembre",
			december: "Diciembre",
		},
	},
};

export default spanishTranslations;

// Translation helper function
export function getTranslation(
	key: string,
	translations = spanishTranslations,
): string {
	const keys = key.split(".");
	let current: any = translations;

	for (const k of keys) {
		if (current && typeof current === "object" && k in current) {
			current = current[k];
		} else {
			return key; // Return the key if translation not found
		}
	}

	return typeof current === "string" ? current : key;
}

// React hook for translations
import { useCallback } from "react";

export function useSpanishTranslations() {
	const t = useCallback((key: string) => {
		return getTranslation(key, spanishTranslations);
	}, []);

	return { t, translations: spanishTranslations };
}
