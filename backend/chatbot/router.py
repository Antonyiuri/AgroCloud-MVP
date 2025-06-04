# router.py

def classificar_intencao(pergunta):
    saudacoes = ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'tudo bem']
    irrigacao_keywords = ['irrigação', 'umidade', 'solo', 'água', 'sensor', 'evapotranspiração', 'tensiômetro']
    agro_neural_keywords = ['agro neural', 'plataforma', 'sua plataforma', 'previsão de irrigação', 'como funciona o sistema', 'modelo de irrigação com ia']

    pergunta_lower = pergunta.lower()

    if any(p in pergunta_lower for p in saudacoes):
        return 'saudacao'
    elif any(p in pergunta_lower for p in agro_neural_keywords):
        return 'agro_neural'
    elif any(p in pergunta_lower for p in irrigacao_keywords):
        return 'irrigacao'
    elif any(p in pergunta_lower for p in irrigacao_keywords):
        return 'sensor'
    elif any(p in pergunta_lower for p in irrigacao_keywords):
        return 'ia_campo'
    else:
        return 'geral'
