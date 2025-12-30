import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import tempfile
from flask_cors import CORS

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)


def detect_language(text: str) -> str:
    prompt = (
        "In which language is the following text written? "
        "Answer with only one word (for example: Hebrew, English, Spanish, etc.).\n\n"
        f"{text}"
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You detect the language of given texts."},
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=10
    )

    return response.choices[0].message.content.strip().lower()


def correct_lyrics(text: str) -> str:
    prompt = f"""
The following text is a song transcription. It may contain spelling mistakes,
grammar errors, and incorrect or inappropriate words.
Correct it in the language it is written in so that it is clear, fluent,
and accurate – including fixing incorrect or invalid words.

Preserve the rhythm, emotion, and meaning of the song.
Do not add new words and do not remove entire lines.

Please perform the following steps:
1. Split the text into clear song lines – each line on a new line.
2. Group the lines into verses – separate each verse with an empty line.
3. Correct mistakes so the text is fluent and grammatically correct,
   while preserving rhythm, emotion, and meaning.
4. Do not add new lines or words, and do not remove entire lines.

---
{text}
---
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a song editor in any language, respecting rhythm, "
                    "emotion, and meaning."
                )
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=1000
    )

    return response.choices[0].message.content


def transcribe_with_whisper(audio_url: str) -> str:
    # Download the audio file temporarily
    audio_data = requests.get(audio_url)
    audio_data.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(audio_data.content)
        temp_audio_path = temp_audio.name

    # Send the file to the Whisper API
    with open(temp_audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    os.remove(temp_audio_path)

    text = transcript.text
    corrected_text = correct_lyrics(text)

    return corrected_text


@app.route("/")
def index():
    return "Server is running! 🎵"


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
