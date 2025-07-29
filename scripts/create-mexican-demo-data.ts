#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMexicanDemoData() {
  console.log('🇲🇽 Creating Mexican Dental Practice Demo Data...\n');

  try {
    // Get the practice
    const practice = await prisma.practice.findFirst();
    if (!practice) {
      throw new Error('No practice found');
    }

    console.log('👥 Creating Mexican Patients...');
    
    // Create Mexican patients with realistic data
    const mexicanPatients = [
      {
        firstName: 'Miguel',
        lastName: 'Hernández García',
        email: 'miguel.hernandez@email.com',
        phone: '+52-55-1234-5678',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Masculino',
        address: {
          street: 'Av. Insurgentes Sur 1234',
          city: 'Ciudad de México',
          state: 'CDMX',
          zipCode: '03100',
          country: 'México'
        },
        emergencyContact: {
          name: 'María Hernández',
          phone: '+52-55-9876-5432',
          relationship: 'Esposa'
        },
        insurance: {
          provider: 'IMSS',
          policyNumber: 'IMSS-123456789',
          groupNumber: 'GRP-001'
        },
        medicalHistory: {
          allergies: ['Penicilina'],
          medications: ['Ninguno'],
          conditions: ['Hipertensión leve'],
          notes: 'Paciente con buena higiene dental'
        }
      },
      {
        firstName: 'Carmen',
        lastName: 'López Martínez',
        email: 'carmen.lopez@email.com',
        phone: '+52-55-2345-6789',
        dateOfBirth: new Date('1992-07-22'),
        gender: 'Femenino',
        address: {
          street: 'Calle Reforma 567',
          city: 'Guadalajara',
          state: 'Jalisco',
          zipCode: '44100',
          country: 'México'
        },
        emergencyContact: {
          name: 'José López',
          phone: '+52-33-8765-4321',
          relationship: 'Padre'
        },
        insurance: {
          provider: 'Seguro Popular',
          policyNumber: 'SP-987654321',
          groupNumber: 'GRP-002'
        }
      },
      {
        firstName: 'Roberto',
        lastName: 'Sánchez Díaz',
        email: 'roberto.sanchez@email.com',
        phone: '+52-81-3456-7890',
        dateOfBirth: new Date('1978-11-08'),
        gender: 'Masculino',
        address: {
          street: 'Av. Constitución 890',
          city: 'Monterrey',
          state: 'Nuevo León',
          zipCode: '64000',
          country: 'México'
        },
        emergencyContact: {
          name: 'Ana Sánchez',
          phone: '+52-81-7654-3210',
          relationship: 'Esposa'
        }
      },
      {
        firstName: 'Sofía',
        lastName: 'Ramírez Torres',
        email: 'sofia.ramirez@email.com',
        phone: '+52-33-4567-8901',
        dateOfBirth: new Date('1995-05-12'),
        gender: 'Femenino',
        address: {
          street: 'Calle Juárez 123',
          city: 'Puebla',
          state: 'Puebla',
          zipCode: '72000',
          country: 'México'
        },
        emergencyContact: {
          name: 'Luis Ramírez',
          phone: '+52-22-6543-2109',
          relationship: 'Hermano'
        }
      },
      {
        firstName: 'Diego',
        lastName: 'Morales Vega',
        email: 'diego.morales@email.com',
        phone: '+52-55-5678-9012',
        dateOfBirth: new Date('1988-09-30'),
        gender: 'Masculino',
        address: {
          street: 'Av. Universidad 456',
          city: 'Ciudad de México',
          state: 'CDMX',
          zipCode: '04510',
          country: 'México'
        },
        emergencyContact: {
          name: 'Elena Morales',
          phone: '+52-55-5432-1098',
          relationship: 'Madre'
        }
      }
    ];

    // Create patients
    const createdPatients = [];
    for (const patientData of mexicanPatients) {
      try {
        const existingPatient = await prisma.patient.findFirst({
          where: { email: patientData.email }
        });

        if (existingPatient) {
          console.log(`⚠️  Patient ${patientData.email} already exists, skipping...`);
          createdPatients.push(existingPatient);
          continue;
        }

        const patient = await prisma.patient.create({
          data: {
            ...patientData,
            practiceId: practice.id,
            totalVisits: Math.floor(Math.random() * 10) + 1,
            outstandingBalance: Math.random() * 5000,
          }
        });

        createdPatients.push(patient);
        console.log(`✅ Created patient: ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`❌ Error creating patient ${patientData.firstName}:`, error);
      }
    }

    console.log(`\n📅 Creating Mexican Appointments...`);
    
    // Get Mexican staff
    const mexicanDentist = await prisma.practiceUser.findUnique({
      where: { email: 'dentist.es@cognident.org' }
    });
    
    const mexicanReceptionist = await prisma.practiceUser.findUnique({
      where: { email: 'recepcionista@cognident.org' }
    });

    if (!mexicanDentist) {
      throw new Error('Mexican dentist not found');
    }

    // Create appointments for the next few days
    const appointmentTypes = [
      'Limpieza Dental',
      'Revisión General',
      'Empaste',
      'Extracción',
      'Endodoncia',
      'Corona Dental',
      'Blanqueamiento',
      'Ortodoncia - Consulta',
      'Cirugía Oral',
      'Implante Dental'
    ];

    const appointmentStatuses = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];

    for (let i = 0; i < 15; i++) {
      const patient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
      const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
      
      // Create appointments for the next 7 days
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 7));
      appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // 9 AM to 5 PM

      try {
        const appointment = await prisma.appointment.create({
          data: {
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            dentistId: mexicanDentist.id,
            dentistName: `${mexicanDentist.firstName} ${mexicanDentist.lastName}`,
            date: appointmentDate,
            time: appointmentDate.toTimeString().slice(0, 5),
            duration: 30 + Math.floor(Math.random() * 60), // 30-90 minutes
            type: appointmentType,
            status: status as any,
            notes: `Cita para ${appointmentType.toLowerCase()}. Paciente ${patient.firstName}.`,
            estimatedCost: Math.floor(Math.random() * 3000) + 500, // 500-3500 pesos
            practiceUserId: mexicanDentist.id,
          }
        });

        console.log(`✅ Created appointment: ${appointmentType} for ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`❌ Error creating appointment:`, error);
      }
    }

    console.log(`\n💰 Creating Mexican Invoices and Payments...`);
    
    // Create some invoices
    for (let i = 0; i < 8; i++) {
      const patient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const amount = Math.floor(Math.random() * 4000) + 1000; // 1000-5000 pesos
      const paid = Math.random() > 0.3 ? amount : Math.floor(amount * Math.random());
      
      try {
        const invoice = await prisma.invoice.create({
          data: {
            patientId: patient.id,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            amount: amount,
            paid: paid,
            status: paid >= amount ? 'PAID' : paid > 0 ? 'PARTIAL' : 'PENDING',
            treatments: [
              {
                description: 'Limpieza dental profesional',
                cost: amount * 0.6
              },
              {
                description: 'Aplicación de flúor',
                cost: amount * 0.4
              }
            ]
          }
        });

        // Create payment if invoice is paid
        if (paid > 0) {
          await prisma.payment.create({
            data: {
              invoiceId: invoice.id,
              patientId: patient.id,
              practiceId: practice.id,
              amount: paid,
              paymentMethod: Math.random() > 0.5 ? 'CASH' : 'CREDIT_CARD',
              status: 'COMPLETED',
              transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              notes: `Pago recibido por tratamiento dental`
            }
          });
        }

        console.log(`✅ Created invoice: $${amount} MXN for ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`❌ Error creating invoice:`, error);
      }
    }

    console.log(`\n💬 Creating Mexican Messages...`);
    
    // Create some messages
    for (let i = 0; i < 10; i++) {
      const patient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const sender = Math.random() > 0.5 ? mexicanDentist : mexicanReceptionist;
      
      const mexicanMessages = [
        '¡Hola! Su cita está confirmada para mañana a las 10:00 AM.',
        'Recordatorio: No olvide traer su identificación y tarjeta de seguro.',
        'Su tratamiento ha sido completado exitosamente. ¿Tiene alguna pregunta?',
        'Por favor llegue 15 minutos antes de su cita.',
        'Su próxima cita de seguimiento está programada para la próxima semana.',
        'Gracias por elegir nuestra clínica dental. ¡Esperamos verle pronto!',
        'Su radiografía está lista. Puede pasar a recogerla cuando guste.',
        'Recordatorio: Es importante mantener una buena higiene dental.',
        '¿Cómo se siente después del tratamiento de ayer?',
        'Su plan de tratamiento está listo. Podemos discutirlo en su próxima visita.'
      ];

      try {
        await prisma.message.create({
          data: {
            content: mexicanMessages[Math.floor(Math.random() * mexicanMessages.length)],
            senderId: sender!.id,
            patientId: patient.id,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
            isRead: Math.random() > 0.3
          }
        });

        console.log(`✅ Created message for ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`❌ Error creating message:`, error);
      }
    }

    console.log('\n🎉 Mexican Demo Data Creation Complete!\n');
    
    console.log('📊 SUMMARY:');
    console.log('===========');
    console.log(`✅ Patients: ${createdPatients.length}`);
    console.log(`✅ Appointments: 15`);
    console.log(`✅ Invoices: 8`);
    console.log(`✅ Messages: 10`);
    
    console.log('\n🇲🇽 READY FOR MEXICAN DEMO!');
    console.log('============================');
    console.log('The Mexican dental practice now has comprehensive demo data including:');
    console.log('- Mexican patients with realistic names and addresses');
    console.log('- Appointments in Spanish');
    console.log('- Invoices in Mexican pesos');
    console.log('- Messages in Spanish');
    console.log('- Complete CRUD functionality ready for testing');

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createMexicanDemoData();
}

export { createMexicanDemoData };
