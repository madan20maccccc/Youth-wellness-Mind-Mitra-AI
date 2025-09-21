# app.py
import os
import logging
import base64
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# This code reads the secret key from the "Repository secrets"
# on your Hugging Face Space.
credentials_json_str = os.environ.get("googlecredentialsjson")
if credentials_json_str:
    # Write the credentials to a temporary file for the Google libraries to use
    creds_path = "/tmp/google_creds.json"
    with open(creds_path, "w") as f:
        f.write(credentials_json_str)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
else:
    logging.error("CRITICAL: GOOGLECREDENTIALSJSON secret not found.")

from backend import rag, stt, tts, translation, safety

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Mental Health Chatbot - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Chat-Response"],
)

@app.get("/")
def home():
    return {"message": "Mental Health Backend running"}

# --- TEXT-TO-SPEECH ENDPOINT ---
@app.post("/tts")
async def text_to_speech(text: str = Form(...)):
    """
    A dedicated endpoint to convert a string of text into speech audio.
    It automatically detects the language of the text.
    """
    try:
        detected_lang = translation.detect_language(text)
        detected_lang = translation.normalize_lang_code(detected_lang)
        
        tts_lang = f"{detected_lang}-IN" if detected_lang != "en" else "en-IN"
        logging.info(f"TTS request for lang: {tts_lang}, text: '{text[:30]}...'")

        # --- THE FIX ---
        # The parameter name in tts.py is 'text', so we use that here.
        audio_content = tts.synthesize_text(text=text, language_code=tts_lang)
        # --- END OF FIX ---

        if not audio_content:
            return JSONResponse({"error": "Failed to generate audio."}, status_code=500)

        return StreamingResponse(iter([audio_content]), media_type="audio/mpeg")

    except Exception as e:
        logging.error(f"[tts_endpoint] error: {e}", exc_info=True)
        return JSONResponse({"error": "Internal server error during TTS."}, status_code=500)

@app.post("/chat_text")
async def chat_text(query: str = Form(...), user_lang: str = Form("auto")):
    try:
        detected = translation.detect_language(query) if user_lang == "auto" else user_lang
        detected = translation.normalize_lang_code(detected)
        english_query = translation.translate_to(query, "en") if detected != "en" else query
        rag_out = rag.query_with_safety(english_query, top_k=3)
        context = rag_out.get("context", "")
        generated = rag.generate_response_with_llm(english_query, context)
        response_text = generated
        if detected != "en":
            try:
                response_text = translation.translate_from(generated, "en", detected)
            except Exception as e:
                response_text = generated
        if rag_out.get("risk", {}).get("risk") == "high":
            helplines = rag_out.get("helpline_results", [])
            lines = [f"{h['name']}: {h['number']}" for h in helplines if h.get("number")]
            if lines:
                response_text += "\n\n⚠️ Helplines:\n" + "\n".join(lines)
        return JSONResponse({"query": query, "response": response_text})
    except Exception as e:
        logging.error(f"[chat_text] error: {e}")
        return JSONResponse({"error": "Internal server error"}, status_code=500)


@app.post("/chat_voice")
async def chat_voice(file: UploadFile = File(...), language_code: str = Form("auto")):
    try:
        filename = file.filename or "unknown_file"
        audio_bytes = await file.read()
        if not audio_bytes:
            return JSONResponse({"error": "Received an empty audio file."}, status_code=400)
        file_extension = os.path.splitext(filename)[1].lower()
        audio_encoding = None
        sample_rate_hertz = None
        if file_extension == ".webm":
            audio_encoding = "OGG_OPUS"
            sample_rate_hertz = 48000
        stt_lang = "en-IN"
        if language_code != "auto":
            detected = translation.normalize_lang_code(language_code)
            stt_lang = f"{detected}-{detected.upper()}" if len(detected) == 2 else detected
        transcript = stt.speech_to_text_bytes(
            audio_bytes,
            language_code=stt_lang,
            encoding=audio_encoding,
            sample_rate_hertz=sample_rate_hertz
        )
        if not transcript:
            return JSONResponse({"error": "Could not transcribe audio. Check encoding/format."}, status_code=400)
        detected_lang = translation.detect_language(transcript) if language_code == "auto" else translation.normalize_lang_code(language_code)
        english_query = translation.translate_to(transcript, "en") if detected_lang != "en" else transcript
        rag_out = rag.query_with_safety(english_query, top_k=3)
        context = rag_out.get("context", "")
        generated = rag.generate_response_with_llm(english_query, context)
        response_text = generated
        if detected_lang != "en":
            try:
                response_text = translation.translate_from(generated, "en", detected_lang)
            except Exception:
                response_text = generated
        if rag_out.get("risk", {}).get("risk") == "high":
            helplines = rag_out.get("helpline_results", [])
            lines = [f"{h['name']}: {h['number']}" for h in helplines if h.get("number")]
            if lines:
                response_text += "\n\n⚠️ Helplines:\n" + "\n".join(lines)
        tts_lang = f"{detected_lang}-IN" if detected_lang != "en" else "en-IN"
        
        # This also needs to use the correct 'text' parameter
        audio_content = tts.synthesize_text(text=response_text, language_code=tts_lang)
        encoded_text = base64.b64encode(response_text.encode('utf-8')).decode('utf-8')
        return Response(
            content=audio_content,
            media_type="audio/mpeg",
            headers={"X-Chat-Response": encoded_text}
        )
    except Exception as e:
        logging.error(f"[chat_voice] error: {e}", exc_info=True)
        return JSONResponse({"error": "Internal server error"}, status_code=500)

