# Pathora – AI-Powered Personalized Career Guidance

Pathora is an AI-powered career guidance platform designed to help students and early-career individuals understand their strengths, explore suitable career opportunities, identify skill gaps, and plan their next steps.

Unlike a resume-only approach, Pathora focuses on the user's overall profile, including education, skills, interests, and career goals. Resume upload is optional.

## 🌐 Live Demo

[Explore Pathora](https://pathora-taupe.vercel.app/)

## ✨ Key Features

- **Profile-Based Career Guidance:** Analyze educational background, skills, interests, and career goals.
- **Optional Resume Analysis:** Upload a resume to provide additional information for career guidance.
- **Strength Identification:** Help users understand their strengths and areas of interest.
- **Skill Gap Insights:** Identify skills that may need improvement in relation to career goals.
- **Career Exploration:** Explore possible career directions based on the user's profile.
- **Personalized Roadmap:** Generate structured guidance to help users plan their next steps.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js
- Gemini API

### Additional Tools
- Git and GitHub
- Vercel – Frontend deployment
- Render – Backend deployment

## ⚙️ How It Works

1. The user selects their education level.
2. The user enters relevant details such as stream, subjects, skills, interests, and career goals.
3. The user can optionally upload a resume.
4. The backend processes the submitted information and uses the Gemini API for AI-powered analysis.
5. Pathora presents career guidance and a personalized roadmap based on the submitted profile.

## 🏗️ Project Structure

```text
Pathora/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── features.md
│   ├── project_proposal.md
│   ├── roadmap.md
│   ├── srs.md
│   ├── tech_stack.md
│   └── user_flow.md
│
├── .gitignore
└── README.md
```

## 🚀 Running the Project Locally

### Prerequisites
- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/mishratanmay164-cell/Pathora.git
cd Pathora
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Environment Variables

The backend requires a Gemini API key.

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used for Gemini integration |
| `NODE_ENV` | Application environment |

**Security:** Never commit your `.env` file or expose your API key publicly.

## ☁️ Deployment

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Render.

Live application: https://pathora-taupe.vercel.app/

## 🔮 Future Scope

Potential improvements include:
- Persistent user accounts and database integration.
- Saving career roadmaps and tracking progress.
- More detailed career and skill recommendations.
- Integration of relevant learning resources and certifications.
- Career insights informed by changing industry trends.
- Improved analytics and user experience.

## 🎯 Project Objective

Pathora aims to make career planning more structured and accessible by connecting a user's current profile with possible career directions and actionable next steps.

---

**Pathora – Your Profile, Your Potential, Your Path.**