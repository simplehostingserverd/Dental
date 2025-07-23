import { IntegrationManager } from "@/lib/integrations/integration-manager";
import { AutoTranslator } from "@/lib/translation/auto-translator";

interface TranslationCache {
	[key: string]: {
		translation: string;
		timestamp: number;
		source: "static" | "api" | "fallback";
	};
}

interface SmartTranslationOptions {
	practiceId: string;
	targetLanguage: string;
	useCache: boolean;
	fallbackToStatic: boolean;
	maxCacheAge: number; // in milliseconds
}

export class SmartTranslationService {
	private cache: TranslationCache = {};
	private autoTranslator: AutoTranslator;
	private options: SmartTranslationOptions;

	// Static translations for medical accuracy
	private static readonly MEDICAL_TERMS: Record<
		string,
		Record<string, string>
	> = {
		es: {
			// Dental procedures - high accuracy required
			"root canal": "endodoncia",
			crown: "corona dental",
			filling: "empaste",
			extraction: "extracción dental",
			cleaning: "limpieza dental",
			whitening: "blanqueamiento dental",
			implant: "implante dental",
			bridge: "puente dental",
			dentures: "dentaduras postizas",
			veneers: "carillas dentales",
			orthodontics: "ortodoncia",
			braces: "brackets",
			retainer: "retenedor",
			"night guard": "protector nocturno",
			periodontics: "periodoncia",
			gingivitis: "gingivitis",
			periodontitis: "periodontitis",
			plaque: "placa bacteriana",
			tartar: "sarro",
			cavity: "caries",
			abscess: "absceso dental",
			toothache: "dolor de muelas",
			sensitivity: "sensibilidad dental",
			"gum disease": "enfermedad de las encías",
			"oral surgery": "cirugía oral",
			"wisdom teeth": "muelas del juicio",
			anesthesia: "anestesia",
			"local anesthesia": "anestesia local",
			sedation: "sedación",
			"nitrous oxide": "óxido nitroso",
			"x-ray": "radiografía",
			"panoramic x-ray": "radiografía panorámica",
			bitewing: "radiografía de aleta de mordida",
			"intraoral camera": "cámara intraoral",
			"dental chart": "odontograma",
			"treatment plan": "plan de tratamiento",
			diagnosis: "diagnóstico",
			prognosis: "pronóstico",
			"follow-up": "seguimiento",
			recall: "cita de control",
			emergency: "emergencia dental",
			"urgent care": "atención urgente",
			consultation: "consulta",
			examination: "examen dental",
			prophylaxis: "profilaxis",
			"fluoride treatment": "tratamiento con flúor",
			sealants: "selladores dentales",
			composite: "resina compuesta",
			amalgam: "amalgama",
			porcelain: "porcelana",
			ceramic: "cerámica",
			"gold crown": "corona de oro",
			zirconia: "circonia",
			titanium: "titanio",
			"bone graft": "injerto óseo",
			"sinus lift": "elevación de seno",
			"gum graft": "injerto de encía",
			scaling: "raspado",
			"root planing": "alisado radicular",
			"deep cleaning": "limpieza profunda",
			"maintenance cleaning": "limpieza de mantenimiento",
			"teeth whitening": "blanqueamiento dental",
			"cosmetic dentistry": "odontología cosmética",
			"restorative dentistry": "odontología restaurativa",
			"preventive dentistry": "odontología preventiva",
			"pediatric dentistry": "odontología pediátrica",
			"geriatric dentistry": "odontología geriátrica",
			"special needs dentistry": "odontología para necesidades especiales",
			"tmj disorder": "trastorno de la ATM",
			"sleep apnea": "apnea del sueño",
			"oral cancer screening": "detección de cáncer oral",
			"bad breath": "mal aliento",
			"dry mouth": "boca seca",
			grinding: "bruxismo",
			clenching: "apretamiento dental",
			malocclusion: "maloclusión",
			overbite: "sobremordida",
			underbite: "submordida",
			crossbite: "mordida cruzada",
			"open bite": "mordida abierta",
			crowding: "apiñamiento dental",
			spacing: "espaciamiento dental",
			"impacted tooth": "diente impactado",
			eruption: "erupción dental",
			"primary teeth": "dientes primarios",
			"permanent teeth": "dientes permanentes",
			"baby teeth": "dientes de leche",
			"milk teeth": "dientes de leche",
			"deciduous teeth": "dientes deciduos",
			"adult teeth": "dientes de adulto",
			incisor: "incisivo",
			canine: "canino",
			premolar: "premolar",
			molar: "molar",
			"wisdom tooth": "muela del juicio",
			"upper jaw": "mandíbula superior",
			"lower jaw": "mandíbula inferior",
			maxilla: "maxilar",
			mandible: "mandíbula",
			gums: "encías",
			gingiva: "encía",
			tongue: "lengua",
			palate: "paladar",
			"soft palate": "paladar blando",
			"hard palate": "paladar duro",
			uvula: "úvula",
			tonsils: "amígdalas",
			throat: "garganta",
			saliva: "saliva",
			enamel: "esmalte dental",
			dentin: "dentina",
			pulp: "pulpa dental",
			root: "raíz dental",
			"crown (tooth part)": "corona del diente",
			"neck (tooth part)": "cuello del diente",
			"periodontal ligament": "ligamento periodontal",
			"alveolar bone": "hueso alveolar",
			cementum: "cemento dental",
			nerve: "nervio",
			"blood vessel": "vaso sanguíneo",
			infection: "infección",
			inflammation: "inflamación",
			swelling: "hinchazón",
			bleeding: "sangrado",
			pain: "dolor",
			discomfort: "molestia",
			tenderness: "sensibilidad al tacto",
			numbness: "entumecimiento",
			tingling: "hormigueo",
			"burning sensation": "sensación de ardor",
			"metallic taste": "sabor metálico",
			"bitter taste": "sabor amargo",
			"loss of taste": "pérdida del gusto",
			"difficulty chewing": "dificultad para masticar",
			"difficulty swallowing": "dificultad para tragar",
			"jaw pain": "dolor de mandíbula",
			"jaw clicking": "chasquido de mandíbula",
			"jaw locking": "bloqueo de mandíbula",
			headache: "dolor de cabeza",
			earache: "dolor de oído",
			"neck pain": "dolor de cuello",
			"facial pain": "dolor facial",
			"sinus pressure": "presión sinusal",
			"allergic reaction": "reacción alérgica",
			medication: "medicamento",
			antibiotic: "antibiótico",
			"pain reliever": "analgésico",
			"anti-inflammatory": "antiinflamatorio",
			prescription: "receta médica",
			dosage: "dosis",
			"side effects": "efectos secundarios",
			contraindications: "contraindicaciones",
			"medical history": "historial médico",
			"dental history": "historial dental",
			"family history": "antecedentes familiares",
			allergies: "alergias",
			"current medications": "medicamentos actuales",
			"previous surgeries": "cirugías previas",
			"chronic conditions": "condiciones crónicas",
			diabetes: "diabetes",
			"heart disease": "enfermedad cardíaca",
			"high blood pressure": "presión arterial alta",
			pregnancy: "embarazo",
			breastfeeding: "lactancia materna",
			smoking: "fumar",
			"alcohol consumption": "consumo de alcohol",
			"drug use": "uso de drogas",
			insurance: "seguro dental",
			copay: "copago",
			deductible: "deducible",
			coverage: "cobertura",
			"pre-authorization": "preautorización",
			claim: "reclamo de seguro",
			estimate: "estimado de costos",
			"payment plan": "plan de pagos",
			financing: "financiamiento",
			discount: "descuento",
			promotion: "promoción",
			appointment: "cita",
			"check-up": "revisión",
			"cleaning appointment": "cita de limpieza",
			"treatment appointment": "cita de tratamiento",
			"follow-up appointment": "cita de seguimiento",
			"emergency appointment": "cita de emergencia",
			cancellation: "cancelación",
			rescheduling: "reprogramación",
			confirmation: "confirmación",
			reminder: "recordatorio",
			"no-show": "no se presentó",
			"late arrival": "llegada tardía",
			"early arrival": "llegada temprana",
			"waiting time": "tiempo de espera",
			"treatment time": "tiempo de tratamiento",
			"recovery time": "tiempo de recuperación",
			"healing time": "tiempo de cicatrización",
			"post-operative care": "cuidado postoperatorio",
			"pre-operative instructions": "instrucciones preoperatorias",
			"aftercare instructions": "instrucciones de cuidado posterior",
			"oral hygiene": "higiene oral",
			brushing: "cepillado",
			flossing: "uso de hilo dental",
			mouthwash: "enjuague bucal",
			toothbrush: "cepillo de dientes",
			toothpaste: "pasta dental",
			"dental floss": "hilo dental",
			"interdental brush": "cepillo interdental",
			"water flosser": "irrigador dental",
			"tongue scraper": "raspador de lengua",
			"diet recommendations": "recomendaciones dietéticas",
			"sugar intake": "consumo de azúcar",
			"acidic foods": "alimentos ácidos",
			calcium: "calcio",
			"vitamin D": "vitamina D",
			fluoride: "flúor",
			xylitol: "xilitol",
			probiotics: "probióticos",
			"nutrition counseling": "asesoramiento nutricional",
		},
	};

