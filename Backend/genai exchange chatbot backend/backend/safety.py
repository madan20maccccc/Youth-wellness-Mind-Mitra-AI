import re
from typing import Dict, List, Tuple
from difflib import SequenceMatcher
import logging

# -------------------------
# Helpline definitions (factually categorized)
# -------------------------
HELPLINE_CATEGORIES = {
    "suicidal": [
        {"name": "KIRAN 24x7 Mental Health Helpline", "number": "1800-599-0019"},
        {"name": "Tele MANAS (Suicide Prevention)", "number": "14416"},
    ],
    "depression": [
        {"name": "iCALL by TISS (Depression & Mental Health)", "number": "022-25521111"},
        {"name": "NIMHANS Helpline (Depression)", "number": "080-46110007"},
    ],
    "anxiety": [
        {"name": "Vandrevala Foundation Crisis Intervention (Stress & Anxiety)", "number": "+91 9999 666 555"},
    ],
    "general": [
        {"name": "Aasra (24x7 Emotional Support)", "number": "9820466728"},
        {"name": "Jeevan Aastha Helpline (Mental Support)", "number": "1800 233 3330"},
    ],
}

# -------------------------
# Risk phrase lists
# -------------------------

SUICIDAL_PHRASES = [
    "suicide", "kill myself", "i want to die", "end my life", "i'm going to kill myself",
    "i cant go on", "i can't go on", "i feel trapped", "i want to die now", "i will kill myself",
    "hurt myself", "self harm", "cut myself", "give up on life", "i feel hopeless", 
    "life is meaningless", "i want to vanish", "i am a burden", "i feel suicidal", "i am done",
    "i feel like dying", "life is unbearable", "i don't want to live", "hopelessness",
    "i feel empty", "i feel dead", "my existence is pointless", "done with life",
    "i want relief from life", "i want death", "my life is pain", "i feel destroyed",
    "nothing matters", "i can't handle this", "i feel abandoned", "i hate myself",
    "leave this world", "i feel trapped forever", "life is over", "i have no future",
    "i wish i were dead", "i feel numb", "i feel broken", "life is a burden",
    "i want out", "i feel hopelessly lost", "i am finished", "ready to die", "i want to disappear",
    "i feel dead inside", "i can't survive", "end it all", "life is unbearable"
]
DEPRESSION_PHRASES = [
    "worthless", "sad", "down", "feeling sad", "feeling down", "lonely", "i feel lonely",
    "i feel worthless", "i feel hopelessly trapped", "i am failing", "i feel like nothing",
    "i have no future", "i feel abandoned", "feeling hopeless", "feeling helpless",
    "discouraged", "disappointed", "unmotivated", "empty inside", "lost interest",
    "no energy", "tired all the time", "emotionally drained", "mentally exhausted",
    "feeling disconnected", "feeling empty", "sad and lonely", "overwhelmed by life",
    "life is meaningless", "feeling inadequate", "loss of hope", "downhearted",
    "feeling hopeless about future", "feeling unappreciated", "everything feels heavy",
    "can’t focus", "lack of motivation", "feeling invisible", "lost all hope",
    "feeling low", "hard to get out of bed", "nothing excites me", "life is pointless",
    "disheartened", "feeling rejected", "hopeless thoughts", "feeling trapped",
    "can't enjoy anything", "life is gray", "feeling emotionally flat", "no purpose",
    "feeling powerless"
]
ANXIETY_PHRASES = [
    "stressed", "anxious", "overwhelmed", "worried", "nervous", "restless", "panic",
    "tense", "pressure", "uneasy", "confused", "irritable", "fatigued", "drained",
    "exhausted", "discouraged", "helpless", "frustrated", "tired", "fearful", "apprehensive",
    "sleep deprived", "overthinking", "mentally exhausted", "emotionally drained",
    "social anxiety", "feeling anxious", "feeling stressed", "feeling nervous", "feeling tense",
    "heart racing", "can't relax", "worrying too much", "fear of failing", "panic attacks",
    "nervous about everything", "difficulty concentrating", "overloaded", "uneasy at work",
    "pressure at home", "troubled thoughts", "racing thoughts", "unable to focus",
    "tension headaches", "feeling on edge", "feeling jittery", "feeling restless",
    "worrying excessively", "overthinking everything", "feeling unsettled", "fear of the future",
    "nervousness", "feeling overwhelmed at work", "anxious about exams"
]

# -------------------------
# Phrase -> category mapping
# -------------------------
PHRASE_CATEGORY_MAP = {}
for phrase in SUICIDAL_PHRASES:
    PHRASE_CATEGORY_MAP[phrase] = "suicidal"
for phrase in DEPRESSION_PHRASES:
    PHRASE_CATEGORY_MAP[phrase] = "depression"
for phrase in ANXIETY_PHRASES:
    PHRASE_CATEGORY_MAP[phrase] = "anxiety"

# -----------------------------
# Utilities
# -----------------------------
def normalize_text(s: str) -> str:
    s = s or ""
    s = s.lower()
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()

def best_phrase_match(text: str, phrase_list: List[str]) -> Tuple[List[Tuple[str, float]], float]:
    t = normalize_text(text)
    matches = []
    best = 0.0
    for phrase in phrase_list:
        p = normalize_text(phrase)
        r_whole = similarity(t, p)
        t_words = t.split()
        best_window = 0.0
        phrase_len = max(1, len(p.split()))
        max_window = min(len(t_words), phrase_len + 3)
        for w in range(1, max_window + 1):
            for i in range(len(t_words) - w + 1):
                window = " ".join(t_words[i : i + w])
                r = similarity(window, p)
                if r > best_window:
                    best_window = r
        r = max(r_whole, best_window)
        if r > best:
            best = r
        if r >= 0.5:
            matches.append((phrase, r))
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches, best

# -----------------------------
# Main risk analyzer
# -----------------------------
def analyze_risk(text: str) -> Dict:
    t = normalize_text(text)

    # Best match for each category
    high_matches, best_high = best_phrase_match(t, SUICIDAL_PHRASES)
    depression_matches, best_depression = best_phrase_match(t, DEPRESSION_PHRASES)
    anxiety_matches, best_anxiety = best_phrase_match(t, ANXIETY_PHRASES)

    HIGH_THRESHOLD = 0.75
    MID_THRESHOLD = 0.6

    risk = "none"
    category = None

    if best_high >= HIGH_THRESHOLD:
        risk = "high"
        category = "suicidal"
    elif best_depression >= MID_THRESHOLD:
        risk = "mild"
        category = "depression"
    elif best_anxiety >= MID_THRESHOLD:
        risk = "mild"
        category = "anxiety"
    else:
        risk = "none"
        category = "general"

    # Log internal matched phrases for devs
    logging.info(f"[safety] text='{text}' risk='{risk}' category='{category}'")

    # Select helplines based on category
    helplines = HELPLINE_CATEGORIES.get(category, HELPLINE_CATEGORIES["general"])

    return {
        "risk": risk,
        "category": category,
        "helpline_results": helplines
    }
