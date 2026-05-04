# Pratinik AI Chatbot - GOD Level Implementation

A high-performance, aesthetically stunning AI Chatbot system featuring a FastAPI backend and a Next.js (React) frontend with "GOD Level" Framer Motion animations.

## 🚀 Features
- **Intelligent NLP**: Python-powered intent recognition using TF-IDF and Logistic Regression.
- **GOD Level Animations**: Fluid spring physics, mouse-tracking auras, and staggered reveals using Framer Motion.
- **Dynamic Streaming**: ChatGPT-like word-by-word text streaming for AI responses.
- **Success Celebrations**: Interactive confetti bursts upon successful issue resolution.
- **Responsive Design**: Mobile-friendly, accessible light-themed UI.
- **FastAPI Integration**: Robust, high-speed backend serving predictions in milliseconds.

## 📂 Project Structure
```text
Pratinik Infotech/
├── src/                # Backend source code (FastAPI)
├── data/               # Training data (intents.json)
├── models/             # Trained ML model artifacts
├── frontend/           # Next.js React application
└── requirements.txt    # Python dependencies
```

## 🛠️ Setup & Installation

### Backend
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Train the model:
   ```bash
   python src/train.py
   ```
3. Run the API:
   ```bash
   uvicorn src.app_api:app --reload --port 8000
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🎨 UI & UX Highlights
- **Liquid Glass Buttons**: Custom-filtered SVG buttons for a premium feel.
- **Framer Motion**: Advanced spring-based transitions for the chat panel and messages.
- **Confetti**: Triggered on successful intents (order tracking, refunds).

## 📄 License
MIT
