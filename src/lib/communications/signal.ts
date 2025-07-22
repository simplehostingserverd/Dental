/**
 * Signal Messaging Integration
 * For secure patient communications in Mexico dental clinics
 * Uses Signal-CLI REST API
 */

interface SignalMessage {
  number: string;
  recipients: string[];
  message?: string;
  attachments?: string[];
  base64_attachments?: string[];
}

interface SignalResponse {
  timestamp: number;
  success: boolean;
  error?: string;
}

interface SignalIncomingMessage {
  envelope: {
    source: string;
    sourceNumber: string;
    sourceUuid: string;
    sourceName: string;
    sourceDevice: number;
    timestamp: number;
    dataMessage?: {
      timestamp: number;
      message: string;
      expiresInSeconds: number;
      viewOnce: boolean;
      attachments?: Array<{
        contentType: string;
        filename: string;
        id: string;
        size: number;
      }>;
    };
  };
  account: string;
}

export class SignalService {
  private signalNumber: string;
  private baseUrl: string;

  constructor() {
    this.signalNumber = process.env.SIGNAL_NUMBER || '';
    this.baseUrl = process.env.SIGNAL_CLI_REST_API_URL || 'http://localhost:8080';
    
    if (!this.signalNumber) {
      console.warn('Signal number not configured. Signal features will be disabled.');
    }
  }

  /**
   * Check if Signal is available
   */
  isAvailable(): boolean {
    return !!this.signalNumber;
  }

  /**
   * Send a text message
   */
  async sendTextMessage(to: string, message: string): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const payload: SignalMessage = {
      number: this.signalNumber,
      recipients: [this.formatPhoneNumber(to)],
      message: message
    };

