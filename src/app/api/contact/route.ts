import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, phone, subject, message } = body;

		// Validate required fields
		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: "Name, email, and message are required" },
				{ status: 400 }
			);
		}

		// Create transporter (you'll need to configure this with your email service)
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "smtp.gmail.com",
			port: parseInt(process.env.SMTP_PORT || "587"),
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		// Email content
		const emailContent = `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
			${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
			<p><strong>Message:</strong></p>
			<p>${message.replace(/\n/g, '<br>')}</p>
			
			<hr>
			<p><em>This message was sent from the Cognident contact form.</em></p>
		`;

		// Send email
		await transporter.sendMail({
			from: process.env.SMTP_FROM || '"Cognident Contact Form" <noreply@cognident.org>',
			to: "info@cognident.org",
			subject: subject ? `Contact Form: ${subject}` : "New Contact Form Submission",
			html: emailContent,
			replyTo: email,
		});

		// Send auto-reply to the user
		await transporter.sendMail({
			from: process.env.SMTP_FROM || '"Cognident" <noreply@cognident.org>',
			to: email,
			subject: "Thank you for contacting Cognident",
			html: `
				<h2>Thank you for contacting us!</h2>
				<p>Dear ${name},</p>
				<p>We have received your message and will get back to you within 24 hours.</p>
				<p>If you have any urgent questions, please call us directly.</p>
				<br>
				<p>Best regards,<br>The Cognident Team</p>
				<hr>
				<p><em>This is an automated response. Please do not reply to this email.</em></p>
			`,
		});

		return NextResponse.json(
			{ message: "Email sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Failed to send email" },
			{ status: 500 }
		);
	}
}
