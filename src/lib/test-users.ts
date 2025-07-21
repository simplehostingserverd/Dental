/**
 * Test Users (Client-safe version)
 * For testing login flows and dashboard redirects
 */

export interface TestUser {
	id: string;
	email: string;
	password: string; // Plain text for testing only
	hashedPassword: string;
	salt: string;
	role: "dentist" | "receptionist" | "patient";
	profile: any;
	cryptoKeys?: {
		mlkem: { publicKey: string; privateKey: string };
		mldsa: { publicKey: string; privateKey: string };
		slhdsa: { publicKey: string; privateKey: string };
		hqc: { publicKey: string; privateKey: string };
	};
	createdAt: string;
	lastLogin?: string;
}

// Client-safe test users (without crypto operations)
export const testUsersClient = [
	{
		id: "dentist-001",
		email: "dr.smith@cognident.org",
		role: "dentist",
		profile: {
			firstName: "Dr. Sarah",
			lastName: "Smith",
			title: "DDS, Oral Surgeon",
			licenseNumber: "DDS-12345",
			specialization: "Oral Surgery",
			phone: "(555) 101-2001",
			yearsExperience: 15,
			education: "Harvard School of Dental Medicine",
			certifications: ["Oral Surgery", "Implantology", "Sedation Dentistry"],
		},
	},
	{
		id: "dentist-002",
		email: "dr.johnson@cognident.org",
		role: "dentist",
		profile: {
			firstName: "Dr. Michael",
			lastName: "Johnson",
			title: "DDS, Orthodontist",
			licenseNumber: "DDS-67890",
			specialization: "Orthodontics",
			phone: "(555) 101-2002",
			yearsExperience: 12,
			education: "UCLA School of Dentistry",
			certifications: ["Orthodontics", "Invisalign", "TMJ Treatment"],
		},
	},
	{
		id: "receptionist-001",
		email: "mary.wilson@cognident.org",
		role: "receptionist",
		profile: {
			firstName: "Mary",
			lastName: "Wilson",
			title: "Lead Receptionist",
			phone: "(555) 201-3001",
			employeeId: "REC-001",
			department: "Front Office",
			startDate: "2022-03-15",
			permissions: ["scheduling", "billing", "patient_records", "insurance"],
		},
	},
	{
		id: "receptionist-002",
		email: "jennifer.brown@cognident.org",
		role: "receptionist",
		profile: {
			firstName: "Jennifer",
			lastName: "Brown",
			title: "Receptionist",
			phone: "(555) 201-3002",
			employeeId: "REC-002",
			department: "Front Office",
			startDate: "2023-01-10",
			permissions: ["scheduling", "patient_records"],
		},
	},
	{
		id: "patient-001",
		email: "john.doe@email.com",
		role: "patient",
		profile: {
			firstName: "John",
			lastName: "Doe",
			dateOfBirth: "1985-06-15",
			phone: "(555) 301-4001",
			address: {
				street: "123 Main St",
				city: "Anytown",
				state: "CA",
				zipCode: "90210",
			},
			emergencyContact: {
				name: "Jane Doe",
				relationship: "Spouse",
				phone: "(555) 301-4002",
			},
			insurance: {
				provider: "Delta Dental",
				policyNumber: "DD-123456789",
				groupNumber: "GRP-001",
			},
			medicalHistory: {
				allergies: ["Penicillin"],
				medications: ["Lisinopril 10mg"],
				conditions: ["Hypertension"],
			},
		},
	},
	{
		id: "patient-002",
		email: "alice.johnson@email.com",
		role: "patient",
		profile: {
			firstName: "Alice",
			lastName: "Johnson",
			dateOfBirth: "1992-03-22",
			phone: "(555) 301-4003",
			address: {
				street: "456 Oak Ave",
				city: "Somewhere",
				state: "CA",
				zipCode: "90211",
			},
			emergencyContact: {
				name: "Bob Johnson",
				relationship: "Father",
				phone: "(555) 301-4004",
			},
			insurance: {
				provider: "MetLife Dental",
				policyNumber: "ML-987654321",
				groupNumber: "GRP-002",
			},
			medicalHistory: {
				allergies: [],
				medications: [],
				conditions: [],
			},
		},
	},
	{
		id: "patient-003",
		email: "robert.smith@email.com",
		role: "patient",
		profile: {
			firstName: "Robert",
			lastName: "Smith",
			dateOfBirth: "1978-11-08",
			phone: "(555) 301-4005",
			address: {
				street: "789 Pine Rd",
				city: "Elsewhere",
				state: "CA",
				zipCode: "90212",
			},
			emergencyContact: {
				name: "Susan Smith",
				relationship: "Wife",
				phone: "(555) 301-4006",
			},
			insurance: {
				provider: "Cigna Dental",
				policyNumber: "CG-456789123",
				groupNumber: "GRP-003",
			},
			medicalHistory: {
				allergies: ["Latex"],
				medications: ["Metformin 500mg"],
				conditions: ["Type 2 Diabetes"],
			},
		},
	},
];