	constructor(options: SmartTranslationOptions) {
		this.options = options;
		this.autoTranslator = AutoTranslator.getInstance(options.practiceId);
		this.loadCacheFromStorage();
	}

	/**
	 * Main translation method with smart fallback
	 */
	async translate(text: string): Promise<string> {
		if (!text || text.trim() === "") return text;
		if (this.options.targetLanguage === "en") return text; // No translation needed

		// Check cache first
		if (this.options.useCache) {
			const cached = this.getCachedTranslation(text);
			if (cached) return cached;
		}

		// Try static medical terms first (highest accuracy)
		const staticTranslation = this.getStaticTranslation(text);
		if (staticTranslation) {
			this.cacheTranslation(text, staticTranslation, "static");
			return staticTranslation;
		}

		// Try API translation
		try {
			const apiTranslation = await this.autoTranslator.translate(
				text,
				this.options.targetLanguage,
			);
			this.cacheTranslation(text, apiTranslation.translatedText, "api");
			return apiTranslation.translatedText;
		} catch (error) {
			console.warn("API translation failed:", error);
		}

		// Fallback to static dictionary if enabled
		if (this.options.fallbackToStatic) {
			const fallbackTranslation = await this.getFallbackTranslation(text);
			if (fallbackTranslation) {
				this.cacheTranslation(text, fallbackTranslation, "fallback");
				return fallbackTranslation;
			}
		}

		// Return original text if all else fails
		return text;
	}

