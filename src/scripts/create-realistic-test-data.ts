import { db } from "@/server/db";

// Realistic patient data
const firstNames = [
	"James",
	"Mary",
	"John",
	"Patricia",
	"Robert",
	"Jennifer",
	"Michael",
	"Linda",
	"William",
	"Elizabeth",
	"David",
	"Barbara",
	"Richard",
	"Susan",
	"Joseph",
	"Jessica",
	"Thomas",
	"Sarah",
	"Christopher",
	"Karen",
	"Charles",
	"Nancy",
	"Daniel",
	"Lisa",
	"Matthew",
	"Betty",
	"Anthony",
	"Helen",
	"Mark",
	"Sandra",
	"Donald",
	"Donna",
	"Steven",
	"Carol",
	"Paul",
	"Ruth",
	"Andrew",
	"Sharon",
	"Joshua",
	"Michelle",
	"Kenneth",
	"Laura",
	"Kevin",
	"Sarah",
	"Brian",
	"Kimberly",
	"George",
	"Deborah",
	"Edward",
	"Dorothy",
	"Ronald",
	"Lisa",
	"Timothy",
	"Nancy",
	"Jason",
	"Karen",
	"Jeffrey",
	"Betty",
	"Ryan",
	"Helen",
	"Jacob",
	"Sandra",
	"Gary",
	"Donna",
	"Nicholas",
	"Carol",
	"Eric",
	"Ruth",
	"Jonathan",
	"Sharon",
	"Stephen",
	"Michelle",
	"Larry",
	"Laura",
	"Justin",
	"Sarah",
	"Scott",
	"Kimberly",
	"Brandon",
	"Deborah",
	"Benjamin",
	"Dorothy",
	"Samuel",
	"Amy",
	"Gregory",
	"Angela",
	"Alexander",
	"Ashley",
	"Patrick",
	"Brenda",
	"Jack",
	"Emma",
	"Dennis",
	"Olivia",
	"Jerry",
	"Cynthia",
];

const lastNames = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
	"Hernandez",
	"Lopez",
	"Gonzalez",
	"Wilson",
	"Anderson",
	"Thomas",
	"Taylor",
	"Moore",
	"Jackson",
	"Martin",
	"Lee",
	"Perez",
	"Thompson",
	"White",
	"Harris",
	"Sanchez",
	"Clark",
	"Ramirez",
	"Lewis",
	"Robinson",
	"Walker",
	"Young",
	"Allen",
	"King",
	"Wright",
	"Scott",
	"Torres",
	"Nguyen",
	"Hill",
	"Flores",
	"Green",
	"Adams",
	"Nelson",
	"Baker",
	"Hall",
	"Rivera",
	"Campbell",
	"Mitchell",
	"Carter",
	"Roberts",
	"Gomez",
	"Phillips",
	"Evans",
	"Turner",
	"Diaz",
	"Parker",
	"Cruz",
	"Edwards",
	"Collins",
	"Reyes",
	"Stewart",
	"Morris",
	"Morales",
	"Murphy",
	"Cook",
	"Rogers",
	"Gutierrez",
	"Ortiz",
	"Morgan",
	"Cooper",
	"Peterson",
	"Bailey",
	"Reed",
	"Kelly",
	"Howard",
	"Ramos",
	"Kim",
	"Cox",
	"Ward",
	"Richardson",
	"Watson",
	"Brooks",
	"Chavez",
	"Wood",
	"James",
	"Bennett",
	"Gray",
	"Mendoza",
];

const streetNames = [
	"Main St",
	"Oak Ave",
	"Pine St",
	"Maple Ave",
	"Cedar St",
	"Elm Ave",
	"Park St",
	"Washington Ave",
	"Lincoln St",
	"Jefferson Ave",
	"Madison St",
	"Adams Ave",
	"Jackson St",
	"Monroe Ave",
	"Roosevelt St",
	"Wilson Ave",
	"Kennedy St",
	"Church St",
	"School Ave",
	"Mill St",
	"River Ave",
	"Hill St",
	"Lake Ave",
	"Forest St",
	"Garden Ave",
	"Spring St",
	"Summer Ave",
	"Winter St",
	"Autumn Ave",
];

const cities = [
	"Springfield",
	"Franklin",
	"Georgetown",
	"Clinton",
	"Madison",
	"Washington",
	"Arlington",
	"Richmond",
	"Fairview",
	"Salem",
	"Bristol",
	"Oxford",
	"Manchester",
	"Auburn",
	"Milton",
	"Newport",
	"Riverside",
	"Greenwood",
	"Ashland",
	"Burlington",
];

const states = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI"];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const medications = [
	"Amoxicillin",
	"Ibuprofen",
	"Acetaminophen",
	"Clindamycin",
	"Penicillin",
	"Hydrocodone",
	"Codeine",
	"Naproxen",
	"Aspirin",
	"Prednisone",
	"Azithromycin",
	"Cephalexin",
	"Doxycycline",
	"Metronidazole",
	"Ciprofloxacin",
];

const dosageInstructions = [
	"500mg twice daily with food",
	"200mg every 6 hours as needed for pain",
	"250mg three times daily for 7 days",
	"400mg every 8 hours",
	"Take 1 tablet every 4-6 hours as needed",
	"300mg twice daily after meals",
	"Take 2 tablets at bedtime",
	"500mg once daily for 10 days",
	"Apply topically as needed",
	"Take 1 capsule every 12 hours",
];

