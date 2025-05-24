import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import tempfile
from flask_cors import CORS

# טוען משתני סביבה
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)

def correct_lyrics(text: str) -> str:
    prompt = f"""
    החזר את השיר בצורה נקייה וברורה, מבלי להוסיף טקסט מסביר.
הטקסט הבא הוא תמלול של שיר . הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או לא מתאימות. 
תקן אותו לעברית תקנית, זורמת, ומדויקת — כולל תיקון מילים שגויות או לא תקינות.
שמור על המשקל, הרגש והמשמעות של השיר. אל תוסיף מילים חדשות ואל תוריד שורות שלמות.
ובנוסף - 

אנא בצע את הפעולות הבאות:
1. חלק את הטקסט לשורות שיר ברורות – כל שורה בשורה חדשה.
2. חלק את השורות לבתים – כל בית מופרד על ידי שורה ריקה.
3. תקן את הטעויות בשיר כך שיהיה כתוב בעברית תקנית וזורמת, אך שמור על המשקל, הרגש והמשמעות של השיר.
4. אל תוסיף שורות או מילים חדשות, ואל תסיר שורות שלמות.


---
{text}
---
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "אתה עורך שירים בעברית באופן שמכבד את המקצב, הרגש והמשמעות."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=1000
    )

    return response.choices[0].message.content


def transcribe_with_whisper(audio_url: str) -> str:
    # הורדת קובץ זמנית
    audio_data = requests.get(audio_url)
    audio_data.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(audio_data.content)
        temp_audio_path = temp_audio.name

    # שליחת הקובץ ל־Whisper API
    with open(temp_audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="he"
        )
    
    os.remove(temp_audio_path)  # ניקוי קובץ זמני

    return correct_lyrics(transcript.text)

@app.route("/")
def index():
    return "השרת פועל! 🎵"

@app.route('/transcribe', methods=['POST'])
def handle_transcription():
    data = request.get_json()
    audio_url = data.get('url')
    if not audio_url:
        return jsonify({'error': 'Missing audio URL'}), 400

    try:
        corrected_text = transcribe_with_whisper(audio_url)
        return jsonify({'corrected_lyrics': corrected_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
