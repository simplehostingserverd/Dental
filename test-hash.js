/**
 * Test password hashing
 */

const { QuantumCrypto } = require("./src/lib/quantum-crypto.ts");

console.log("🔍 Testing password hashing...\n");

try {
	const result = QuantumCrypto.hashPassword("DentistPass123!");
	console.log("Hash result:", result);
	console.log("Type:", typeof result);
	console.log("Keys:", Object.keys(result));

	// Test verification
	const isValid = QuantumCrypto.verifyPassword(
		"DentistPass123!",
		result.hash,
		result.salt,
	);
	console.log("Verification:", isValid);
} catch (error) {
	console.error("Error:", error.message);
	console.error("Stack:", error.stack);
}
