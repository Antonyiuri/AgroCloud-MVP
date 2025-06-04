# app.py

from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask_cors import CORS

from agentes import SAUDACAO_PROMPT, IRRIGACAO_PROMPT, AGRO_NEURAL_PROMPT, SENSOR_PROMPT, GERAL_PROMPT, IA_CAMPO
from router import classificar_intencao

# Setup
app = Flask(__name__)
CORS(app)
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

@app.route('/ask', methods=['POST'])
def ask_agrobot():
    data = request.get_json()
    user_question = data.get('pergunta')

    if not user_question:
        return jsonify({'erro': 'Campo "pergunta" é obrigatório'}), 400

    try:
        intencao = classificar_intencao(user_question)

        if intencao == 'saudacao':
            prompt = SAUDACAO_PROMPT
        elif intencao == 'irrigacao':
            prompt = IRRIGACAO_PROMPT
        elif intencao == 'agro_neural':
            prompt = AGRO_NEURAL_PROMPT
        elif intencao == SENSOR_PROMPT:
            prompt == 'sensor'
        elif intencao == IA_CAMPO:
            prompt == 'ia_campo'
        else:
            prompt = GERAL_PROMPT

        full_prompt = f"{prompt}\n\n{user_question}"
        convo = model.start_chat(history=[])
        response = convo.send_message(full_prompt)
        resposta_bot = response.text

        return jsonify({
            'resposta': resposta_bot,
            'agente_usado': intencao
        })

    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
