# backend/rag.py
import os
from typing import List, Dict
from backend.safety import analyze_risk, HELPLINE_CATEGORIES
from google.oauth2 import service_account
import vertexai
from vertexai.preview import rag
from vertexai.generative_models import GenerativeModel

# === CONFIG ===
PROJECT_ID = "ai-youth-471917"
LOCATION = "us-east4"
CORPUS_NAME = "projects/ai-youth-471917/locations/us-east4/ragCorpora/1441151880758558720"

# === AUTH ===
SERVICE_ACCOUNT_FILE = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") or "ai-youth-471917-1a4546328712.json"
creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

# Init Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=creds)

# RAG resource
rag_resource = rag.RagResource(rag_corpus=CORPUS_NAME)

# -------------------------
# RAG Search
# -------------------------
def search_query(query: str, top_k: int = 3) -> List[Dict]:
    """Run retrieval query against RAG corpus"""
    try:
        response = rag.retrieval_query(
            rag_resources=[rag_resource],
            text=query,
            rag_retrieval_config=rag.RagRetrievalConfig(top_k=top_k),
        )
        return [
            {"text": ctx.text, "score": ctx.score, "source": ctx.source_uri}
            for ctx in response.contexts.contexts
        ]
    except Exception as e:
        print("❌ RAG search error:", e)
        return []

def build_context(results: List[Dict]) -> str:
    """Combine retrieved docs into one context string"""
    return "\n\n".join([r.get("text", "") for r in results])

# -------------------------
# Safety + RAG + Helplines
# -------------------------
def query_with_safety(query: str, top_k: int = 3) -> Dict:
    """
    Returns dict:
      - risk: {...}
      - priority: "helpline"|"normal"
      - helpline_results: list (only present if high risk)
      - context: string (RAG context)
    """
    risk = analyze_risk(query)
    results = search_query(query, top_k=top_k)
    context = build_context(results)

    # Include helplines only if high risk
    helplines = HELPLINE_CATEGORIES.get(risk.get("category"), HELPLINE_CATEGORIES["general"])
    output = {
        "risk": risk,
        "priority": "helpline" if risk.get("risk") == "high" else "normal",
        "context": context
    }
    if risk.get("risk") == "high":
        output["helpline_results"] = helplines

    return output

# -------------------------
# LLM Generation
# -------------------------
def generate_response_with_llm(user_query: str, context: str) -> str:
    """
    Generate a compassionate response. Do NOT include phone numbers;
    backend will append helplines when needed.
    """
    try:
        model = GenerativeModel("gemini-2.5-flash")

        prompt = (
        "You are a compassionate, warm, and non-judgmental mental health assistant. "
        "Speak like a calm, caring friend who listens first — not like a clinician.\n\n"

        f"Context (helpful details or past conversation): {context}\n\n"
        f"User query: {user_query}\n\n"

        "Tone & style:\n"
        "- Use gentle, plain language and a warm voice.\n"
        "- Validate feelings (e.g. \"That sounds really hard\", \"I hear how much this hurts\").\n"
        "- Keep sentences short and easy to read. Be human, not clinical.\n"
        "- Be empathetic, patient, and respectful.\n\n"

        "What to include (if relevant):\n"
        "- Acknowledge & normalize the feeling briefly (don't minimize).\n"
        "- Offer 1–2 practical coping suggestions (grounding, breathing, small steps).\n"
        "- If the user is distressed, invite a next small step (\"Would you like to try a quick breathing exercise?\").\n"
        "- Encourage reaching out to a trusted person or a professional, without giving medical diagnoses.\n"
        "- If the user indicates self-harm or suicidal intent, be direct about safety: name that you are worried, ask if they are in immediate danger, and tell them to contact emergency services or a helpline. (Do NOT print phone numbers—the system will attach local helpline numbers.)\n\n"

        "Formatting & brevity:\n"
        "- Keep replies concise (aim for 2–6 short paragraphs).\n"
        "- End with a gentle offer to continue the conversation (e.g. \"I’m here to listen — do you want to tell me more?\").\n\n"

        "Safety guardrails:\n"
        "- Never give medical or psychiatric diagnoses or attempt crisis triage beyond advising immediate help.\n"
        "- Avoid giving prescriptive instructions that could cause harm.\n"
        "- If uncertain, err on the side of urging the user to seek immediate help or call emergency services.\n\n"

        "Now generate a single empathetic, supportive reply following the above guidelines."
    )

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("❌ LLM generation error:", e)
        return "Sorry, I am unable to generate a response right now. Please try again later."
