#!/usr/bin/env node

/**
 * Cron job script to process appointment reminders
 * Run this script every 15 minutes to check for pending reminders
 * 
 * Usage: node scripts/process-reminders.js
 * Cron: */15 * * * * node /path/to/scripts/process-reminders.js
 */

const { PrismaClient } = require('@prisma/client');
const { ReminderService } = require('../src/lib/reminders/reminder-service');

const db = new PrismaClient();

async function processReminders() {
	console.log(`[${new Date().toISOString()}] Starting reminder processing...`);
	
	try {
		// Get all active practices
		const practices = await db.practice.findMany({
			where: { isActive: true }
		});

		console.log(`Found ${practices.length} active practices`);

		let totalProcessed = 0;
		let totalSent = 0;
		let totalFailed = 0;

		// Process reminders for each practice
		for (const practice of practices) {
			try {
				console.log(`Processing reminders for practice: ${practice.name} (${practice.id})`);
				
				const reminderService = new ReminderService(practice.id);
				
				// Get pending reminders for this practice
				const pendingReminders = await db.appointmentReminder.findMany({
					where: {
						status: 'pending',
						scheduledFor: {
							lte: new Date()
						},
						appointment: {
							patient: {
								practiceId: practice.id
							}
						}
					},
					include: {
						appointment: {
							include: {
								patient: true
							}
						}
					}
				});

				console.log(`  Found ${pendingReminders.length} pending reminders`);

				if (pendingReminders.length > 0) {
					await reminderService.processPendingReminders();
					
					// Count results
					const results = await db.appointmentReminder.findMany({
						where: {
							id: {
								in: pendingReminders.map(r => r.id)
							}
						}
					});

					const sent = results.filter(r => r.status === 'sent').length;
					const failed = results.filter(r => r.status === 'failed').length;

					totalProcessed += pendingReminders.length;
					totalSent += sent;
					totalFailed += failed;

					console.log(`  Processed: ${pendingReminders.length}, Sent: ${sent}, Failed: ${failed}`);
				}
			} catch (error) {
				console.error(`Error processing reminders for practice ${practice.id}:`, error);
			}
		}

		console.log(`[${new Date().toISOString()}] Reminder processing completed`);
		console.log(`Total processed: ${totalProcessed}, Sent: ${totalSent}, Failed: ${totalFailed}`);

		// Log summary to database (optional)
		if (totalProcessed > 0) {
			console.log('Reminder processing summary logged');
		}

	} catch (error) {
		console.error('Fatal error in reminder processing:', error);
		process.exit(1);
	} finally {
		await db.$disconnect();
	}
}

// Auto-schedule reminders for upcoming appointments
async function autoScheduleReminders() {
	console.log(`[${new Date().toISOString()}] Auto-scheduling reminders for new appointments...`);
	
	try {
		// Find appointments in the next 7 days that don't have reminders scheduled
		const upcomingAppointments = await db.appointment.findMany({
			where: {
				date: {
					gte: new Date(),
					lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
				},
				status: {
					in: ['SCHEDULED', 'CONFIRMED']
				}
			},
			include: {
				reminders: true,
				patient: {
					include: {
						practice: true
					}
				}
			}
		});

		let scheduledCount = 0;

		for (const appointment of upcomingAppointments) {
			// Skip if reminders already exist
			if (appointment.reminders.length > 0) {
				continue;
			}

			try {
				const reminderService = new ReminderService(appointment.patient.practiceId);
				await reminderService.scheduleReminders(appointment.id);
				scheduledCount++;
				
				console.log(`  Scheduled reminders for appointment ${appointment.id}`);
			} catch (error) {
				console.error(`Failed to schedule reminders for appointment ${appointment.id}:`, error);
			}
		}

		console.log(`Auto-scheduled reminders for ${scheduledCount} appointments`);

	} catch (error) {
		console.error('Error in auto-scheduling reminders:', error);
	}
}

// Cleanup old reminders
async function cleanupOldReminders() {
	console.log(`[${new Date().toISOString()}] Cleaning up old reminders...`);
	
	try {
		// Delete reminders older than 30 days
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		
		const result = await db.appointmentReminder.deleteMany({
			where: {
				createdAt: {
					lt: thirtyDaysAgo
				},
				status: {
					in: ['sent', 'failed', 'cancelled']
				}
			}
		});

		console.log(`Cleaned up ${result.count} old reminders`);

	} catch (error) {
		console.error('Error cleaning up old reminders:', error);
	}
}

// Main execution
async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'process';

	switch (command) {
		case 'process':
			await processReminders();
			break;
		case 'schedule':
			await autoScheduleReminders();
			break;
		case 'cleanup':
			await cleanupOldReminders();
			break;
		case 'all':
			await autoScheduleReminders();
			await processReminders();
			await cleanupOldReminders();
			break;
		default:
			console.log('Usage: node process-reminders.js [process|schedule|cleanup|all]');
			console.log('  process  - Process pending reminders (default)');
			console.log('  schedule - Auto-schedule reminders for new appointments');
			console.log('  cleanup  - Clean up old reminders');
			console.log('  all      - Run all operations');
			process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
	console.log('Received SIGINT, shutting down gracefully...');
	await db.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('Received SIGTERM, shutting down gracefully...');
	await db.$disconnect();
	process.exit(0);
});

// Run the script
if (require.main === module) {
	main().catch((error) => {
		console.error('Unhandled error:', error);
		process.exit(1);
	});
}

module.exports = {
	processReminders,
	autoScheduleReminders,
	cleanupOldReminders
};
