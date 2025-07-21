/**
 * Test Users with Quantum-Resistant Encryption (Server-side only)
 * For testing login flows and dashboard redirects
 */

import { QuantumCrypto } from "./quantum-crypto";

export interface TestUser {
	id: string;
	email: string;
	password: string; // Plain text for testing only
	hashedPassword: string;
	salt: string;
	role: "dentist" | "receptionist" | "patient";
	profile: any;
	cryptoKeys: {
		mlkem: { publicKey: string; privateKey: string };
		mldsa: { publicKey: string; privateKey: string };
		slhdsa: { publicKey: string; privateKey: string };
		hqc: { publicKey: string; privateKey: string };
	};
	createdAt: string;
	lastLogin?: string;
}

// Generate quantum-resistant keys for each user (server-side only)
const generateUserCrypto = () => ({
	mlkem: QuantumCrypto.generateMLKEMKeyPair(),
	mldsa: QuantumCrypto.generateMLDSAKeyPair(),
	slhdsa: QuantumCrypto.generateSLHDSAKeyPair(),
	hqc: QuantumCrypto.generateHQCKeyPair(),
});

// Generate hashes for all passwords (server-side only)
const dentist1Hash = QuantumCrypto.hashPassword("DentistPass123!");
const dentist2Hash = QuantumCrypto.hashPassword("DentistPass456!");
const receptionist1Hash = QuantumCrypto.hashPassword("ReceptionPass123!");
const receptionist2Hash = QuantumCrypto.hashPassword("ReceptionPass456!");
const patient1Hash = QuantumCrypto.hashPassword("PatientPass123!");
const patient2Hash = QuantumCrypto.hashPassword("PatientPass456!");
const patient3Hash = QuantumCrypto.hashPassword("PatientPass789!");

export const testUsers: TestUser[] = [
	// Dentist Users
	{
		id: "dentist-001",
		email: "dr.smith@cognident.org",
		password: "DentistPass123!",
		hashedPassword: dentist1Hash.hash,
		salt: dentist1Hash.salt,
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
		cryptoKeys: generateUserCrypto(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "dentist-002",
		email: "dr.johnson@cognident.org",
		password: "DentistPass456!",
		hashedPassword: dentist2Hash.hash,
		salt: dentist2Hash.salt,
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
		cryptoKeys: generateUserCrypto(),
		createdAt: new Date().toISOString(),
	},

	// Receptionist Users
	{
		id: "receptionist-001",
		email: "mary.wilson@cognident.org",
		password: "ReceptionPass123!",
		hashedPassword: receptionist1Hash.hash,
		salt: receptionist1Hash.salt,
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
		cryptoKeys: generateUserCrypto(),
		createdAt: new Date().toISOString(),
	},
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
		cryptoKeys: generateUserCrypto(),
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
		cryptoKeys: generateUserCrypto(),
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
		cryptoKeys: generateUserCrypto(),
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
		cryptoKeys: generateUserCrypto(),
		createdAt: new Date().toISOString(),
	},
];

// Helper function to find user by email
export const findUserByEmail = (email: string): TestUser | undefined => {
	return testUsers.find(
		(user) => user.email.toLowerCase() === email.toLowerCase(),
	);
};

// Helper function to verify login
export const verifyUserLogin = (
	email: string,
	password: string,
): TestUser | null => {
	const user = findUserByEmail(email);
	if (!user) return null;

	const isValid = QuantumCrypto.verifyPassword(
		password,
		user.hashedPassword,
		user.salt,
	);
	return isValid ? user : null;
};
