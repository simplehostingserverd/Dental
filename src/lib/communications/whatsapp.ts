/**
 * WhatsApp Business API Integration
 * For Mexico dental clinics patient communication
 */

interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename: string;
    caption?: string;
  };
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: string;
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('WhatsApp credentials not configured. WhatsApp features will be disabled.');
    }
  }

  /**
   * Update credentials dynamically (for settings page)
   */
  updateCredentials(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  /**
   * Check if WhatsApp is available
   */
  isAvailable(): boolean {
    return !!(this.accessToken && this.phoneNumberId);
  }

  /**
   * Send a text message
   */
  async sendTextMessage(to: string, message: string): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'text',
      text: {
        body: message
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Send appointment reminder using template
   */
  async sendAppointmentReminder(
    to: string, 
    patientName: string, 
    appointmentDate: string, 
    appointmentTime: string,
    doctorName: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: 'appointment_reminder_es',
        language: {
          code: 'es_MX'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: patientName
              },
              {
                type: 'text',
                text: appointmentDate
              },
              {
                type: 'text',
                text: appointmentTime
              },
              {
                type: 'text',
                text: doctorName
              }
            ]
          }
        ]
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Send appointment confirmation template
   */
  async sendAppointmentConfirmation(
    to: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    clinicName: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: 'appointment_confirmation_es',
        language: {
          code: 'es_MX'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: patientName
              },
              {
                type: 'text',
                text: appointmentDate
              },
              {
                type: 'text',
                text: appointmentTime
              },
              {
                type: 'text',
                text: clinicName
              }
            ]
          }
        ]
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(
    to: string,
    patientName: string,
    amount: string,
    dueDate: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: 'payment_reminder_es',
        language: {
          code: 'es_MX'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: patientName
              },
              {
                type: 'text',
                text: amount
              },
              {
                type: 'text',
                text: dueDate
              }
            ]
          }
        ]
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Send post-treatment care instructions
   */
  async sendPostTreatmentCare(
    to: string,
    patientName: string,
    treatmentType: string,
    instructions: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const message = `Hola ${patientName},

Esperamos que te encuentres bien después de tu ${treatmentType}.

Instrucciones de cuidado:
${instructions}

Si tienes alguna pregunta o molestia, no dudes en contactarnos.

¡Que tengas una pronta recuperación!

Clínica Dental Cognident`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send image (X-rays, treatment photos, etc.)
   */
  async sendImage(
    to: string,
    imageUrl: string,
    caption?: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'image',
      image: {
        link: imageUrl,
        caption: caption
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Send document (treatment plans, invoices, etc.)
   */
  async sendDocument(
    to: string,
    documentUrl: string,
    filename: string,
    caption?: string
  ): Promise<WhatsAppResponse | null> {
    if (!this.isAvailable()) {
      console.warn('WhatsApp not available');
      return null;
    }

    const payload: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: 'document',
      document: {
        link: documentUrl,
        filename: filename,
        caption: caption
      }
    };

    return this.sendMessage(payload);
  }

  /**
   * Process incoming webhook message
   */
  async processIncomingMessage(webhookData: any): Promise<void> {
    try {
      const entry = webhookData.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        for (const message of messages) {
          await this.handleIncomingMessage(message);
        }
      }
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
    }
  }

  /**
   * Handle individual incoming message
   */
  private async handleIncomingMessage(message: WhatsAppWebhookMessage): Promise<void> {
    const { from, text, type } = message;

    // Log the message
    console.log(`WhatsApp message from ${from}: ${text?.body || type}`);

    // Auto-reply for common queries
    if (text?.body) {
      const messageText = text.body.toLowerCase();
      
      if (messageText.includes('cita') || messageText.includes('appointment')) {
        await this.sendTextMessage(
          from,
          'Gracias por contactarnos. Para agendar una cita, por favor llama al (55) 1234-5678 o visita nuestra página web. ¡Estaremos encantados de atenderte!'
        );
      } else if (messageText.includes('horario') || messageText.includes('hours')) {
        await this.sendTextMessage(
          from,
          'Nuestros horarios de atención son:\n\nLunes a Viernes: 8:00 AM - 7:00 PM\nSábados: 9:00 AM - 3:00 PM\nDomingos: Cerrado\n\n¿En qué más podemos ayudarte?'
        );
      } else if (messageText.includes('ubicación') || messageText.includes('location')) {
        await this.sendTextMessage(
          from,
          'Nos encontramos en:\nAv. Reforma 123, Col. Centro\nCiudad de México, CDMX\nCP 06000\n\n¿Necesitas indicaciones específicas?'
        );
      }
    }
  }

  /**
   * Send the actual message to WhatsApp API
   */
  private async sendMessage(payload: WhatsAppMessage): Promise<WhatsAppResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          ...payload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('WhatsApp message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return null;
    }
  }

  /**
   * Format phone number for WhatsApp (remove + and ensure country code)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 52 (Mexico), use as is
    if (cleaned.startsWith('52')) {
      return cleaned;
    }
    
    // If it's a 10-digit Mexican number, add country code
    if (cleaned.length === 10) {
      return `52${cleaned}`;
    }
    
    // If it starts with 1 and is 11 digits, it might be US/Canada
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      return cleaned;
    }
    
    // Default: assume it's a Mexican number and add country code
    return `52${cleaned}`;
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();
