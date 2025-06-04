from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Permite todas as origens


modelo = joblib.load('modelo_irrigacao.pkl')  # Carregar modelo já treinado
  # Descomente quando tiver o modelo

# Mapeamentos: Português (API) -> Inglês (Dataset)
CULTURAS_MAP = {
    # Português -> Inglês
    "Trigo": "Wheat",
    "Tomate": "Tomato", 
    "Batata": "Potato",
    "Cenoura": "Carrot",
    "Pimenta": "Chilli",
    # Também aceita em inglês (caso alguém envie)
    "Wheat": "Wheat",
    "Tomato": "Tomato", 
    "Potato": "Potato",
    "Carrot": "Carrot",
    "Chilli": "Chilli"
}

SOLOS_MAP = {
    # Português -> Inglês
    "Solo Argiloso": "Loam Soil",
    "Solo Argiloso Pesado": "Clay Soil",
    "Solo Arenoso": "Sandy Soil", 
    "Solo Preto": "Black Soil",
    "Solo Vermelho": "Red Soil",
    "Solo Calcário": "Chalky Soil",
    "Solo Aluvial": "Alluvial Soil",
    # Também aceita em inglês
    "Loam Soil": "Loam Soil",
    "Clay Soil": "Clay Soil",
    "Sandy Soil": "Sandy Soil", 
    "Black Soil": "Black Soil",
    "Red Soil": "Red Soil",
    "Chalky Soil": "Chalky Soil",
    "Alluvial Soil": "Alluvial Soil"
}

ESTAGIOS_MAP = {
    # Português -> Inglês
    "Germinação": "Germination",
    "Estágio de Muda": "Seedling Stage",
    "Crescimento Vegetativo": "Vegetative Growth / Root or Tuber Development",
    "Floração": "Flowering",
    "Polinização": "Pollination", 
    "Formação de Frutos": "Fruit/Grain/Bulb Formation",
    "Maturação": "Maturation",
    "Colheita": "Harvest",
    # Também aceita em inglês
    "Germination": "Germination",
    "Seedling Stage": "Seedling Stage",
    "Vegetative Growth / Root or Tuber Development": "Vegetative Growth / Root or Tuber Development",
    "Flowering": "Flowering",
    "Pollination": "Pollination", 
    "Fruit/Grain/Bulb Formation": "Fruit/Grain/Bulb Formation",
    "Maturation": "Maturation",
    "Harvest": "Harvest"
}

# Features esperadas pelo modelo (baseado no seu JSON)
FEATURES_ESPERADAS = [
    "MOI", "temp", "humidity", 
    "crop ID_Carrot", "crop ID_Chilli", "crop ID_Potato", "crop ID_Tomato", "crop ID_Wheat",
    "soil_type_Alluvial Soil", "soil_type_Black Soil", "soil_type_Chalky Soil", 
    "soil_type_Clay Soil", "soil_type_Loam Soil", "soil_type_Red Soil", "soil_type_Sandy Soil",
    "Seedling Stage_Flowering", "Seedling Stage_Fruit/Grain/Bulb Formation", 
    "Seedling Stage_Germination", "Seedling Stage_Harvest", "Seedling Stage_Maturation",
    "Seedling Stage_Pollination", "Seedling Stage_Seedling Stage", 
    "Seedling Stage_Vegetative Growth / Root or Tuber Development"
]

def preparar_dados_entrada(temp, humidity, moi, crop_id, soil_type, seedling_stage):
    """
    Prepara os dados de entrada no formato esperado pelo modelo
    """
    try:
        # Criar DataFrame com todas as features zeradas
        dados = pd.DataFrame(0, index=[0], columns=FEATURES_ESPERADAS)
        
        # Preencher valores numéricos
        dados.loc[0, 'temp'] = float(temp)
        dados.loc[0, 'humidity'] = float(humidity)
        dados.loc[0, 'MOI'] = float(moi)
        
        # Mapear cultura para inglês (formato do dataset)
        cultura_en = CULTURAS_MAP.get(crop_id)
        if not cultura_en:
            raise ValueError(f"Cultura não reconhecida: {crop_id}. Opções válidas: {list(set([k for k in CULTURAS_MAP.keys() if not k in ['Wheat', 'Tomato', 'Potato', 'Carrot', 'Chilli']]))}")
        
        crop_col = f"crop ID_{cultura_en}"
        if crop_col in dados.columns:
            dados.loc[0, crop_col] = 1
            
        # Mapear solo para inglês (formato do dataset)
        solo_en = SOLOS_MAP.get(soil_type)
        if not solo_en:
            raise ValueError(f"Tipo de solo não reconhecido: {soil_type}. Opções válidas: {list(set([k for k in SOLOS_MAP.keys() if not k.endswith('Soil')]))}")
        
        soil_col = f"soil_type_{solo_en}"
        if soil_col in dados.columns:
            dados.loc[0, soil_col] = 1
            
        # Mapear estágio para inglês (formato do dataset)
        estagio_en = ESTAGIOS_MAP.get(seedling_stage)
        if not estagio_en:
            raise ValueError(f"Estágio da planta não reconhecido: {seedling_stage}. Opções válidas: {list(set([k for k in ESTAGIOS_MAP.keys() if not k in ['Germination', 'Seedling Stage', 'Vegetative Growth / Root or Tuber Development', 'Flowering', 'Pollination', 'Fruit/Grain/Bulb Formation', 'Maturation', 'Harvest']]))}")
        
        stage_col = f"Seedling Stage_{estagio_en}"
        if stage_col in dados.columns:
            dados.loc[0, stage_col] = 1
            
        return dados
        
    except Exception as e:
        raise ValueError(f"Erro ao preparar dados: {str(e)}")

