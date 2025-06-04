import React, { useState, useEffect } from 'react';
import './IrrigationDashboard.css';

const IrrigationDashboard = () => {
  const [temperatura, setTemperatura] = useState('');
  const [umidade, setUmidade] = useState('');
  const [umidadeSolo, setUmidadeSolo] = useState('');
  const [cultura, setCultura] = useState('');
  const [tipoSolo, setTipoSolo] = useState('');
  const [estagio, setEstagio] = useState('');
  const [resultado, setResultado] = useState(null);
  const [apiStatus, setApiStatus] = useState('Verificando...');
  const [statusIndicator, setStatusIndicator] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    verificarAPI();
    const intervalId = setInterval(verificarAPI, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const verificarAPI = async () => {
    try {
      const resposta = await fetch(`${API_URL}/info`);
      if (resposta.ok) {
        const info = await resposta.json();
        setApiStatus(`Online (${info.modo})`);
        setStatusIndicator('online');
      } else {
        throw new Error('API não respondeu');
      }
    } catch (erro) {
      setApiStatus("Offline");
      setStatusIndicator('');
      console.error('Erro ao verificar API:', erro);
    }
  };

  const mostrarLoading = (mostrar) => {
    setLoading(mostrar);
  };

  const getConfiancaClass = (confianca) => {
    if (confianca >= 0.8) return 'confianca-alta';
    if (confianca >= 0.6) return 'confianca-media';
    return 'confianca-baixa';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mostrarLoading(true);

    const dados = {
      temperatura: parseFloat(temperatura),
      umidade: parseFloat(umidade),
      umidade_solo: parseFloat(umidadeSolo),
      cultura: cultura,
      tipo_solo: tipoSolo,
      estagio_planta: estagio
    };

    try {
      const resposta = await fetch(`${API_URL}/prever`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      const result = await resposta.json();

      if (resposta.ok) {
        const res = result.resultado;
        const recomendacaoClass = res.irrigar ? 'recomendacao-irrigar' : 'recomendacao-nao-irrigar';
        const confiancaClass = getConfiancaClass(res.confianca);

        setResultado({
          sucesso: true,
          data: res,
          recomendacaoClass: recomendacaoClass,
          confiancaClass: confiancaClass
        });
      } else {
        setResultado({
          sucesso: false,
          erro: result.erro
        });
      }
    } catch (erro) {
      setResultado({
        sucesso: false,
        erro: erro.message,
        api_url: API_URL
      });
    } finally {
      mostrarLoading(false);
    }
  };

  const handleLimparFormulario = () => {
    setTemperatura('');
    setUmidade('');
    setUmidadeSolo('');
    setCultura('');
    setTipoSolo('');
    setEstagio('');
    setResultado(null);
  };

  const handleTesteRapido = () => {
    setTemperatura("28");
    setUmidade("65");
    setUmidadeSolo("35");
    setCultura("Tomate");
    setTipoSolo("Solo Argiloso");
    setEstagio("Floração");
  };

  return (
    <>
    <div className="container">
        <div className="header">
          <h1>
            🌱 AgroTech
          </h1>
          <p>Sistema Inteligente de Previsão de Irrigação</p>
          <p>Status da API: <span id="apiStatus">{apiStatus}</span><span className={`status-indicator ${statusIndicator}`} id="statusIndicator"></span></p>
        </div>

        <div className="form-container">
          <form id="formulario" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="temperatura">🌡️ Temperatura (°C)</label>
                <input
                  type="number"
                  id="temperatura"
                  name="temperatura"
                  step="0.1"
                  min="-10"
                  max="50"
                  required
                  value={temperatura}
                  onChange={(e) => setTemperatura(e.target.value)}
                />
                <div className="input-hint">Entre -10°C e 50°C</div>
              </div>

              <div className="form-group">
                <label htmlFor="umidade">💧 Umidade do Ar (%)</label>
                <input
                  type="number"
                  id="umidade"
                  name="umidade"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={umidade}
                  onChange={(e) => setUmidade(e.target.value)}
                />
                <div className="input-hint">Entre 0% e 100%</div>
              </div>

              <div className="form-group">
                <label htmlFor="umidade_solo">🌍 Umidade do Solo (%)</label>
                <input
                  type="number"
                  id="umidade_solo"
                  name="umidade_solo"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={umidadeSolo}
                  onChange={(e) => setUmidadeSolo(e.target.value)}
                />
                <div className="input-hint">Entre 0% e 100%</div>
              </div>

              <div className="form-group">
                <label htmlFor="cultura">🌾 Cultura</label>
                <select id="cultura" required value={cultura} onChange={(e) => setCultura(e.target.value)}>
                  <option value="">Selecione uma cultura</option>
                  <option value="Tomate">🍅 Tomate</option>
                  <option value="Batata">🥔 Batata</option>
                  <option value="Trigo">🌾 Trigo</option>
                  <option value="Cenoura">🥕 Cenoura</option>
                  <option value="Pimenta">🌶️ Pimenta</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo_solo">🏔️ Tipo de Solo</label>
                <select id="tipo_solo" required value={tipoSolo} onChange={(e) => setTipoSolo(e.target.value)}>
                  <option value="">Selecione o tipo de solo</option>
                  <option value="Solo Argiloso">Solo Argiloso</option>
                  <option value="Solo Arenoso">Solo Arenoso</option>
                  <option value="Solo Argiloso Pesado">Solo Argiloso Pesado</option>
                  <option value="Solo Preto">Solo Preto</option>
                  <option value="Solo Vermelho">Solo Vermelho</option>
                  <option value="Solo Calcário">Solo Calcário</option>
                  <option value="Solo Aluvial">Solo Aluvial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estagio">🌱 Estágio da Planta</label>
                <select id="estagio" required value={estagio} onChange={(e) => setEstagio(e.target.value)}>
                  <option value="">Selecione o estágio</option>
                  <option value="Germinação">🌱 Germinação</option>
                  <option value="Estágio de Muda">🌿 Estágio de Muda</option>
                  <option value="Crescimento Vegetativo">🌿 Crescimento Vegetativo</option>
                  <option value="Floração">🌸 Floração</option>
                  <option value="Polinização">🐝 Polinização</option>
                  <option value="Formação de Frutos">🍎 Formação de Frutos</option>
                  <option value="Maturação">🍊 Maturação</option>
                  <option value="Colheita">🌾 Colheita</option>
                </select>
              </div>
            </div>

            <div className="btn-container">
              <button type="submit" className="btn btn-primary" id="btnPrever" disabled={loading}>
                <span className="loading" style={{ display: loading ? 'block' : 'none' }}></span>
                <span id="btnText">{loading ? 'Processando...' : '🔍 Fazer Previsão'}</span>
              </button>
              <button type="button" className="btn btn-secondary" id="btnLimpar" onClick={handleLimparFormulario}>
                🗑️ Limpar Formulário
              </button>
              <button type="button" className="btn btn-secondary" id="btnTestar" onClick={handleTesteRapido}>
                🧪 Teste Rápido
              </button>
            </div>
          </form>

          {resultado && (
            <div className={`resultado ${resultado.sucesso ? 'sucesso' : 'erro'}`} id="resultado">
              {resultado.sucesso ? (
                <>
                  <h3>✅ Previsão Realizada com Sucesso!</h3>
                  <div className="resultado-grid">
                    <div className="resultado-item">
                      <strong>Recomendação</strong>
                      <div className={`resultado-valor ${resultado.data.irrigar ? 'recomendacao-irrigar' : 'recomendacao-nao-irrigar'}`}>
                        {resultado.data.irrigar ? '💧 IRRIGAR' : '🚫 NÃO IRRIGAR'}
                      </div>
                    </div>
                    <div className="resultado-item">
                      <strong>Confiabilidade</strong>
                      <div className={`resultado-valor ${getConfiancaClass(resultado.data.confianca)}`}>
                        {(resultado.data.confianca * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="resultado-item">
                      <strong>Modelo Usado</strong>
                      <div className="resultado-valor">
                        {resultado.data.modelo_usado || 'Simulação'}
                      </div>
                    </div>
                  </div>
                  <div className="dados-entrada">
                    <strong>📊 Dados de Entrada:</strong><br />
                    🌡️ Temperatura: {resultado.data.dados_entrada.temperatura}°C<br />
                    💧 Umidade do Ar: {resultado.data.dados_entrada.umidade}%<br />
                    🌍 Umidade do Solo: {resultado.data.dados_entrada.umidade_solo}%<br />
                    🌾 Cultura: {resultado.data.dados_entrada.cultura}<br />
                    🏔️ Solo: {resultado.data.dados_entrada.tipo_solo}<br />
                    🌱 Estágio: {resultado.data.dados_entrada.estagio_planta}
                  </div>
                </>
              ) : (
                <>
                  <h3>❌ Erro na Previsão</h3>
                  {resultado.erro ? (
                    <p><strong>Detalhes:</strong> {resultado.erro}</p>
                  ) : (
                    <>
                      <p><strong>Problema:</strong> Não foi possível conectar com a API</p>
                      <p><strong>Verifique:</strong> Se a API está rodando em {resultado.api_url}</p>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="footer">
          <p>💡 Sistema desenvolvido para otimizar o uso da água na agricultura</p>
          <p>🔗 API: <span id="apiUrl">http://localhost:5000</span></p>
        </div>

        {resultado && resultado.sucesso && (
          <div className="prediction-results">
            <p>✅ Previsão Realizada com Sucesso!</p>
            <p>Recomendação: {resultado.data.irrigar ? '💧 IRRIGAR' : '🚫 NÃO IRRIGAR'}</p>
            <p>Confiabilidade: {(resultado.data.confianca * 100).toFixed(1)}%</p>
            <p>Modelo Usado: {resultado.data.modelo_usado || 'Simulação'}</p>
            <p>📊 Dados de Entrada:</p>
            <ul>
              <li>🌡️ Temperatura: {resultado.data.dados_entrada.temperatura}°C</li>
              <li>💧 Umidade do Ar: {resultado.data.dados_entrada.umidade}%</li>
              <li>🌍 Umidade do Solo: {resultado.data.dados_entrada.umidade_solo}%</li>
              <li>🌾 Cultura: {resultado.data.dados_entrada.cultura}</li>
              <li>🏔️ Solo: {resultado.data.dados_entrada.tipo_solo}</li>
              <li>🌱 Estágio: {resultado.data.dados_entrada.estagio_planta}</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default IrrigationDashboard;
