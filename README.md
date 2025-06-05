# AgroCloud - MVP 🌱☁️

Este README fornece as instruções para rodar o projeto completo AgroCloud, um MVP voltado para **agricultura sustentável inteligente**, com APIs de chatbot, inteligência artificial e um frontend interativo.

---

## ✅ Pré-requisitos

Antes de começar, instale:

- [Git](https://git-scm.com/)
- [Python 3.10+](https://www.python.org/)
- [Node.js + npm](https://nodejs.org/)
- Uma IDE como o [Visual Studio Code (VSCode)](https://code.visualstudio.com/)

---

## 📥 Clonar o Repositório

Abra seu terminal e execute:

```bash
git clone https://github.com/Antonyiuri/AgroCloud-MVP.git
🔐 Configurar Chave da API Gemini
No Google Drive do projeto, copie o arquivo CHAVE API GEMINI.

Navegue até a pasta:

swift
Copiar
Editar
AgroCloud-MVP/Agrochat/projeto/backend/chatbot
Crie (ou edite) o arquivo .env com o conteúdo:

ini
Copiar
Editar
GOOGLE_API_KEY=SUA_CHAVE_AQUI
🤖 Rodar API do Chatbot
bash
Copiar
Editar
cd AgroCloud-MVP/Agrochat/projeto/backend/chatbot

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# OU (Linux/Mac)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar API
python app.py
🧠 Rodar API de Machine Learning (api_ML)
Abra um outro terminal e execute:

bash
Copiar
Editar
cd AgroCloud-MVP/Agrochat/projeto/backend/api_ML

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# OU (Linux/Mac)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar API
python app.py
⚠️ Observação: As duas APIs devem ser rodadas em terminais separados.

💻 Rodar o Frontend
bash
Copiar
Editar
cd AgroCloud-MVP/Agrochat/projeto/frontend

npm install
npm start
O frontend será iniciado em http://localhost:3000.

📝 Observações Finais
As APIs devem estar ativas para o frontend funcionar corretamente.

Em caso de erros, confira se as dependências foram instaladas corretamente e se o arquivo .env está com a chave certa.

Recomendado rodar o projeto com Python 3.10+ e Node.js 16+.