const messageTemplates = [
	"I need to reschedule my appointment for next week. Are there any available slots?",
	"Thank you for the excellent care during my last visit. I'm feeling much better now!",
	"I'm experiencing some sensitivity after the filling. Is this normal?",
	"Could you please send me a copy of my treatment plan?",
	"I have a question about my prescription. When should I take it?",
	"I'd like to schedule a cleaning appointment for next month.",
	"My tooth is still hurting after the procedure. Should I be concerned?",
	"Can I get a referral to an orthodontist?",
	"I need to update my insurance information.",
	"What are your office hours during the holidays?",
	"I lost my retainer. How can I get a replacement?",
	"Is it normal to have swelling after the extraction?",
	"I'd like to discuss teeth whitening options.",
	"My crown feels loose. Should I come in right away?",
	"Can you recommend a good mouthwash for sensitive teeth?",
];

function getRandomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
}

function generatePhoneNumber(): string {
	const areaCode = Math.floor(Math.random() * 900) + 100;
	const exchange = Math.floor(Math.random() * 900) + 100;
	const number = Math.floor(Math.random() * 9000) + 1000;
	return `(${areaCode}) ${exchange}-${number}`;
}

function generateEmail(firstName: string, lastName: string): string {
	const domains = [
		"gmail.com",
		"yahoo.com",
		"hotmail.com",
		"outlook.com",
		"aol.com",
	];
	const variations = [
		`${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
		`${firstName.toLowerCase()}${lastName.toLowerCase()}`,
		`${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
		`${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
		`${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
	];
	return `${getRandomElement(variations)}@${getRandomElement(domains)}`;
}

export async function createRealisticTestData() {
	try {
		console.log("Creating realistic test data...");

		// Get the first practice
		const practice = await db.practice.findFirst();
		if (!practice) {
			throw new Error("No practice found. Please create a practice first.");
		}

		// Create 60 patients with realistic data
		const patients = [];
		for (let i = 0; i < 60; i++) {
			const firstName = getRandomElement(firstNames);
			const lastName = getRandomElement(lastNames);
			const email = generateEmail(firstName, lastName);
			const phone = generatePhoneNumber();
			const dateOfBirth = getRandomDate(
				new Date(1940, 0, 1),
				new Date(2010, 11, 31),
			);
			const gender = getRandomElement(genders);

			const streetNumber = Math.floor(Math.random() * 9999) + 1;
			const streetName = getRandomElement(streetNames);
			const city = getRandomElement(cities);
			const state = getRandomElement(states);
			const zipCode = Math.floor(Math.random() * 90000) + 10000;

			const patient = await db.patient.create({
				data: {
					firstName,
					lastName,
					email,
					phone,
					dateOfBirth,
					gender,
					address: `${streetNumber} ${streetName}`,
					city,
					state,
					zipCode: zipCode.toString(),
					practiceId: practice.id,
				},
			});

			patients.push(patient);
		}

		console.log(`Created ${patients.length} patients`);

		// Create prescriptions for random patients
		const prescriptions = [];
		for (let i = 0; i < 120; i++) {
			const patient = getRandomElement(patients);
			const medication = getRandomElement(medications);
			const dosage = getRandomElement(dosageInstructions);
			const issuedAt = getRandomDate(new Date(2023, 0, 1), new Date());

			const prescription = await db.prescription.create({
				data: {
					drugName: medication,
					dosage,
					issuedAt,
					patientId: patient.id,
				},
			});

			prescriptions.push(prescription);
		}

		console.log(`Created ${prescriptions.length} prescriptions`);

		// Get a practice user to be the sender of messages
		const practiceUser = await db.practiceUser.findFirst({
			where: { practiceId: practice.id },
		});

		if (!practiceUser) {
			throw new Error(
				"No practice user found. Please create a practice user first.",
			);
		}

		// Create messages from patients (but sender must be practice user)
		const messages = [];
		for (let i = 0; i < 80; i++) {
			const patient = getRandomElement(patients);
			const content = getRandomElement(messageTemplates);
			const timestamp = getRandomDate(new Date(2024, 0, 1), new Date());
			const isRead = Math.random() > 0.3; // 70% read messages

			const message = await db.message.create({
				data: {
					content,
					timestamp,
					patientId: patient.id,
					senderId: practiceUser.id, // Practice user is the sender
					isRead,
				},
			});

			messages.push(message);
		}

		console.log(`Created ${messages.length} messages`);

		console.log("✅ Realistic test data created successfully!");
		console.log("📊 Summary:");
		console.log(`   - ${patients.length} patients`);
		console.log(`   - ${prescriptions.length} prescriptions`);
		console.log(`   - ${messages.length} messages`);

		return {
			patients: patients.length,
			prescriptions: prescriptions.length,
			messages: messages.length,
		};
	} catch (error) {
		console.error("Error creating test data:", error);
		throw error;
	}
}

// Run the script if called directly
if (require.main === module) {
	createRealisticTestData()
		.then(() => {
			console.log("Test data creation completed!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("Failed to create test data:", error);
			process.exit(1);
		});
}
