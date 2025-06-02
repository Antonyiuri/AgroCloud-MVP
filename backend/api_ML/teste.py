import requests
import json

def testar_api_completa():
    base_url = "http://localhost:5000"
    
    print("🌱 TESTE COMPLETO DA API DE IRRIGAÇÃO")
    print("="*60)
    
    # Teste 1: Página inicial
    print("1️⃣ Testando página inicial (GET /)")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("   ✅ Sucesso!")
            data = response.json()
            print(f"   📝 Mensagem: {data.get('mensagem')}")
            print(f"   📊 Status: {data.get('status')}")
        else:
            print(f"   ❌ Erro {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # Teste 2: Informações da API
    print("\n2️⃣ Testando informações (GET /info)")
    try:
        response = requests.get(f"{base_url}/info")
        if response.status_code == 200:
            print("   ✅ Sucesso!")
            data = response.json()
            print(f"   📝 Nome: {data.get('nome')}")
            print(f"   🔢 Versão: {data.get('versao')}")
        else:
            print(f"   ❌ Erro {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # Teste 3: Opções disponíveis
    print("\n3️⃣ Testando opções (GET /opcoes)")
    try:
        response = requests.get(f"{base_url}/opcoes")
        if response.status_code == 200:
            print("   ✅ Sucesso!")
            data = response.json()
            print(f"   🌾 Culturas: {data.get('culturas')}")
            print(f"   🏔️  Solos: {data.get('tipos_solo')}")
            print(f"   🌱 Estágios: {data.get('estagios_planta')}")
        else:
            print(f"   ❌ Erro {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # Teste 4: Previsão com solo seco (deve irrigar)
    print("\n4️⃣ Testando previsão - Solo SECO (POST /prever)")
    dados_solo_seco = {
        "temperatura": 28.5,
        "umidade": 65,
        "umidade_solo": 30,  # Solo seco < 50
        "cultura": "Tomate",
        "tipo_solo": "Solo Argiloso",
        "estagio_planta": "Floração"
    }
    
    try:
        response = requests.post(
            f"{base_url}/prever",
            json=dados_solo_seco,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("   ✅ Sucesso!")
            data = response.json()
            resultado = data.get('resultado', {})
            print(f"   💧 Irrigar: {'SIM' if resultado.get('irrigar') else 'NÃO'}")
            print(f"   📊 Confiança: {resultado.get('confianca', 0)*100:.1f}%")
            print(f"   💡 Recomendação: {resultado.get('recomendacao')}")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # Teste 5: Previsão com solo úmido (não deve irrigar)
    print("\n5️⃣ Testando previsão - Solo ÚMIDO (POST /prever)")
    dados_solo_umido = {
        "temperatura": 22.0,
        "umidade": 80,
        "umidade_solo": 75,  # Solo úmido > 50
        "cultura": "Trigo",
        "tipo_solo": "Solo Arenoso",
        "estagio_planta": "Germinação"
    }
    
    try:
        response = requests.post(
            f"{base_url}/prever",
            json=dados_solo_umido,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("   ✅ Sucesso!")
            data = response.json()
            resultado = data.get('resultado', {})
            print(f"   💧 Irrigar: {'SIM' if resultado.get('irrigar') else 'NÃO'}")
            print(f"   📊 Confiança: {resultado.get('confianca', 0)*100:.1f}%")
            print(f"   💡 Recomendação: {resultado.get('recomendacao')}")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # Teste 6: Validação - dados inválidos
    print("\n6️⃣ Testando validação - Dados INVÁLIDOS")
    dados_invalidos = {
        "temperatura": 25,
        "umidade": 60,
        # umidade_solo ausente - deve dar erro
        "cultura": "Tomate",
        "tipo_solo": "Solo Argiloso",
        "estagio_planta": "Floração"
    }
    
    try:
        response = requests.post(
            f"{base_url}/prever",
            json=dados_invalidos,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 400:
            print("   ✅ Validação funcionando!")
            data = response.json()
            print(f"   ⚠️  Erro esperado: {data.get('erro')}")
        elif response.status_code == 200:
            print("   ⚠️  Atenção: Deveria ter dado erro, mas passou")
        else:
            print(f"   ❌ Erro inesperado {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    print("\n" + "="*60)
    print("🎉 TESTE COMPLETO FINALIZADO!")
    print("💡 Se todos os testes passaram, sua API está funcionando perfeitamente!")

def testar_com_curl():
    """Gera comandos curl para testar manualmente"""
    print("\n" + "="*60)
    print("🔧 COMANDOS CURL PARA TESTE MANUAL:")
    print("="*60)
    
    print("1️⃣ Testar página inicial:")
    print('curl -X GET "http://localhost:5000/"')
    
    print("\n2️⃣ Testar opções:")
    print('curl -X GET "http://localhost:5000/opcoes"')
    
    print("\n3️⃣ Testar previsão:")
    print('curl -X POST "http://localhost:5000/prever" \\')
    print('  -H "Content-Type: application/json" \\')
    print('  -d \'{"temperatura": 25, "umidade": 60, "umidade_solo": 30, "cultura": "Tomate", "tipo_solo": "Solo Argiloso", "estagio_planta": "Floração"}\'')

if __name__ == "__main__":
    testar_api_completa()
    testar_com_curl()