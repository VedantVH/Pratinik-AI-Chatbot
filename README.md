# 🤖 Pratinik AI: Advanced NLP-Powered Chatbot System 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776ab?style=for-the-badge&logo=python)](https://www.python.org/)

Pratinik AI is a high-performance, full-stack chatbot solution featuring a Python-based NLP core and a modern Next.js frontend. It leverages advanced motion physics and real-time streaming to deliver a seamless, low-latency user experience.

---

## 🛠️ Key Technical Features

This system integrates several advanced engineering patterns to optimize performance and user engagement:

*   **⚡ High-Performance NLP Core**: Implements a Scikit-Learn pipeline (TF-IDF + Logistic Regression) for low-latency intent classification with a configurable confidence threshold.
*   **🌀 Advanced Motion Physics**: Utilizes `framer-motion` spring-based animation logic for fluid layout transitions and interactive UI elements.
*   **🖱️ Mouse-Tracking Reactive Aura**: A high-performance background layer that responds to cursor coordinates with smooth, spring-damped transitions.
*   **📨 Word-by-Word Response Streaming**: Implements an asynchronous word-streaming component to simulate real-time AI response delivery.
*   **⚙️ FastAPI Integration**: A lightweight, asynchronous Python backend designed for high-concurrency inference and health monitoring.
*   **🎈 Interactive Feedback**: Integrated `canvas-confetti` triggers tied to specific successful intent resolution (e.g., order tracking).

---

## 🏗️ Architecture Overview

The project is architected as a decoupled micro-service system:

| Layer | Technology | Engineering Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS | High-performance, SEO-optimized UI and state management |
| **Animation** | Framer Motion | Procedural spring physics and layout-level transitions |
| **Backend** | FastAPI (Python) | RESTful API for NLP model inference and health checks |
| **ML Engine** | Scikit-Learn, NLTK | Natural Language Processing and Intent Classification |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/VedantVH/Pratinik-AI-Chatbot.git
cd Pratinik-AI-Chatbot
```

### 2. Backend Environment Setup 🐍
```bash
# Install dependencies
pip install -r requirements.txt

# Execute model training pipeline
python src/train.py

# Launch the FastAPI production-grade server
uvicorn src.app_api:app --reload --port 8000
```

### 3. Frontend Development Setup ⚛️
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```bash
Pratinik-AI-Chatbot/
├── data/               # Raw intent datasets (JSON)
├── src/                # Backend API and training logic
├── models/             # Serialized model artifacts (.pkl)
└── frontend/           # Next.js application, components, and UI logic
```

---

## 🤝 Contribution Guidelines

This project follows modern clean-code principles. Contributions to the NLP intent engine or the animation system are welcome via pull requests.

---

## 📄 License

Developed by **VedantVH**. Licensed under the **MIT License**.

---

> *"Engineering high-fidelity interactions through code."* 🚀