	/**
	 * Batch translate multiple texts efficiently
	 */
	async batchTranslate(texts: string[]): Promise<string[]> {
		const results: string[] = [];
		const uncachedTexts: { text: string; index: number }[] = [];

		// First pass: check cache and static translations
		for (let i = 0; i < texts.length; i++) {
			const text = texts[i];

			if (!text || text.trim() === "" || this.options.targetLanguage === "en") {
				results[i] = text || "";
				continue;
			}

			// Check cache
			if (this.options.useCache) {
				const cached = this.getCachedTranslation(text);
				if (cached) {
					results[i] = cached;
					continue;
				}
			}

			// Check static translations
			const staticTranslation = this.getStaticTranslation(text);
			if (staticTranslation) {
				results[i] = staticTranslation;
				this.cacheTranslation(text, staticTranslation, "static");
				continue;
			}

			// Mark for API translation
			uncachedTexts.push({ text, index: i });
		}

		// Second pass: API translation for remaining texts
		if (uncachedTexts.length > 0) {
			try {
				const apiResults = await this.autoTranslator.batchTranslate(
					uncachedTexts.map((item) => item.text),
					this.options.targetLanguage,
				);

				for (let i = 0; i < uncachedTexts.length; i++) {
					const item = uncachedTexts[i];
					if (!item) continue;
					const { index, text } = item;
					const translation = apiResults[i]?.translatedText || text;
					results[index] = translation;
					this.cacheTranslation(text, translation, "api");
				}
			} catch (error) {
				console.warn("Batch API translation failed:", error);

				// Fallback for failed API translations
				for (const { text, index } of uncachedTexts) {
					if (this.options.fallbackToStatic) {
						const fallbackTranslation = await this.getFallbackTranslation(text);
						results[index] = fallbackTranslation || text;
						if (fallbackTranslation) {
							this.cacheTranslation(text, fallbackTranslation, "fallback");
						}
					} else {
						results[index] = text;
					}
				}
			}
		}

		return results;
	}

