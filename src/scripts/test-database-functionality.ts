import { db } from "@/server/db";

async function testDatabaseFunctionality() {
  console.log("🧪 Testing database functionality...\n");
  
  try {
    // Test 1: Create a practice
    console.log("1. Testing Practice creation...");
    const practice = await db.practice.create({
      data: {
        name: "Test Dental Practice",
        email: "test@dental.com",
        phone: "555-0123",
        address: "123 Test St",
        city: "Test City",
        state: "TS",
        zipCode: "12345"
      }
    });
    console.log(`✅ Practice created: ${practice.id} - ${practice.name}`);
    
    // Test 2: Create a practice user
    console.log("\n2. Testing PracticeUser creation...");
    const practiceUser = await db.practiceUser.create({
      data: {
        email: "doctor@test.com",
        firstName: "Dr. Test",
        lastName: "Doctor",
        role: "DOCTOR",
        practiceId: practice.id,
        phone: "555-0124"
      }
    });
    console.log(`✅ PracticeUser created: ${practiceUser.id} - ${practiceUser.email}`);
    console.log(`   practiceId: ${practiceUser.practiceId}`);
    
    // Test 3: Create a patient
    console.log("\n3. Testing Patient creation...");
    const patient = await db.patient.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        gender: "Male",
        email: "john.doe@test.com",
        phone: "555-0125",
        practiceId: practice.id
      }
    });
    console.log(`✅ Patient created: ${patient.id} - ${patient.firstName} ${patient.lastName}`);
    console.log(`   practiceId: ${patient.practiceId}`);
    
    // Test 4: Create an invoice
    console.log("\n4. Testing Invoice creation...");
    const invoice = await db.invoice.create({
      data: {
        total: 250.00,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "UNPAID",
        patientId: patient.id
      }
    });
    console.log(`✅ Invoice created: ${invoice.id} - $${invoice.total}`);
    
    // Test 5: Create a payment (this was mentioned as potentially missing)
    console.log("\n5. Testing Payment creation...");
    const payment = await db.payment.create({
      data: {
        amount: 100.00,
        paymentMethod: "CREDIT_CARD",
        status: "COMPLETED",
        patientId: patient.id,
        invoiceId: invoice.id,
        practiceId: practice.id,
        transactionId: "test_txn_123",
        notes: "Test payment"
      }
    });
    console.log(`✅ Payment created: ${payment.id} - $${payment.amount}`);
    console.log(`   practiceId: ${payment.practiceId}`);
    console.log(`   patientId: ${payment.patientId}`);
    console.log(`   invoiceId: ${payment.invoiceId}`);
    
    // Test 6: Test relationships
    console.log("\n6. Testing relationships...");
    
    // Get practice with related data
    const practiceWithData = await db.practice.findUnique({
      where: { id: practice.id },
      include: {
        practiceUsers: true,
        patients: true,
        payments: true
      }
    });
    
    console.log(`✅ Practice relationships:`);
    console.log(`   Users: ${practiceWithData?.practiceUsers.length}`);
    console.log(`   Patients: ${practiceWithData?.patients.length}`);
    console.log(`   Payments: ${practiceWithData?.payments.length}`);
    
    // Get payment with related data
    const paymentWithData = await db.payment.findUnique({
      where: { id: payment.id },
      include: {
        patient: true,
        practice: true,
        invoice: true
      }
    });
    
    console.log(`✅ Payment relationships:`);
    console.log(`   Patient: ${paymentWithData?.patient.firstName} ${paymentWithData?.patient.lastName}`);
    console.log(`   Practice: ${paymentWithData?.practice.name}`);
    console.log(`   Invoice: $${paymentWithData?.invoice?.total}`);
    
    // Test 7: Test queries by practiceId
    console.log("\n7. Testing practiceId filtering...");
    
    const practicePayments = await db.payment.findMany({
      where: { practiceId: practice.id },
      include: { patient: true }
    });
    
    console.log(`✅ Found ${practicePayments.length} payments for practice ${practice.id}`);
    practicePayments.forEach(p => {
      console.log(`   Payment ${p.id}: $${p.amount} from ${p.patient.firstName} ${p.patient.lastName}`);
    });
    
    // Test 8: Clean up test data
    console.log("\n8. Cleaning up test data...");
    await db.payment.delete({ where: { id: payment.id } });
    await db.invoice.delete({ where: { id: invoice.id } });
    await db.patient.delete({ where: { id: patient.id } });
    await db.practiceUser.delete({ where: { id: practiceUser.id } });
    await db.practice.delete({ where: { id: practice.id } });
    console.log("✅ Test data cleaned up");
    
    console.log("\n🎉 All database functionality tests passed!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

testDatabaseFunctionality();
