from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Carrega variáveis do .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Configura o Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Prompt do sistema
SYSTEM_PROMPT = """
Você é o AgroBot, um assistente agrícola especializado em lavouras de café. 
Seu trabalho é ajudar agricultores a entender melhor a rotina da fazenda, tirar dúvidas, dar dicas e se comunicar de forma simples e direta.

Fale como um parceiro de fazenda. Responda sempre com bom senso, dicas práticas e com foco na economia de recursos e na produtividade.
"""


# Endpoint principal
@app.route('/ask', methods=['POST'])
def ask_agrobot():
    data = request.get_json()
    user_question = data.get('pergunta')

    if not user_question:
        return jsonify({'erro': 'Campo "pergunta" é obrigatório'}), 400

    try:
        convo = model.start_chat(history=[])
        full_prompt = f"{SYSTEM_PROMPT}\n\n{user_question}"
        response = convo.send_message(full_prompt)
        resposta_bot = response.text

        return jsonify({'resposta': resposta_bot})

    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Roda o servidor local
if __name__ == '__main__':
    app.run(debug=True)
