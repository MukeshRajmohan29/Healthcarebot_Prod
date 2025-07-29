

# CAPS Healthbot - Privacy-Aware AI Assistant

A full-stack web application featuring a privacy-aware CAPS Healthbot with a React frontend and Node.js backend. CAPS Healthbot is designed for healthcare use cases and follows HIPAA privacy measures.


## 🧠 Features

- **Healthcare Contexts**: Symptom checking, mental health support, and chronic care management
- **HIPAA Privacy Popup**: Registration page includes a required privacy acceptance checkbox with a popup showing official HIPAA privacy measures
- **AI-Powered Responses**: OpenAI GPT-4-turbo integration for intelligent healthcare conversations
- **Healthcare Context Enforcement**: CAPS Healthbot responses are always in healthcare context; non-healthcare questions are redirected
- **Session Management**: Deterministic session ID based on first name, last name, and date of birth; returning users get the same session ID
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components


## 🚀 Quick Start

### Prerequisites

- Vercel account
- OpenAI API key

### Installation & Deployment

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd CAPS Healthbot
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory and add your OpenAI API key and Neon database credentials:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PGHOST=ep-blue-credit-ae8ofa9q-pooler.c-2.us-east-2.aws.neon.tech
   PGDATABASE=neondb
   PGUSER=neondb_owner
   PGPASSWORD=npg_C7aTbOUP4wJo
   PGSSLMODE=require
   PGCHANNELBINDING=require
   ```

3. **Deploy to Vercel:**
   - Push your code to GitHub and import the repository in Vercel.
   - Vercel will automatically build and deploy both frontend (`/client`) and backend (`/api`).


## 📁 Project Structure

```
CAPS Healthbot/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   └── package.json
├── api/                    # Vercel serverless backend (Node.js)
├── src/                    # TypeScript/React components (optional, for advanced usage)
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Neon (Vercel) Database Configuration
PGHOST=ep-blue-credit-ae8ofa9q-pooler.c-2.us-east-2.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_C7aTbOUP4wJo
PGSSLMODE=require
PGCHANNELBINDING=require
```


### API Endpoints

- `POST /api/chat` - Send message to CAPS Healthbot
- `POST /api/chatlog` - Save chat session data

## 🏥 Healthcare Contexts

CAPS Healthbot operates strictly within healthcare contexts:

1. **Symptom Checking**: General health symptom assessment
2. **Mental Health Support**: Emotional and psychological support
3. **Chronic Care Management**: Long-term condition management

Non-healthcare questions are redirected to keep the conversation in context.

## 🔒 Privacy Communication

- **HIPAA Privacy Popup**: On registration, users must accept privacy measures. Clicking the link opens a popup with official HIPAA privacy information (not a new tab).
- **Privacy Type Dropdown Removed**: The privacy type dropdown has been removed for a streamlined experience.

## 🛠️ Development


### Available Scripts

- `npm run build` - Build the frontend for production
- `npm start` - Start the frontend locally

### Database

The application uses Neon (PostgreSQL) for storing chat logs. Database credentials are set in `.env` and managed by Vercel.


## 🔐 Security & Session Features

- Input sanitization and validation
- Protected API routes
- Environment variable protection
- Session-based context management
- Deterministic session ID: Based on first name, last name, and date of birth. Returning users get the same session ID on login or registration.


## 📝 License

MIT License - see LICENSE file for details.


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## ⚠️ Disclaimer

CAPS Healthbot is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.