from google.cloud import translate_v2 as translate

_translate_client = translate.Client()

# Map language codes from detection → supported by API
LANG_CODE_FIX = {
    "te-Latn": "te",  # Telugu
    "ml-Latn": "ml",  # Malayalam
    "ta-Latn": "ta",  # Tamil
    "hi-Latn": "hi",  # Hindi
    "kn-Latn": "kn",  # Kannada
    "bn-Latn": "bn",  # Bengali
    "mr-Latn": "mr",  # Marathi
}

def normalize_lang_code(code: str) -> str:
    return LANG_CODE_FIX.get(code, code)

def detect_language(text: str) -> str:
    if not text:
        return "en"
    result = _translate_client.detect_language(text)
    lang = result.get("language", "en")
    return normalize_lang_code(lang)

def translate_to(text: str, target_language: str = "en") -> str:
    if not text:
        return text
    src = detect_language(text)
    if src == target_language:
        return text
    res = _translate_client.translate(
        text,
        target_language=normalize_lang_code(target_language),
        source_language=src
    )
    return res.get("translatedText", text)

def translate_from(text: str, source_language: str, target_language: str) -> str:
    if not text:
        return text
    res = _translate_client.translate(
        text,
        target_language=normalize_lang_code(target_language),
        source_language=normalize_lang_code(source_language)
    )
    return res.get("translatedText", text)
