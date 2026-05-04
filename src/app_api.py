"""
FastAPI backend for the AI Chatbot.
Run with: uvicorn src.app_api:app --reload --port 8000
"""
import json
import pickle
import random
import nltk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nltk.stem import WordNetLemmatizer

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

app = FastAPI(title="Pratinik Infotech Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifacts
with open('models/chatbot_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('models/lemmatizer.pkl', 'rb') as f:
    lemmatizer = pickle.load(f)
with open('models/intents.pkl', 'rb') as f:
    intents = pickle.load(f)

CONFIDENCE_THRESHOLD = 0.30
ESCALATION_KEYWORDS = ['human', 'agent', 'representative', 'escalate', 'person', 'supervisor']

def preprocess(text: str) -> str:
    tokens = nltk.word_tokenize(text.lower())
    return " ".join([lemmatizer.lemmatize(t) for t in tokens])

def get_response(tag: str) -> str:
    for intent in intents['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])
    return "I'm not sure how to help with that. Let me connect you with a human agent."

@app.get("/chat")
async def chat(query: str):
    if any(kw in query.lower() for kw in ESCALATION_KEYWORDS):
        return {
            "response": "🔄 Connecting you with a live support agent. Please hold...",
            "tag": "escalation",
            "confidence": 1.0
        }

    processed = preprocess(query)
    proba = model.predict_proba([processed])[0]
    max_conf = max(proba)
    predicted_tag = model.classes_[proba.argmax()]

    if max_conf < CONFIDENCE_THRESHOLD:
        return {
            "response": "I'm not sure I fully understood that. Could you rephrase? Or type 'agent' to speak with a human.",
            "tag": "fallback",
            "confidence": float(max_conf)
        }

    return {
        "response": get_response(predicted_tag),
        "tag": predicted_tag,
        "confidence": float(max_conf)
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Pratinik Infotech Chatbot API"}
