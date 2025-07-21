/**
 * Sample Data for Dashboard Testing
 * Comprehensive test data for all three dashboards
 */

export interface Appointment {
	id: string;
	patientId: string;
	patientName: string;
	dentistId: string;
	dentistName: string;
	date: string;
	time: string;
	duration: number; // minutes
	type: string;
	status:
		| "scheduled"
		| "confirmed"
		| "in-progress"
		| "completed"
		| "cancelled"
		| "no-show";
	notes?: string;
	treatmentPlan?: string[];
	estimatedCost?: number;
}

export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
	};
	insurance: {
		provider: string;
		policyNumber: string;
		groupNumber: string;
	};
	emergencyContact: {
		name: string;
		relationship: string;
		phone: string;
	};
	medicalHistory: {
		allergies: string[];
		medications: string[];
		conditions: string[];
	};
	lastVisit?: string;
	nextAppointment?: string;
	totalVisits: number;
	outstandingBalance: number;
}

export interface Treatment {
	id: string;
	patientId: string;
	dentistId: string;
	date: string;
	procedure: string;
	tooth?: string;
	cost: number;
	status: "planned" | "in-progress" | "completed";
	notes?: string;
	followUpRequired?: boolean;
	followUpDate?: string;
}

export interface Invoice {
	id: string;
	patientId: string;
	date: string;
	dueDate: string;
	amount: number;
	paid: number;
	status: "pending" | "paid" | "overdue" | "partial";
	treatments: string[];
	insuranceClaim?: {
		submitted: boolean;
		amount: number;
		status: "pending" | "approved" | "denied";
	};
}

// Sample Appointments
export const sampleAppointments: Appointment[] = [
	{
		id: "apt-001",
		patientId: "patient-001",
		patientName: "John Doe",
		dentistId: "dentist-001",
		dentistName: "Dr. Sarah Smith",
		date: "2024-01-22",
		time: "09:00",
		duration: 60,
		type: "Routine Cleaning",
		status: "scheduled",
		notes: "Regular 6-month checkup",
		estimatedCost: 150,
	},
	{
		id: "apt-002",
		patientId: "patient-002",
		patientName: "Alice Johnson",
		dentistId: "dentist-002",
		dentistName: "Dr. Michael Johnson",
		date: "2024-01-22",
		time: "10:30",
		duration: 90,
		type: "Orthodontic Consultation",
		status: "confirmed",
		notes: "Initial consultation for braces",
		estimatedCost: 200,
	},
	{
		id: "apt-003",
		patientId: "patient-003",
		patientName: "Robert Smith",
		dentistId: "dentist-001",
		dentistName: "Dr. Sarah Smith",
		date: "2024-01-22",
		time: "14:00",
		duration: 120,
		type: "Root Canal",
		status: "scheduled",
		notes: "Tooth #14 - severe decay",
		treatmentPlan: [
			"Local anesthesia",
			"Root canal therapy",
			"Temporary filling",
		],
		estimatedCost: 800,
	},
	{
		id: "apt-004",
		patientId: "patient-001",
		patientName: "John Doe",
		dentistId: "dentist-001",
		dentistName: "Dr. Sarah Smith",
		date: "2024-01-23",
		time: "11:00",
		duration: 45,
		type: "Follow-up",
		status: "scheduled",
		notes: "Post-cleaning follow-up",
		estimatedCost: 75,
	},
	{
		id: "apt-005",
		patientId: "patient-002",
		patientName: "Alice Johnson",
		dentistId: "dentist-002",
		dentistName: "Dr. Michael Johnson",
		date: "2024-01-24",
		time: "15:30",
		duration: 60,
		type: "Braces Fitting",
		status: "scheduled",
		notes: "Initial braces installation",
		estimatedCost: 1200,
	},
];

