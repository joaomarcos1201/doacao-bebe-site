import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';
import { analisarImagens } from '../services/iaService';
import BarraProgresso from '../components/anunciar/BarraProgresso';
import UploadFotos from '../components/anunciar/UploadFotos';
import AnaliseIA from '../components/anunciar/AnaliseIA';
import CategoriaAutomatica from '../components/anunciar/CategoriaAutomatica';
import InformacoesProduto from '../components/anunciar/InformacoesProduto';
import SugestaoPreco from '../components/anunciar/SugestaoPreco';
import ValidacaoAnuncio from '../components/anunciar/ValidacaoAnuncio';
import RevisaoFinal from '../components/anunciar/RevisaoFinal';

const ETAPA = { FOTOS: 0, CATEGORIA: 1, INFORMACOES: 2, REVISAO: 3, PUBLICAR: 4 };

const FORM_INICIAL = {
  nome: '', descricao: '', categoria: '', subcategoria: '',
  marca: '', cor: '', conservacao: '', faixaEtaria: '',
  preco: '', cepOrigem: '',
};

export default function CadastrarProduto() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(ETAPA.FOTOS);
  const [fotos, setFotos] = useState([]);
  const [analisando, setAnalisando] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#888';

  const setField = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), []);

  const handleFotos = useCallback(async (novasFotos) => {
    setFotos(novasFotos);
    if (novasFotos.length === 0) return;

    setAnalisando(true);
    try {
      const resultado = await analisarImagens(novasFotos);
      setResultadoIA(resultado);

      if (resultado.sucesso) {
        setForm(f => ({
          ...f,
          categoria: resultado.categoria || f.categoria,
          subcategoria: resultado.subcategoria || f.subcategoria,
          marca: resultado.marca || f.marca,
          cor: resultado.cor || f.cor,
          conservacao: resultado.conservacao || f.conservacao,
          faixaEtaria: resultado.faixaEtaria || f.faixaEtaria,
          nome: resultado.titulo || f.nome,
          descricao: resultado.descricao || f.descricao,
        }));
      }
    } catch {
      // Falha silenciosa — usuário preenche manualmente
    } finally {
      setAnalisando(false);
    }
  }, []);

  const podeAvancar = () => {
    if (etapa === ETAPA.FOTOS) return fotos.length > 0 && !analisando;
    if (etapa === ETAPA.CATEGORIA) return !!form.categoria && !!form.subcategoria;
    if (etapa === ETAPA.INFORMACOES) return !!form.nome && !!form.conservacao && !!form.preco && !!form.cepOrigem;
    if (etapa === ETAPA.REVISAO) return true;
    return false;
  };

  const handleSubmit = async () => {
    setErro(''); setLoading(true);
    try {
      const fd = new FormData();
      const campos = { nome: form.nome, descricao: form.descricao, categoria: form.categoria, marca: form.marca, conservacao: form.conservacao, preco: form.preco, cepOrigem: form.cepOrigem };
      Object.entries(campos).forEach(([k, v]) => fd.append(k, v));
      fotos.forEach((f, i) => fd.append(i === 0 ? 'imagem' : `imagem_${i}`, f));

      const r = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });

      if (r.ok) setSucesso(true);
      else { const msg = await r.text(); setErro(msg || 'Erro ao cadastrar produto.'); }
    } catch { setErro('Erro de conexão. Tente novamente.'); }
    finally { setLoading(false); }
  };

  // ── Tela de sucesso ──────────────────────────────────────────────────────────
  if (sucesso) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', margin: '0 auto 20px',
          animation: 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>✓</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: text, margin: '0 0 8px' }}>
          Anúncio enviado!
        </h2>
        <p style={{ color: sub, marginBottom: '28px', lineHeight: '1.6' }}>
          Seu produto foi enviado para análise. O administrador irá revisar e aprovar em breve.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/home')} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#c0606a', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            Ir para Home
          </button>
          <button onClick={() => { setSucesso(false); setForm(FORM_INICIAL); setFotos([]); setResultadoIA(null); setEtapa(ETAPA.FOTOS); }}
            style={{ padding: '12px 24px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: 'transparent', color: text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Novo Anúncio
          </button>
        </div>
      </div>
      <style>{`@keyframes successPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );

  // ── Conteúdo por etapa ───────────────────────────────────────────────────────
  const renderEtapa = () => {
    switch (etapa) {
      case ETAPA.FOTOS:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: text, margin: '0 0 4px' }}>
                📸 Adicione as fotos
              </h2>
              <p style={{ fontSize: '14px', color: sub, margin: 0 }}>
                A IA vai analisar as imagens e preencher o formulário automaticamente
              </p>
            </div>
            <UploadFotos fotos={fotos} onChange={handleFotos} isDark={isDark} />
            {analisando && <AnaliseIA isDark={isDark} />}
            {resultadoIA && !analisando && resultadoIA.avisos?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {resultadoIA.avisos.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-start',
                    backgroundColor: isDark ? '#2a1a00' : '#fffbeb',
                    border: '1px solid #fcd34d', borderRadius: '10px', padding: '10px 12px',
                  }}>
                    <span>⚠️</span>
                    <span style={{ fontSize: '13px', color: isDark ? '#fcd34d' : '#92400e' }}>{a.msg}</span>
                  </div>
                ))}
              </div>
            )}
            {resultadoIA && !analisando && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: isDark ? '#0a2a1a' : '#f0fdf4',
                border: '1px solid #22c55e', borderRadius: '12px', padding: '14px 16px',
              }}>
                <span style={{ fontSize: '20px' }}>✨</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                    IA identificou: {resultadoIA.produto || 'produto detectado'}
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#4ade80' : '#15803d' }}>
                    Formulário preenchido automaticamente. Revise e ajuste se necessário.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case ETAPA.CATEGORIA:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: text, margin: '0 0 4px' }}>
                🏷️ Categoria do produto
              </h2>
              <p style={{ fontSize: '14px', color: sub, margin: 0 }}>
                {resultadoIA?.categoria ? 'A IA selecionou automaticamente — confirme ou altere' : 'Selecione a categoria e subcategoria'}
              </p>
            </div>
            <CategoriaAutomatica
              categoria={form.categoria}
              subcategoria={form.subcategoria}
              sugestoes={resultadoIA?.sugestoes}
              confianca={resultadoIA?.confianca || 0}
              onChange={({ categoria, subcategoria }) => {
                setField('categoria', categoria);
                setField('subcategoria', subcategoria || '');
              }}
              isDark={isDark}
            />
          </div>
        );

      case ETAPA.INFORMACOES:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: text, margin: '0 0 4px' }}>
                📝 Informações do produto
              </h2>
              <p style={{ fontSize: '14px', color: sub, margin: 0 }}>
                Revise e complete as informações geradas pela IA
              </p>
            </div>
            <InformacoesProduto form={form} onChange={setField} isDark={isDark} />
            <SugestaoPreco
              preco={form.preco}
              onChange={v => setField('preco', v)}
              precoSugerido={resultadoIA?.precoSugerido}
              isDark={isDark}
            />
          </div>
        );

      case ETAPA.REVISAO:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: text, margin: '0 0 4px' }}>
                🔍 Revisão do anúncio
              </h2>
              <p style={{ fontSize: '14px', color: sub, margin: 0 }}>
                Confira tudo antes de publicar
              </p>
            </div>
            <ValidacaoAnuncio form={form} fotos={fotos} avisosIA={resultadoIA?.avisos} isDark={isDark} />
            <RevisaoFinal form={form} fotos={fotos} isDark={isDark} />
          </div>
        );

      default:
        return null;
    }
  };

  const btnPrimario = {
    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
    backgroundColor: podeAvancar() ? '#c0606a' : (isDark ? '#2a2a2a' : '#e5e5e5'),
    color: podeAvancar() ? '#fff' : sub,
    fontSize: '15px', fontWeight: '700', cursor: podeAvancar() ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 20px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => etapa > 0 ? setEtapa(e => e - 1) : navigate(-1)}
          style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', color: sub, fontSize: '13px', fontWeight: '600' }}>
          ← {etapa > 0 ? 'Voltar' : 'Sair'}
        </button>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#c0606a' }}>✨ Anunciar Produto</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 100px' }}>
        <BarraProgresso etapaAtual={etapa} isDark={isDark} />

        <div style={{
          backgroundColor: card, borderRadius: '20px',
          border: `1px solid ${border}`, padding: '24px',
        }}>
          {renderEtapa()}
        </div>

        {/* Rodapé fixo */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: isDark ? 'rgba(15,15,15,0.97)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)', borderTop: `1px solid ${border}`,
          padding: '12px 16px',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            {etapa < ETAPA.REVISAO ? (
              <button
                onClick={() => podeAvancar() && setEtapa(e => e + 1)}
                style={btnPrimario}
              >
                {etapa === ETAPA.FOTOS && fotos.length === 0 ? 'Adicione fotos para continuar' :
                  etapa === ETAPA.FOTOS && analisando ? '⏳ Analisando...' :
                    'Continuar →'}
              </button>
            ) : (
              <>
                {erro && (
                  <p style={{ fontSize: '13px', color: '#ef4444', margin: '0 0 8px', width: '100%', textAlign: 'center' }}>{erro}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ ...btnPrimario, backgroundColor: loading ? (isDark ? '#2a2a2a' : '#e5e5e5') : '#c0606a', color: loading ? sub : '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? '⏳ Publicando...' : '🚀 Publicar Anúncio'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