	/**
	 * Get static translation for medical terms
	 */
	private getStaticTranslation(text: string): string | null {
		const lowerText = text.toLowerCase().trim();
		const staticTerms =
			SmartTranslationService.MEDICAL_TERMS[this.options.targetLanguage];

		if (!staticTerms) return null;

		// Direct match
		if (staticTerms[lowerText]) {
			return staticTerms[lowerText];
		}

		// Partial match for compound terms
		for (const [term, translation] of Object.entries(staticTerms)) {
			if (lowerText.includes(term) || term.includes(lowerText)) {
				return translation;
			}
		}

		return null;
	}

	/**
	 * Get fallback translation using basic dictionary
	 */
	private async getFallbackTranslation(text: string): Promise<string | null> {
		// Use the public translate method from AutoTranslator
		try {
			const fallback = await this.autoTranslator.translate(
				text,
				this.options.targetLanguage,
			);
			return fallback.translatedText;
		} catch {
			return null;
		}
	}

	/**
	 * Cache management
	 */
	private getCachedTranslation(text: string): string | null {
		const cacheKey = `${text}-${this.options.targetLanguage}`;
		const cached = this.cache[cacheKey];

		if (!cached) return null;

		// Check if cache is expired
		if (Date.now() - cached.timestamp > this.options.maxCacheAge) {
			delete this.cache[cacheKey];
			return null;
		}

		return cached.translation;
	}

	private cacheTranslation(
		text: string,
		translation: string,
		source: "static" | "api" | "fallback",
	): void {
		const cacheKey = `${text}-${this.options.targetLanguage}`;
		this.cache[cacheKey] = {
			translation,
			timestamp: Date.now(),
			source,
		};

		// Persist to localStorage for client-side caching
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("translation-cache", JSON.stringify(this.cache));
			} catch (error) {
				console.warn("Failed to persist translation cache:", error);
			}
		}
	}

	private loadCacheFromStorage(): void {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem("translation-cache");
				if (stored) {
					this.cache = JSON.parse(stored);
				}
			} catch (error) {
				console.warn("Failed to load translation cache:", error);
				this.cache = {};
			}
		}
	}

	/**
	 * Clear expired cache entries
	 */
	clearExpiredCache(): void {
		const now = Date.now();
		for (const [key, value] of Object.entries(this.cache)) {
			if (now - value.timestamp > this.options.maxCacheAge) {
				delete this.cache[key];
			}
		}
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats() {
		const entries = Object.values(this.cache);
		return {
			totalEntries: entries.length,
			staticEntries: entries.filter((e) => e.source === "static").length,
			apiEntries: entries.filter((e) => e.source === "api").length,
			fallbackEntries: entries.filter((e) => e.source === "fallback").length,
			cacheSize: JSON.stringify(this.cache).length,
		};
	}

	/**
	 * Preload common translations
	 */
	async preloadCommonTranslations(): Promise<void> {
		const commonTerms = [
			"appointment",
			"patient",
			"treatment",
			"cleaning",
			"examination",
			"consultation",
			"emergency",
			"follow-up",
			"insurance",
			"payment",
			"schedule",
			"cancel",
			"confirm",
			"reschedule",
			"reminder",
		];

		await this.batchTranslate(commonTerms);
	}

	/**
	 * Check if translation service is available
	 */
	async isServiceAvailable(): Promise<boolean> {
		try {
			// Check if any translation integration is active
			const googleTranslate = await IntegrationManager.getIntegration(
				this.options.practiceId,
				"google_translate",
				"translation",
			);

			const azureTranslator = await IntegrationManager.getIntegration(
				this.options.practiceId,
				"azure_translator",
				"translation",
			);

			return !!(googleTranslate?.isActive || azureTranslator?.isActive);
		} catch {
			return false;
		}
	}
}
