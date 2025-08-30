# 📚 AI-Powered Collaborative Knowledge Hub (MERN + Gemini)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=flat&logo=google&logoColor=white)

A full-stack **MERN application** where teams can **create, manage, and search knowledge documents**, enhanced with **Gemini AI** for:

- 🔹 Intelligent summaries  
- 🔹 Auto-tagging  
- 🔹 Semantic search  
- 🔹 Team Q&A  

---

## 🚀 Features

- **Authentication & Roles**
  - Email/password authentication with JWT.
  - Roles: **User** (manage own docs) & **Admin** (manage all docs).

- **Documents Management**
  - Full CRUD operations.
  - Fields: `title`, `content`, `tags`, `summary`, `createdBy`, `createdAt`, `updatedAt`.
  - Gemini AI integration:
    - Auto-summary on creation.
    - Intelligent tag generation.
    - Semantic search across documents.
    - Q&A using team docs as context.

- **Search**
  - 🔍 Standard text-based filtering.  
  - 🤖 AI-powered semantic search.  

- **Frontend Pages**
  - Login / Register
  - Dashboard → Document listing
  - Add/Edit Document
  - Search Page (text & semantic results)
  - Team Q&A tab

- **UI Features**
  - Document cards showing: title, summary, tags, and author.
  - Actions: "Summarize with Gemini", "Generate Tags with Gemini".
  - Tag-based filtering (chip-style).
  - Team Activity Feed → last 5 edited docs + who edited them.

- **Optional Enhancements**
  - Document versioning (history modal with timestamps).

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **AI Integration:** Google Gemini API  
- **Authentication:** JWT  

---

## 📂 Project Structure

<img width="516" height="181" alt="image" src="https://github.com/user-attachments/assets/22a33a01-7a9d-4e7b-9137-9442af2b1693" />


---

## ⚙️ Setup Instructions

### 1️. Clone Repository

git clone https://github.com/your-username/ai-knowledge-hub.git
cd ai-knowledge-hub

### 2. Set Environment variable

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

### 3. Install Dependencies

#### Install server dependencies
cd server
npm install

#### Install client dependencies
cd ../client
npm install

### 4.Run Deployement Server
#### Run backend
cd server
npm run dev

#### Run frontend
cd ../client
npm start