// For server-side operations, import from test-users-server.ts
// This file only contains client-safe data

// Placeholder hashes for client-side testing
const receptionist2Hash = {
	hash: "placeholder-hash-for-client-testing",
	salt: "placeholder-salt-for-client-testing"
};

const patient1Hash = {
	hash: "placeholder-hash-for-client-testing",
	salt: "placeholder-salt-for-client-testing"
};

const patient2Hash = {
	hash: "placeholder-hash-for-client-testing",
	salt: "placeholder-salt-for-client-testing"
};

const patient3Hash = {
	hash: "placeholder-hash-for-client-testing",
	salt: "placeholder-salt-for-client-testing"
};

export const clientTestUsers: TestUser[] = [
	{
		id: "receptionist-002",
		email: "jennifer.brown@cognident.org",
		password: "ReceptionPass456!",
		hashedPassword: receptionist2Hash.hash,
		salt: receptionist2Hash.salt,
		role: "receptionist",
		profile: {
			firstName: "Jennifer",
			lastName: "Brown",
			title: "Receptionist",
			phone: "(555) 201-3002",
			employeeId: "REC-002",
			department: "Front Office",
			startDate: "2023-01-10",
			permissions: ["scheduling", "patient_records"],
		},
		cryptoKeys: undefined,
		createdAt: new Date().toISOString(),
	},

	// Patient Users
	{
		id: "patient-001",
		email: "john.doe@email.com",
		password: "PatientPass123!",
		hashedPassword: patient1Hash.hash,
		salt: patient1Hash.salt,
		role: "patient",
		profile: {
			firstName: "John",
			lastName: "Doe",
			dateOfBirth: "1985-06-15",
			phone: "(555) 301-4001",
			address: {
				street: "123 Main St",
				city: "Anytown",
				state: "CA",
				zipCode: "90210",
			},
			emergencyContact: {
				name: "Jane Doe",
				relationship: "Spouse",
				phone: "(555) 301-4002",
			},
			insurance: {
				provider: "Delta Dental",
				policyNumber: "DD-123456789",
				groupNumber: "GRP-001",
			},
			medicalHistory: {
				allergies: ["Penicillin"],
				medications: ["Lisinopril 10mg"],
				conditions: ["Hypertension"],
			},
		},
		cryptoKeys: undefined,
		createdAt: new Date().toISOString(),
	},
	{
		id: "patient-002",
		email: "alice.johnson@email.com",
		password: "PatientPass456!",
		hashedPassword: patient2Hash.hash,
		salt: patient2Hash.salt,
		role: "patient",
		profile: {
			firstName: "Alice",
			lastName: "Johnson",
			dateOfBirth: "1992-03-22",
			phone: "(555) 301-4003",
			address: {
				street: "456 Oak Ave",
				city: "Somewhere",
				state: "CA",
				zipCode: "90211",
			},
			emergencyContact: {
				name: "Bob Johnson",
				relationship: "Father",
				phone: "(555) 301-4004",
			},
			insurance: {
				provider: "MetLife Dental",
				policyNumber: "ML-987654321",
				groupNumber: "GRP-002",
			},
			medicalHistory: {
				allergies: [],
				medications: [],
				conditions: [],
			},
		},
		cryptoKeys: undefined,
		createdAt: new Date().toISOString(),
	},
	{
		id: "patient-003",
		email: "robert.smith@email.com",
		password: "PatientPass789!",
		hashedPassword: patient3Hash.hash,
		salt: patient3Hash.salt,
		role: "patient",
		profile: {
			firstName: "Robert",
			lastName: "Smith",
			dateOfBirth: "1978-11-08",
			phone: "(555) 301-4005",
			address: {
				street: "789 Pine Rd",
				city: "Elsewhere",
				state: "CA",
				zipCode: "90212",
			},
			emergencyContact: {
				name: "Susan Smith",
				relationship: "Wife",
				phone: "(555) 301-4006",
			},
			insurance: {
				provider: "Cigna Dental",
				policyNumber: "CG-456789123",
				groupNumber: "GRP-003",
			},
			medicalHistory: {
				allergies: ["Latex"],
				medications: ["Metformin 500mg"],
				conditions: ["Type 2 Diabetes"],
			},
		},
		cryptoKeys: undefined,
		createdAt: new Date().toISOString(),
	},
];

// Helper function to find user by email
export const findUserByEmail = (email: string): TestUser | undefined => {
	return clientTestUsers.find(
		(user) => user.email.toLowerCase() === email.toLowerCase(),
	);
};

// Helper function to verify login (client-side testing only)
export const verifyUserLogin = (
	email: string,
	password: string,
): TestUser | null => {
	const user = findUserByEmail(email);
	if (!user) return null;

	// For client-side testing, just check if password matches the stored password
	const isValid = password === user.password;
	return isValid ? user : null;
};