def prever_irrigacao(temp, humidity, moi, crop_id, soil_type, seedling_stage):
    """
    Função principal de previsão
    """
    try:
        # Preparar dados de entrada
        dados_preparados = preparar_dados_entrada(
            temp, humidity, moi, crop_id, soil_type, seedling_stage
        )
        
        
        
        previsao = modelo.predict(dados_preparados)[0]
        confianca = modelo.predict_proba(dados_preparados).max()
        
        resultado = {
            'irrigar': bool(previsao),
            'confianca': round(confianca, 3),
            'recomendacao': 'Irrigar' if previsao else 'Não Irrigar',
            'dados_entrada': {
                'temperatura': temp,
                'umidade': humidity,
                'umidade_solo': moi,
                'cultura': crop_id,
                'tipo_solo': soil_type,
                'estagio_planta': seedling_stage
            }
        }
        
        return resultado
        
    except Exception as e:
        raise Exception(f"Erro na previsão: {str(e)}")

@app.route('/prever', methods=['POST'])
def api_prever():
    try:
        # Validar se é JSON
        if not request.is_json:
            return jsonify({
                'erro': 'Content-Type deve ser application/json'
            }), 400
            
        dados = request.get_json()
        
        # Validar campos obrigatórios
        campos_obrigatorios = ['temperatura', 'umidade', 'umidade_solo', 
                              'cultura', 'tipo_solo', 'estagio_planta']
        
        for campo in campos_obrigatorios:
            if campo not in dados:
                return jsonify({
                    'erro': f'Campo obrigatório ausente: {campo}'
                }), 400
        
        # Validar valores numéricos
        try:
            temp = float(dados['temperatura'])
            humidity = float(dados['umidade'])
            moi = float(dados['umidade_solo'])
        except (ValueError, TypeError):
            return jsonify({
                'erro': 'Temperatura, umidade e umidade_solo devem ser números'
            }), 400
            
        # Validar ranges
        if not (0 <= humidity <= 100):
            return jsonify({'erro': 'Umidade deve estar entre 0 e 100'}), 400
            
        if not (0 <= moi <= 100):
            return jsonify({'erro': 'Umidade do solo deve estar entre 0 e 100'}), 400
        
        # Fazer previsão
        resultado = prever_irrigacao(
            temp=temp,
            humidity=humidity,
            moi=moi,
            crop_id=dados['cultura'],
            soil_type=dados['tipo_solo'],
            seedling_stage=dados['estagio_planta']
        )
        
        return jsonify({
            'sucesso': True,
            'resultado': resultado
        })
        
    except Exception as e:
        return jsonify({
            'erro': f'Erro interno: {str(e)}'
        }), 500

@app.route('/info', methods=['GET'])
def info():
    """Endpoint para informações da API"""
    return jsonify({
        'nome': 'API Previsão Irrigação',
        'versao': '1.0',
        'status': 'ativo',
        'endpoints': {
            '/prever': 'POST - Fazer previsão de irrigação',
            '/info': 'GET - Informações da API'
        }
    })

@app.route('/opcoes', methods=['GET'])
def opcoes():
    """Retorna opções disponíveis para os campos em português"""
    # Filtrar apenas as opções em português (excluindo as em inglês)
    culturas_pt = [k for k in CULTURAS_MAP.keys() if k not in ['Wheat', 'Tomato', 'Potato', 'Carrot', 'Chilli']]
    solos_pt = [k for k in SOLOS_MAP.keys() if not k.endswith('Soil')]
    estagios_pt = [k for k in ESTAGIOS_MAP.keys() if k not in ['Germination', 'Seedling Stage', 'Vegetative Growth / Root or Tuber Development', 'Flowering', 'Pollination', 'Fruit/Grain/Bulb Formation', 'Maturation', 'Harvest']]
    
    return jsonify({
        'culturas': sorted(culturas_pt),
        'tipos_solo': sorted(solos_pt),
        'estagios_planta': sorted(estagios_pt),
        'exemplo_requisicao': {
            "temperatura": 25.5,
            "umidade": 70,
            "umidade_solo": 45,
            "cultura": "Tomate",
            "tipo_solo": "Solo Argiloso",
            "estagio_planta": "Floração"
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'erro': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'erro': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print("🌱 Iniciando API de Previsão de Irrigação...")
    print("📍 Endpoints disponíveis:")
    print("   POST /prever - Fazer previsão")
    print("   GET /info - Informações da API") 
    print("   GET /opcoes - Opções disponíveis")
    print("🔗 Acesse: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000)
