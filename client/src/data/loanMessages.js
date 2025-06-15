export const loanMessages = [
  // Property Loan Messages
  {
    id: 'prop1',
    title: 'Commercial Property Loan Inquiry',
    category: 'property',
    messages: [
      { sender: 'user', text: 'I need information about commercial property loans' },
      { sender: 'bot', text: 'I can help you with commercial property loans. What type of property are you looking to finance?' },
    ],
    timestamp: new Date('2024-03-10T10:00:00'),
    lastMessage: 'Information about commercial property loans'
  },
  {
    id: 'prop2',
    title: 'Property Development Loan',
    category: 'property',
    messages: [
      { sender: 'user', text: 'What are the requirements for a property development loan?' },
      { sender: 'bot', text: 'For property development loans, we typically look at: 1. Project feasibility 2. Your experience 3. Financial position 4. Project timeline. Would you like details about any of these?' },
    ],
    timestamp: new Date('2024-03-10T11:00:00'),
    lastMessage: 'Requirements for property development loans'
  },

  // Home Loan Messages
  {
    id: 'home1',
    title: 'First-Time Home Buyer Loan',
    category: 'home',
    messages: [
      { sender: 'user', text: 'I\'m a first-time home buyer. What loans are available?' },
      { sender: 'bot', text: 'As a first-time buyer, you have several options including: FHA loans, conventional loans with low down payments, and special first-time buyer programs. Would you like to learn more about any of these?' },
    ],
    timestamp: new Date('2024-03-09T15:00:00'),
    lastMessage: 'First-time home buyer loan options'
  },
  {
    id: 'home2',
    title: 'Home Renovation Loan',
    category: 'home',
    messages: [
      { sender: 'user', text: 'I need a loan for home renovations' },
      { sender: 'bot', text: 'For home renovations, we offer several loan types: 1. Home Equity Loans 2. Home Improvement Loans 3. Construction Loans. Which would you like to know more about?' },
    ],
    timestamp: new Date('2024-03-09T16:00:00'),
    lastMessage: 'Home renovation loan options'
  },

  // Shop Loan Messages
  {
    id: 'shop1',
    title: 'Retail Shop Loan',
    category: 'shop',
    messages: [
      { sender: 'user', text: 'I want to open a retail shop. What loans do you offer?' },
      { sender: 'bot', text: 'For retail shops, we offer: 1. Business startup loans 2. Commercial real estate loans 3. Equipment financing. Would you like details about any of these options?' },
    ],
    timestamp: new Date('2024-03-08T14:00:00'),
    lastMessage: 'Retail shop loan information'
  },
  {
    id: 'shop2',
    title: 'Shop Expansion Loan',
    category: 'shop',
    messages: [
      { sender: 'user', text: 'I need a loan to expand my existing shop' },
      { sender: 'bot', text: 'For shop expansion, we can offer: Business expansion loans, Working capital loans, or Equipment financing. What specific aspects of expansion are you looking to finance?' },
    ],
    timestamp: new Date('2024-03-08T14:30:00'),
    lastMessage: 'Shop expansion loan options'
  },

  // Business Loan Messages
  {
    id: 'biz1',
    title: 'Small Business Startup Loan',
    category: 'business',
    messages: [
      { sender: 'user', text: 'What are the requirements for a small business startup loan?' },
      { sender: 'bot', text: 'For small business startup loans, we look at: 1. Business plan 2. Credit score 3. Collateral 4. Industry experience. Would you like me to explain any of these requirements?' },
    ],
    timestamp: new Date('2024-03-07T09:00:00'),
    lastMessage: 'Small business startup loan requirements'
  },
  {
    id: 'biz2',
    title: 'Business Equipment Loan',
    category: 'business',
    messages: [
      { sender: 'user', text: 'I need financing for business equipment' },
      { sender: 'bot', text: 'We offer several equipment financing options: 1. Equipment loans 2. Leasing 3. Line of credit. What type of equipment are you looking to finance?' },
    ],
    timestamp: new Date('2024-03-07T10:00:00'),
    lastMessage: 'Business equipment financing options'
  }
]; 