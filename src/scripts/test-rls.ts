import { db } from "@/server/db";
import { setRLSContext, clearRLSContext } from "@/server/db/rls-context";

async function testRLS() {
  console.log("🔒 Testing Row Level Security...");

  // Test 1: Practice isolation
  await setRLSContext({
    userId: "practice-user-1",
    practiceId: "practice-1",
    role: "ADMIN"
  });

  const practice1Patients = await db.patient.findMany();
  console.log(`Practice 1 can see ${practice1Patients.length} patients`);

  // Test 2: Different practice
  await setRLSContext({
    userId: "practice-user-2", 
    practiceId: "practice-2",
    role: "ADMIN"
  });

  const practice2Patients = await db.patient.findMany();
  console.log(`Practice 2 can see ${practice2Patients.length} patients`);

  // Test 3: Patient portal access
  await setRLSContext({
    patientUserId: "patient-user-1",
    patientId: "patient-1"
  });

  const patientData = await db.patient.findMany();
  console.log(`Patient can see ${patientData.length} patient records (should be 1)`);

  await clearRLSContext();
  console.log("✅ RLS testing complete");
}

testRLS().catch(console.error);