    return this.sendMessage(payload);
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(
    to: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    doctorName: string,
    clinicAddress: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const message = `🦷 RECORDATORIO DE CITA DENTAL

¡Hola ${patientName}!

Te recordamos tu próxima cita:

📅 Fecha: ${appointmentDate}
🕐 Hora: ${appointmentTime}
👨‍⚕️ Doctor: ${doctorName}
📍 Ubicación: ${clinicAddress}

IMPORTANTE:
• Llega 15 minutos antes
• Trae tu identificación oficial
• Si tienes seguro, trae tu tarjeta

Para reprogramar, contáctanos lo antes posible.

¡Te esperamos!

Clínica Dental Cognident
📞 (55) 1234-5678`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(
    to: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    treatmentType: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const message = `✅ CITA CONFIRMADA

¡Hola ${patientName}!

Tu cita ha sido confirmada exitosamente:

📅 Fecha: ${appointmentDate}
🕐 Hora: ${appointmentTime}
🦷 Tratamiento: ${treatmentType}

INSTRUCCIONES IMPORTANTES:
• Llega 15 minutos antes de tu cita
• Trae tu identificación oficial
• Si tienes seguro dental, trae tu tarjeta
• Evita comer 2 horas antes si es un procedimiento

¡Nos vemos pronto! 😊

Clínica Dental Cognident
📞 (55) 1234-5678`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(
    to: string,
    patientName: string,
    amount: string,
    dueDate: string,
    invoiceNumber: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const message = `💳 RECORDATORIO DE PAGO

Estimado/a ${patientName},

Te recordamos que tienes un pago pendiente:

💰 Monto: $${amount} MXN
📅 Fecha límite: ${dueDate}
📄 Factura: #${invoiceNumber}

MÉTODOS DE PAGO DISPONIBLES:
• Efectivo en clínica
• Transferencia bancaria
• Tarjeta de crédito/débito

DATOS BANCARIOS:
Banco: BBVA Bancomer
Cuenta: 0123456789
CLABE: 012345678901234567
A nombre de: Clínica Dental Cognident

Para cualquier duda, no dudes en contactarnos.

¡Gracias por tu preferencia! 🙏

Clínica Dental Cognident
📞 (55) 1234-5678`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send post-treatment care instructions
   */
  async sendPostTreatmentCare(
    to: string,
    patientName: string,
    treatmentType: string,
    instructions: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const message = `🩺 CUIDADOS POST-TRATAMIENTO

Hola ${patientName},

Esperamos que te encuentres bien después de tu ${treatmentType}.

INSTRUCCIONES DE CUIDADO:
${instructions}

RECOMENDACIONES GENERALES:
• Mantén una buena higiene oral
• Evita alimentos muy duros o pegajosos
• Toma los medicamentos según las indicaciones
• Aplica hielo si hay inflamación (15 min cada hora)

⚠️ CONTACTA INMEDIATAMENTE SI EXPERIMENTAS:
• Dolor severo que no mejora con medicamentos
• Sangrado excesivo que no se detiene
• Fiebre alta (más de 38°C)
• Inflamación que empeora después de 48 horas

EMERGENCIAS 24/7: (55) 1234-5678

¡Que tengas una pronta recuperación! 💪

Clínica Dental Cognident`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send promotional message
   */
  async sendPromotion(
    to: string,
    patientName: string,
    promotionTitle: string,
    promotionDetails: string,
    validUntil: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const message = `🎉 ${promotionTitle}

¡Hola ${patientName}!

Tenemos una oferta especial para ti:

${promotionDetails}

⏰ Válida hasta: ${validUntil}

¡No dejes pasar esta oportunidad de cuidar tu sonrisa!

Para agendar tu cita:
📞 Llama al (55) 1234-5678
🌐 Visita: https://cognident.org/es/appointments/book

Clínica Dental Cognident
Tu sonrisa es nuestra prioridad ✨`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send secure document (treatment plans, X-rays, etc.)
   */
  async sendDocument(
    to: string,
    documentPath: string,
    caption?: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const payload: SignalMessage = {
      number: this.signalNumber,
      recipients: [this.formatPhoneNumber(to)],
      message: caption || 'Documento adjunto',
      attachments: [documentPath]
    };

    return this.sendMessage(payload);
  }

  /**
   * Send secure image (X-rays, treatment photos, etc.)
   */
  async sendImage(
    to: string,
    imagePath: string,
    caption?: string
  ): Promise<SignalResponse | null> {
    if (!this.isAvailable()) {
      console.warn('Signal not available');
      return null;
    }

    const payload: SignalMessage = {
      number: this.signalNumber,
      recipients: [this.formatPhoneNumber(to)],
      message: caption || 'Imagen adjunta',
      attachments: [imagePath]
    };

    return this.sendMessage(payload);
  }

  /**
   * Process incoming Signal message
   */
  async processIncomingMessage(messageData: SignalIncomingMessage): Promise<void> {
    try {
      const envelope = messageData.envelope;
      const dataMessage = envelope.dataMessage;
      
      if (!dataMessage) return;

      const from = envelope.sourceNumber;
      const message = dataMessage.message;
      const senderName = envelope.sourceName || 'Usuario';

      console.log(`Signal message from ${senderName} (${from}): ${message}`);

      // Auto-reply for common queries
      if (message) {
        const messageText = message.toLowerCase();
        
        if (messageText.includes('cita') || messageText.includes('appointment')) {
          await this.sendTextMessage(
            from,
            `Gracias por contactarnos, ${senderName}.

Para agendar una cita puedes:
📞 Llamar al (55) 1234-5678
🌐 Visitar: https://cognident.org/es/appointments/book

Horarios de atención:
Lunes a Viernes: 8:00 AM - 7:00 PM
Sábados: 9:00 AM - 3:00 PM

¡Estaremos encantados de atenderte!`
          );
        } else if (messageText.includes('horario') || messageText.includes('hours')) {
          await this.sendTextMessage(
            from,
            `🕐 HORARIOS DE ATENCIÓN

Lunes a Viernes: 8:00 AM - 7:00 PM
Sábados: 9:00 AM - 3:00 PM
Domingos: Cerrado

Emergencias 24/7: (55) 1234-5678

¿En qué más podemos ayudarte?`
          );
        } else if (messageText.includes('ubicación') || messageText.includes('location')) {
          await this.sendTextMessage(
            from,
            `📍 NUESTRA UBICACIÓN

Av. Reforma 123, Col. Centro
Ciudad de México, CDMX
CP 06000

Referencias:
• Frente al Metro Bellas Artes
• A 2 cuadras del Palacio de Bellas Artes

¿Necesitas indicaciones específicas?`
          );
        } else if (messageText.includes('emergencia') || messageText.includes('emergency')) {
          await this.sendTextMessage(
            from,
            `🚨 EMERGENCIA DENTAL

Para emergencias inmediatas:
📞 Llama AHORA al (55) 1234-5678

Estamos disponibles 24/7 para emergencias.

Si es una emergencia médica grave, llama al 911.

¡Tu salud es nuestra prioridad!`
          );
        } else {
          await this.sendTextMessage(
            from,
            `Gracias por tu mensaje, ${senderName}.

Un miembro de nuestro equipo te responderá pronto.

Para atención inmediata:
📞 (55) 1234-5678

¡Que tengas un excelente día! 😊

Clínica Dental Cognident`
          );
        }
      }
    } catch (error) {
      console.error('Error processing Signal message:', error);
    }
  }

  /**
   * Send message to Signal API
   */
  private async sendMessage(payload: SignalMessage): Promise<SignalResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Signal API error: ${response.status} ${errorData}`);
      }

      const result = await response.json();
      console.log('Signal message sent successfully');
      return {
        timestamp: Date.now(),
        success: true
      };
    } catch (error) {
      console.error('Error sending Signal message:', error);
      return {
        timestamp: Date.now(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Format phone number for Signal (with country code)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with +52 or 52 (Mexico), format correctly
    if (cleaned.startsWith('52')) {
      return `+${cleaned}`;
    }
    
    // If it's a 10-digit Mexican number, add country code
    if (cleaned.length === 10) {
      return `+52${cleaned}`;
    }
    
    // If it starts with + already, use as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // Default: assume it's a Mexican number and add country code
    return `+52${cleaned}`;
  }
}

// Singleton instance
export const signalService = new SignalService();
