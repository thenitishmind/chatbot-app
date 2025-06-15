const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.systemPrompt = {
      role: "system",
      content: `You are a helpful business loan assistant. You help users understand different types of business loans, 
      eligibility criteria, application processes, and provide general guidance about business financing. 
      You should be professional, knowledgeable, and focused on providing accurate financial information.
      However, you should not provide specific financial advice or make promises about loan approval.`
    };
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      const messages = [
        this.systemPrompt,
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];

      const response = await this.anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: messages.map(msg => ({
          role: msg.role === 'system' ? 'assistant' : msg.role,
          content: msg.content
        })),
        temperature: 0.7
      });

      return {
        success: true,
        message: response.content[0].text,
        error: null
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        success: false,
        message: null,
        error: 'Failed to generate response. Please try again.'
      };
    }
  }

  async detectIntent(message) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Analyze the user message and return ONLY ONE of these intents: LOAN_INQUIRY, APPLICATION_HELP, RATE_CHECK, DOCUMENT_REQUEST, GENERAL_QUESTION"
          },
          { role: "user", content: message }
        ],
        max_tokens: 20,
        temperature: 0.3
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Intent Detection Error:', error);
      return 'GENERAL_QUESTION';
    }
  }

  async calculateLoanDetails(amount, term, rate) {
    try {
      const monthlyRate = (rate / 100) / 12;
      const numberOfPayments = term * 12;
      const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - amount;

      return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        apr: rate.toFixed(2)
      };
    } catch (error) {
      console.error('Loan Calculation Error:', error);
      return null;
    }
  }

  getFallbackResponse() {
    return {
      id: Date.now(),
      text: "I apologize, but I'm having trouble processing your request at the moment. Please try again or ask a different question.",
      sender: 'bot',
      timestamp: new Date(),
      metadata: {
        intent: 'ERROR',
        confidence: 0,
        isError: true
      }
    };
  }

  async analyzeSentiment(message) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Analyze the sentiment of the message and return ONLY ONE word: POSITIVE, NEGATIVE, or NEUTRAL"
          },
          { role: "user", content: message }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      return 'NEUTRAL';
    }
  }
}

module.exports = new AIService(); 