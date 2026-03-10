# AI-Based Skill Gap Analysis System

Full-stack web application for analyzing skill gaps and generating personalized learning roadmaps using OpenAI.

## Tech Stack

**Frontend:** React (Vite), Plain CSS, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**AI:** OpenAI API

## Project Structure

```
/client                 # React frontend
  /src
    /components        # React components
    /services          # API service layer
    /styles            # CSS files
/server                # Node.js backend
  /models              # Mongoose models
  /routes              # Express routes
  /controllers         # Business logic
  /config              # Configuration files
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB installed and running
- OpenAI API key

### Backend Setup

1. Navigate to server folder:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Open `.env` file
- Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
- Update MongoDB URI if needed (default: `mongodb://localhost:27017/skillgap`)

4. Seed the database with job roles:
```bash
node seedJobRoles.js
```

5. Start the server:
```bash
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on http://localhost:5173

## File Explanations

### Backend Files

- **server.js** - Main entry point, initializes Express app and connects routes
- **config/db.js** - MongoDB connection configuration
- **config/openai.js** - OpenAI client setup
- **models/User.js** - User schema (stores user info and skills)
- **models/JobRole.js** - Job role schema (stores predefined roles and required skills)
- **models/LearningPath.js** - Learning path schema (stores generated roadmaps)
- **controllers/analysisController.js** - Handles skill analysis and AI roadmap generation
- **controllers/jobRoleController.js** - Handles job role CRUD operations
- **routes/analysisRoutes.js** - Routes for skill analysis endpoints
- **routes/jobRoleRoutes.js** - Routes for job role endpoints
- **seedJobRoles.js** - Script to populate database with initial job roles

### Frontend Files

- **src/main.jsx** - React app entry point
- **src/App.jsx** - Main app component, manages state
- **src/components/SkillForm.jsx** - Form for user input (skills, target role, resume)
- **src/components/Results.jsx** - Displays analysis results and roadmap
- **src/services/api.js** - Axios service for API calls
- **src/App.css** - Main app styles
- **src/styles/SkillForm.css** - Form component styles
- **src/styles/Results.css** - Results component styles

## API Endpoints

- `GET /api/job-roles` - Get all job roles
- `POST /api/analyze` - Analyze skills and generate roadmap
- `GET /api/learning-path/:id` - Get specific learning path

## Usage

1. Enter your name and email
2. Add your current skills (comma separated)
3. Select target job role
4. Optionally paste resume text
5. Click "Analyze Skills"
6. View missing skills and personalized learning roadmap

## Notes

- Make sure MongoDB is running before starting the backend
- Get your OpenAI API key from https://platform.openai.com/api-keys
- The app uses GPT-3.5-turbo model for cost efficiency
