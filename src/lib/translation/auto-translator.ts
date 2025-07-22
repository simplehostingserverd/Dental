import { IntegrationManager } from "@/lib/integrations/integration-manager";

export interface TranslationResult {
	translatedText: string;
	sourceLanguage: string;
	targetLanguage: string;
	confidence?: number;
}

export class AutoTranslator {
	private static instance: AutoTranslator;
	private practiceId: string;

	constructor(practiceId: string) {
		this.practiceId = practiceId;
	}

	static getInstance(practiceId: string): AutoTranslator {
		if (!AutoTranslator.instance) {
			AutoTranslator.instance = new AutoTranslator(practiceId);
		}
		return AutoTranslator.instance;
	}

	/**
	 * Translate text to Spanish using configured translation service
	 */
	async translateToSpanish(text: string): Promise<TranslationResult> {
		return this.translate(text, 'es');
	}

	/**
	 * Translate text to specified language
	 */
	async translate(text: string, targetLanguage: string = 'es'): Promise<TranslationResult> {
		// Get active translation integration
		const googleTranslate = await IntegrationManager.getIntegration(
			this.practiceId,
			'google_translate',
			'translation'
		);

		const azureTranslator = await IntegrationManager.getIntegration(
			this.practiceId,
			'azure_translator',
			'translation'
		);

		// Use Google Translate if available
		if (googleTranslate?.isActive) {
			return this.translateWithGoogle(text, targetLanguage, googleTranslate.config);
		}

		// Use Azure Translator if available
		if (azureTranslator?.isActive) {
			return this.translateWithAzure(text, targetLanguage, azureTranslator.config);
		}

		// Fallback to basic translation mapping
		return this.translateWithFallback(text, targetLanguage);
	}

