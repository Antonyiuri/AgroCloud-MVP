O backend é responsável pela lógica do servidor, APIs e conexão com o banco de dados (se houver).

Pré-requisitos
Python 3.8 ou superior

pip instalado

Ambiente virtual (recomendado)

Passos para execução
Abra o terminal e navegue até a pasta do backend:

bash
cd backend

Crie e ative um ambiente virtual (caso ainda não exista):
Linux/Mac:

bash
python3 -m venv venv
source venv/bin/activate
Windows:

bash
python -m venv venv
.\venv\Scripts\activate
Instale as dependências do projeto:

bash
pip install -r requirements.txt
Execute a aplicação:

bash
python app.py
O servidor estará rodando em http://localhost:5000 (ou na porta definida no código).

🌐 Frontend (React ou outro framework JS)
O frontend é a interface visual que o usuário interage. Ele se comunica com o backend através de requisições HTTP.

Pré-requisitos
Node.js (versão 14 ou superior)

npm (gerenciador de pacotes do Node)

Passos para execução
Abra um novo terminal e vá até a pasta do frontend:

bash
cd frontend
Instale as dependências do projeto:

bash
npm install
Inicie a aplicação:

bash
Copiar
Editar
npm start
O frontend estará disponível no navegador em http://localhost:3000.

⚠️ Certifique-se de que o backend esteja rodando antes de iniciar o frontend, caso a aplicação dependa de APIs.
