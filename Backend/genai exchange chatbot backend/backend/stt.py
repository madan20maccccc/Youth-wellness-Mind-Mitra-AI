# stt.py - Final version with robust audio handling
from google.cloud import speech
from typing import Optional, Literal

_speech_client = speech.SpeechClient()

AudioEncodingLiteral = Literal[
    'LINEAR16', 'OGG_OPUS', 'MP3', 'FLAC', 'MULAW', 'ALAW', 'AMR', 'AMR_WB'
]

def speech_to_text_bytes(
    audio_bytes: bytes, 
    language_code: str = "en-IN", 
    sample_rate_hertz: int = None,
    encoding: Optional[AudioEncodingLiteral] = None,
) -> Optional[str]:
    """
    Accepts raw audio bytes and converts to transcript string. This version
    has special handling for OGG_OPUS audio from web browsers.
    """
    if not audio_bytes:
        return None

    audio = speech.RecognitionAudio(content=audio_bytes)
    
    config = None

    # --- THE FINAL FIX ---
    # For OGG_OPUS audio, the API requires a specific, minimal configuration.
    # We must provide the sample rate, but let the API infer other details.
    if encoding == "OGG_OPUS":
        config = speech.RecognitionConfig(
            sample_rate_hertz=sample_rate_hertz,
            language_code=language_code,
            encoding=speech.RecognitionConfig.AudioEncoding.OGG_OPUS,
            model="default",
            enable_automatic_punctuation=True,
        )
    else:
        # Fallback for other potential audio formats
        stt_encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        if encoding:
            try:
                stt_encoding = getattr(speech.RecognitionConfig.AudioEncoding, encoding.upper())
            except AttributeError:
                print(f"Warning: Invalid encoding '{encoding}' provided.")
        
        config_params = {
            "language_code": language_code,
            "model": "default", 
            "enable_automatic_punctuation": True,
        }
        if stt_encoding != speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED:
            config_params["encoding"] = stt_encoding
        if sample_rate_hertz:
            config_params["sample_rate_hertz"] = sample_rate_hertz
        config = speech.RecognitionConfig(**config_params)
    # --- END OF FIX ---

    try:
        response = _speech_client.recognize(config=config, audio=audio) 
        
        transcripts = [result.alternatives[0].transcript for result in response.results]
            
        return " ".join(transcripts).strip()
        
    except Exception as e:
        # This will now print the specific error message from the Google API
        print(f"STT API Error: {e}")
        return None

