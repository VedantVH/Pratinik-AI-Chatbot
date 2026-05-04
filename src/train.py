import json
import pickle
import nltk
import pandas as pd
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()

def preprocess(text):
    tokens = nltk.word_tokenize(text.lower())
    return " ".join([lemmatizer.lemmatize(t) for t in tokens])

def load_intents(path='data/intents.json'):
    with open(path, 'r') as f:
        return json.load(f)

def prepare_data(intents):
    X, y = [], []
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            X.append(preprocess(pattern))
            y.append(intent['tag'])
    return X, y

def train():
    intents = load_intents()
    X, y = prepare_data(intents)

    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression(C=10, max_iter=200))
    ])
    model_pipeline.fit(X, y)

    with open('models/chatbot_model.pkl', 'wb') as f:
        pickle.dump(model_pipeline, f)
    with open('models/lemmatizer.pkl', 'wb') as f:
        pickle.dump(lemmatizer, f)
    with open('models/intents.pkl', 'wb') as f:
        pickle.dump(intents, f)

    print("✅ Model trained and saved to models/")

if __name__ == '__main__':
    train()
