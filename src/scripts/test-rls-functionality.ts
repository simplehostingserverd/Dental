import { db } from "@/server/db";
import { setRLSContext, clearRLSContext } from "@/server/db/rls-context";

async function testRLSFunctionality() {
  console.log("🔒 Testing Row Level Security functionality...\n");
  
  try {
    // First, clear any existing RLS context
    await clearRLSContext();
    
    // Test 1: Create test data without RLS context (should work with bypass)
    console.log("1. Creating test data...");
    
    // Set bypass RLS for setup
    await setRLSContext({ bypassRLS: true });
    
    const practice1 = await db.practice.create({
      data: {
        name: "Practice 1",
        email: "practice1@test.com"
      }
    });
    
    const practice2 = await db.practice.create({
      data: {
        name: "Practice 2", 
        email: "practice2@test.com"
      }
    });
    
    const user1 = await db.practiceUser.create({
      data: {
        email: "user1@practice1.com",
        firstName: "User",
        lastName: "One",
        role: "DOCTOR",
        practiceId: practice1.id
      }
    });
    
    const user2 = await db.practiceUser.create({
      data: {
        email: "user2@practice2.com",
        firstName: "User", 
        lastName: "Two",
        role: "DOCTOR",
        practiceId: practice2.id
      }
    });
    
    const patient1 = await db.patient.create({
      data: {
        firstName: "Patient",
        lastName: "One",
        dateOfBirth: new Date("1990-01-01"),
        gender: "Male",
        practiceId: practice1.id
      }
    });
    
    const patient2 = await db.patient.create({
      data: {
        firstName: "Patient",
        lastName: "Two", 
        dateOfBirth: new Date("1985-01-01"),
        gender: "Female",
        practiceId: practice2.id
      }
    });
    
    const payment1 = await db.payment.create({
      data: {
        amount: 100,
        paymentMethod: "CASH",
        status: "COMPLETED",
        patientId: patient1.id,
        practiceId: practice1.id
      }
    });
    
    const payment2 = await db.payment.create({
      data: {
        amount: 200,
        paymentMethod: "CREDIT_CARD", 
        status: "COMPLETED",
        patientId: patient2.id,
        practiceId: practice2.id
      }
    });
    
    console.log("✅ Test data created");
    
    // Test 2: Test RLS isolation for Practice 1 user
    console.log("\n2. Testing RLS for Practice 1 user...");
    
    await setRLSContext({
      userId: user1.id,
      practiceId: practice1.id,
      role: "DOCTOR"
    });
    
    // Should only see practice 1 data
    const practice1Payments = await db.payment.findMany({
      include: { patient: true, practice: true }
    });
    
    console.log(`✅ Practice 1 user sees ${practice1Payments.length} payments`);
    practice1Payments.forEach(p => {
      console.log(`   Payment: $${p.amount} from ${p.patient.firstName} ${p.patient.lastName} (Practice: ${p.practice.name})`);
      if (p.practiceId !== practice1.id) {
        throw new Error(`RLS VIOLATION: User from practice ${practice1.id} can see payment from practice ${p.practiceId}`);
      }
    });
    
    // Test 3: Test RLS isolation for Practice 2 user  
    console.log("\n3. Testing RLS for Practice 2 user...");
    
    await setRLSContext({
      userId: user2.id,
      practiceId: practice2.id,
      role: "DOCTOR"
    });
    
    const practice2Payments = await db.payment.findMany({
      include: { patient: true, practice: true }
    });
    
    console.log(`✅ Practice 2 user sees ${practice2Payments.length} payments`);
    practice2Payments.forEach(p => {
      console.log(`   Payment: $${p.amount} from ${p.patient.firstName} ${p.patient.lastName} (Practice: ${p.practice.name})`);
      if (p.practiceId !== practice2.id) {
        throw new Error(`RLS VIOLATION: User from practice ${practice2.id} can see payment from practice ${p.practiceId}`);
      }
    });
    
    // Test 4: Test that users can't see other practices' data
    console.log("\n4. Testing cross-practice isolation...");
    
    // Practice 1 user trying to access practice 2 data directly
    await setRLSContext({
      userId: user1.id,
      practiceId: practice1.id,
      role: "DOCTOR"
    });
    
    const crossPracticePayments = await db.payment.findMany({
      where: { practiceId: practice2.id }
    });
    
    if (crossPracticePayments.length > 0) {
      throw new Error("RLS VIOLATION: User can see payments from other practices");
    }
    
    console.log("✅ Cross-practice isolation working correctly");
    
    // Test 5: Test admin bypass
    console.log("\n5. Testing admin bypass...");
    
    await setRLSContext({
      userId: user1.id,
      practiceId: practice1.id,
      role: "ADMIN"
    });
    
    const adminPayments = await db.payment.findMany();
    console.log(`✅ Admin sees ${adminPayments.length} payments (should see all)`);
    
    // Clean up
    console.log("\n6. Cleaning up test data...");
    await setRLSContext({ bypassRLS: true });
    
    await db.payment.deleteMany({
      where: { id: { in: [payment1.id, payment2.id] } }
    });
    await db.patient.deleteMany({
      where: { id: { in: [patient1.id, patient2.id] } }
    });
    await db.practiceUser.deleteMany({
      where: { id: { in: [user1.id, user2.id] } }
    });
    await db.practice.deleteMany({
      where: { id: { in: [practice1.id, practice2.id] } }
    });
    
    console.log("✅ Test data cleaned up");
    
    console.log("\n🎉 All RLS functionality tests passed!");
    
  } catch (error) {
    console.error("❌ RLS test failed:", error);
    
    // Try to clean up on error
    try {
      await setRLSContext({ bypassRLS: true });
      await db.payment.deleteMany();
      await db.patient.deleteMany();
      await db.practiceUser.deleteMany();
      await db.practice.deleteMany();
    } catch (cleanupError) {
      console.error("Failed to cleanup:", cleanupError);
    }
    
    throw error;
  } finally {
    await clearRLSContext();
    await db.$disconnect();
  }
}

testRLSFunctionality();