// Sample Patients
export const samplePatients: Patient[] = [
	{
		id: "patient-001",
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@email.com",
		phone: "(555) 301-4001",
		dateOfBirth: "1985-06-15",
		address: {
			street: "123 Main St",
			city: "Anytown",
			state: "CA",
			zipCode: "90210",
		},
		insurance: {
			provider: "Delta Dental",
			policyNumber: "DD-123456789",
			groupNumber: "GRP-001",
		},
		emergencyContact: {
			name: "Jane Doe",
			relationship: "Spouse",
			phone: "(555) 301-4002",
		},
		medicalHistory: {
			allergies: ["Penicillin"],
			medications: ["Lisinopril 10mg"],
			conditions: ["Hypertension"],
		},
		lastVisit: "2023-07-15",
		nextAppointment: "2024-01-22",
		totalVisits: 12,
		outstandingBalance: 225.0,
	},
	{
		id: "patient-002",
		firstName: "Alice",
		lastName: "Johnson",
		email: "alice.johnson@email.com",
		phone: "(555) 301-4003",
		dateOfBirth: "1992-03-22",
		address: {
			street: "456 Oak Ave",
			city: "Somewhere",
			state: "CA",
			zipCode: "90211",
		},
		insurance: {
			provider: "MetLife Dental",
			policyNumber: "ML-987654321",
			groupNumber: "GRP-002",
		},
		emergencyContact: {
			name: "Bob Johnson",
			relationship: "Father",
			phone: "(555) 301-4004",
		},
		medicalHistory: {
			allergies: [],
			medications: [],
			conditions: [],
		},
		lastVisit: "2023-12-10",
		nextAppointment: "2024-01-22",
		totalVisits: 8,
		outstandingBalance: 0.0,
	},
	{
		id: "patient-003",
		firstName: "Robert",
		lastName: "Smith",
		email: "robert.smith@email.com",
		phone: "(555) 301-4005",
		dateOfBirth: "1978-11-08",
		address: {
			street: "789 Pine Rd",
			city: "Elsewhere",
			state: "CA",
			zipCode: "90212",
		},
		insurance: {
			provider: "Cigna Dental",
			policyNumber: "CG-456789123",
			groupNumber: "GRP-003",
		},
		emergencyContact: {
			name: "Susan Smith",
			relationship: "Wife",
			phone: "(555) 301-4006",
		},
		medicalHistory: {
			allergies: ["Latex"],
			medications: ["Metformin 500mg"],
			conditions: ["Type 2 Diabetes"],
		},
		lastVisit: "2023-11-20",
		nextAppointment: "2024-01-22",
		totalVisits: 15,
		outstandingBalance: 450.0,
	},
];

// Sample Treatments
export const sampleTreatments: Treatment[] = [
	{
		id: "treat-001",
		patientId: "patient-001",
		dentistId: "dentist-001",
		date: "2023-07-15",
		procedure: "Dental Cleaning",
		cost: 150,
		status: "completed",
		notes: "Routine cleaning, good oral health",
	},
	{
		id: "treat-002",
		patientId: "patient-002",
		dentistId: "dentist-002",
		date: "2023-12-10",
		procedure: "Orthodontic Evaluation",
		cost: 200,
		status: "completed",
		notes: "Recommended braces treatment",
		followUpRequired: true,
		followUpDate: "2024-01-22",
	},
	{
		id: "treat-003",
		patientId: "patient-003",
		dentistId: "dentist-001",
		date: "2024-01-22",
		procedure: "Root Canal Therapy",
		tooth: "#14",
		cost: 800,
		status: "planned",
		notes: "Severe decay requiring root canal",
		followUpRequired: true,
		followUpDate: "2024-02-05",
	},
];

// Sample Invoices
export const sampleInvoices: Invoice[] = [
	{
		id: "inv-001",
		patientId: "patient-001",
		date: "2023-07-15",
		dueDate: "2023-08-15",
		amount: 150,
		paid: 150,
		status: "paid",
		treatments: ["treat-001"],
	},
	{
		id: "inv-002",
		patientId: "patient-002",
		date: "2023-12-10",
		dueDate: "2024-01-10",
		amount: 200,
		paid: 200,
		status: "paid",
		treatments: ["treat-002"],
		insuranceClaim: {
			submitted: true,
			amount: 160,
			status: "approved",
		},
	},
	{
		id: "inv-003",
		patientId: "patient-003",
		date: "2024-01-22",
		dueDate: "2024-02-22",
		amount: 800,
		paid: 350,
		status: "partial",
		treatments: ["treat-003"],
		insuranceClaim: {
			submitted: true,
			amount: 640,
			status: "pending",
		},
	},
];

// Dashboard Statistics
export const dashboardStats = {
	dentist: {
		todayAppointments: 5,
		weeklyAppointments: 28,
		monthlyRevenue: 15750,
		activePatients: 156,
		completedTreatments: 89,
		pendingTreatments: 12,
	},
	receptionist: {
		todayAppointments: 12,
		pendingConfirmations: 3,
		newPatients: 8,
		insuranceClaims: 15,
		outstandingPayments: 2850,
		schedulingConflicts: 1,
	},
	patient: {
		upcomingAppointments: 2,
		lastVisit: "2023-07-15",
		outstandingBalance: 225,
		insuranceRemaining: 1200,
		treatmentProgress: 75,
		nextCleaningDue: "2024-07-15",
	},
};