	/**
	 * Google Translate implementation
	 */
	private async translateWithGoogle(
		text: string,
		targetLanguage: string,
		config: any
	): Promise<TranslationResult> {
		try {
			const response = await fetch(
				`https://translation.googleapis.com/language/translate/v2?key=${config.apiKey}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						q: text,
						target: targetLanguage,
						format: 'text'
					})
				}
			);

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error.message);
			}

			const translation = data.data.translations[0];

			return {
				translatedText: translation.translatedText,
				sourceLanguage: translation.detectedSourceLanguage || 'en',
				targetLanguage,
				confidence: 1.0
			};
		} catch (error) {
			console.error('Google Translate error:', error);
			return this.translateWithFallback(text, targetLanguage);
		}
	}

	/**
	 * Azure Translator implementation
	 */
	private async translateWithAzure(
		text: string,
		targetLanguage: string,
		config: any
	): Promise<TranslationResult> {
		try {
			const response = await fetch(
				`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`,
				{
					method: 'POST',
					headers: {
						'Ocp-Apim-Subscription-Key': config.subscriptionKey,
						'Ocp-Apim-Subscription-Region': config.region,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify([{ text }])
				}
			);

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error.message);
			}

			const translation = data[0].translations[0];

			return {
				translatedText: translation.text,
				sourceLanguage: data[0].detectedLanguage?.language || 'en',
				targetLanguage,
				confidence: data[0].detectedLanguage?.score || 1.0
			};
		} catch (error) {
			console.error('Azure Translator error:', error);
			return this.translateWithFallback(text, targetLanguage);
		}
	}

	/**
	 * Fallback translation using predefined mappings
	 */
	private translateWithFallback(text: string, targetLanguage: string): TranslationResult {
		if (targetLanguage !== 'es') {
			return {
				translatedText: text,
				sourceLanguage: 'en',
				targetLanguage,
				confidence: 0.5
			};
		}

		// Basic English to Spanish translations for common dental terms
		const translations: Record<string, string> = {
			// Navigation
			'Dashboard': 'Panel de Control',
			'Appointments': 'Citas',
			'Patients': 'Pacientes',
			'Charting': 'Gráficos Dentales',
			'Treatment Plans': 'Planes de Tratamiento',
			'Billing': 'Facturación',
			'Imaging': 'Imágenes',
			'Prescriptions': 'Recetas',
			'Messages': 'Mensajes',
			'Settings': 'Configuración',
			'Receptionist': 'Recepcionista',

			// Common actions
			'Save': 'Guardar',
			'Cancel': 'Cancelar',
			'Delete': 'Eliminar',
			'Edit': 'Editar',
			'Add': 'Agregar',
			'Search': 'Buscar',
			'Filter': 'Filtrar',
			'Export': 'Exportar',
			'Print': 'Imprimir',
			'Call': 'Llamar',
			'Email': 'Correo Electrónico',
			'SMS': 'SMS',

			// Appointment statuses
			'Scheduled': 'Programada',
			'Confirmed': 'Confirmada',
			'In Progress': 'En Progreso',
			'Completed': 'Completada',
			'Cancelled': 'Cancelada',
			'No Show': 'No Se Presentó',

			// Patient information
			'First Name': 'Nombre',
			'Last Name': 'Apellido',
			'Date of Birth': 'Fecha de Nacimiento',
			'Phone': 'Teléfono',
			'Email': 'Correo Electrónico',
			'Address': 'Dirección',
			'Insurance': 'Seguro',
			'Emergency Contact': 'Contacto de Emergencia',

			// Dental procedures
			'Cleaning': 'Limpieza',
			'Filling': 'Empaste',
			'Crown': 'Corona',
			'Root Canal': 'Endodoncia',
			'Extraction': 'Extracción',
			'Implant': 'Implante',
			'Whitening': 'Blanqueamiento',
			'Orthodontics': 'Ortodoncia',
			'Periodontics': 'Periodoncia',
			'Oral Surgery': 'Cirugía Oral',

			// Time and dates
			'Today': 'Hoy',
			'Tomorrow': 'Mañana',
			'Yesterday': 'Ayer',
			'This Week': 'Esta Semana',
			'Next Week': 'Próxima Semana',
			'This Month': 'Este Mes',
			'Next Month': 'Próximo Mes',

			// Common phrases
			'Good morning': 'Buenos días',
			'Good afternoon': 'Buenas tardes',
			'Good evening': 'Buenas noches',
			'Thank you': 'Gracias',
			'Please': 'Por favor',
			'You\'re welcome': 'De nada',
			'Excuse me': 'Disculpe',
			'I\'m sorry': 'Lo siento',

			// Medical terms
			'Pain': 'Dolor',
			'Swelling': 'Hinchazón',
			'Bleeding': 'Sangrado',
			'Sensitivity': 'Sensibilidad',
			'Infection': 'Infección',
			'Allergy': 'Alergia',
			'Medication': 'Medicamento',
			'Prescription': 'Receta',
			'Dosage': 'Dosis',
			'Instructions': 'Instrucciones'
		};

		// Simple word-by-word translation
		const words = text.split(' ');
		const translatedWords = words.map(word => {
			const cleanWord = word.replace(/[^\w]/g, '');
			return translations[cleanWord] || translations[word] || word;
		});

		return {
			translatedText: translatedWords.join(' '),
			sourceLanguage: 'en',
			targetLanguage: 'es',
			confidence: 0.7
		};
	}

	/**
	 * Detect language of text
	 */
	async detectLanguage(text: string): Promise<string> {
		// Simple language detection based on common words
		const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'han', 'fue', 'ser', 'está', 'todo', 'más', 'muy', 'puede', 'hasta', 'sin', 'sobre', 'también', 'me', 'ya', 'sí', 'porque'];
		
		const words = text.toLowerCase().split(/\s+/);
		const spanishWordCount = words.filter(word => spanishWords.includes(word)).length;
		const spanishRatio = spanishWordCount / words.length;

		return spanishRatio > 0.3 ? 'es' : 'en';
	}

	/**
	 * Batch translate multiple texts
	 */
	async batchTranslate(texts: string[], targetLanguage: string = 'es'): Promise<TranslationResult[]> {
		const results: TranslationResult[] = [];

		for (const text of texts) {
			try {
				const result = await this.translate(text, targetLanguage);
				results.push(result);
			} catch (error) {
				console.error('Batch translation error:', error);
				results.push({
					translatedText: text,
					sourceLanguage: 'en',
					targetLanguage,
					confidence: 0
				});
			}
		}

		return results;
	}
}
