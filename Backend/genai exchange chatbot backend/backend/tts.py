from google.cloud import texttospeech

_tts_client = texttospeech.TextToSpeechClient()

def synthesize_text(text: str, language_code: str = "en-IN", voice_name: str = None) -> bytes:
    """
    Returns MP3 bytes for the given text.
    """
    if not text:
        return b""

    synthesis_input = texttospeech.SynthesisInput(text=text)

    # choose voice
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    if voice_name:
        voice.name = voice_name

    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    try:
        response = _tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        return response.audio_content
    except Exception as e:
        print("TTS error:", e)
        return b""
