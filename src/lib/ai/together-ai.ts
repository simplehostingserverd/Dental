interface TogetherAIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface TogetherAIResponse {
	choices: Array<{
		message: {
			content: string;
			role: string;
		};
	}>;
}

export class TogetherAIService {
	private apiKey: string;
	private baseUrl = 'https://api.together.xyz/v1';

	constructor() {
		this.apiKey = process.env.TOGETHERAI_API_KEY || '';
		if (!this.apiKey) {
			throw new Error('TOGETHERAI_API_KEY is not set');
		}
	}

	async generateResponse(messages: TogetherAIMessage[]): Promise<string> {
		try {
			const response = await fetch(`${this.baseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'meta-llama/Llama-2-7b-chat-hf',
					messages: messages,
					max_tokens: 512,
					temperature: 0.7,
					top_p: 0.7,
					top_k: 50,
					repetition_penalty: 1,
					stop: ['<|eot_id|>'],
				}),
			});

			if (!response.ok) {
				throw new Error(`TogetherAI API error: ${response.status}`);
			}

			const data: TogetherAIResponse = await response.json();
			return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
		} catch (error) {
			console.error('TogetherAI API error:', error);
			return 'I apologize, but I am experiencing technical difficulties. Please try again later or contact our support team.';
		}
	}

	async generateHelpResponse(userMessage: string, context?: string): Promise<string> {
		const systemMessage: TogetherAIMessage = {
			role: 'system',
			content: `You are a helpful customer support assistant for Cognident, a dental practice management software. 
			You help users with questions about:
			- Scheduling appointments
			- Managing patient records
			- Billing and insurance
			- Practice settings
			- Technical support
			- General software usage
			
			Be friendly, professional, and provide clear, actionable answers. If you don't know something specific about the software, 
			direct users to contact support at info@cognident.org or call +1-956-357-5588.
			
			${context ? `Additional context: ${context}` : ''}
			
			Keep responses concise but helpful.`
		};

		const userMessageObj: TogetherAIMessage = {
			role: 'user',
			content: userMessage
		};

		return this.generateResponse([systemMessage, userMessageObj]);
	}
}
