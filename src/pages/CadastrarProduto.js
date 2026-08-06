import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';
import { analisarImagens } from '../services/iaService';
import {
  ArrowLeft, Sparkles, Camera, Tag, Info, ClipboardCheck, Send,
  CircleCheck, CircleAlert, Loader2, CheckCircle2, TriangleAlert,
} from 'lucide-react';
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

const ETAPA_META = [
  { Icon: Camera, titulo: 'Adicione as fotos', sub: 'A IA vai analisar e preencher o formulário automaticamente' },
  { Icon: Tag, titulo: 'Categoria do produto', sub: 'Selecione a categoria e subcategoria mais adequadas' },
  { Icon: Info, titulo: 'Informações do produto', sub: 'Revise e complete as informações geradas pela IA' },
  { Icon: ClipboardCheck, titulo: 'Revisão do anúncio', sub: 'Confira tudo antes de publicar' },
];

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

  const bg = isDark ? '#0F0F0F' : '#F8F9FA';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#E0E0E0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';

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
    } catch { /* falha silenciosa */ }
    finally { setAnalisando(false); }
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
    <div style={{
      minHeight: '100vh', backgroundColor: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif", padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 12px 40px rgba(34,197,94,0.3)',
        }}>
          <CircleCheck size={36} color="#fff" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: text, margin: '0 0 10px' }}>
          Anúncio enviado!
        </h2>
        <p style={{ color: sub, marginBottom: '32px', lineHeight: '1.7', fontSize: '15px' }}>
          Seu produto foi enviado para análise. O administrador irá revisar e aprovar em breve.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '13px 28px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #F48FB1, #c0606a)',
              color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(192,96,106,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            Ir para Home
          </button>
          <button
            onClick={() => { setSucesso(false); setForm(FORM_INICIAL); setFotos([]); setResultadoIA(null); setEtapa(ETAPA.FOTOS); }}
            style={{
              padding: '13px 28px', borderRadius: '12px',
              border: `1.5px solid ${border}`, backgroundColor: 'transparent',
              color: text, fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
          >
            Novo Anúncio
          </button>
        </div>
      </div>
      <style>{`@keyframes successPop { from { transform: scale(0) rotate(-10deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }`}</style>
    </div>
  );

  const meta = ETAPA_META[etapa];
  const canAdvance = podeAvancar();

  const renderEtapa = () => {
    switch (etapa) {
      case ETAPA.FOTOS:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <UploadFotos fotos={fotos} onChange={handleFotos} isDark={isDark} />
            {analisando && <AnaliseIA isDark={isDark} />}
            {resultadoIA && !analisando && resultadoIA.avisos?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resultadoIA.avisos.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    backgroundColor: isDark ? '#2a1a00' : '#FFFBEB',
                    border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 14px',
                  }}>
                    <TriangleAlert size={14} color="#D97706" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '13px', color: isDark ? '#FCD34D' : '#92400E' }}>{a.msg}</span>
                  </div>
                ))}
              </div>
            )}
            {resultadoIA && !analisando && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: isDark ? '#0a2a1a' : '#F0FDF4',
                border: '1.5px solid #22C55E', borderRadius: '14px', padding: '14px 16px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  backgroundColor: isDark ? '#14532D' : '#DCFCE7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CheckCircle2 size={18} color="#16A34A" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#16A34A' }}>
                    IA identificou: {resultadoIA.produto || 'produto detectado'}
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#4ADE80' : '#15803D', marginTop: '2px' }}>
                    Formulário preenchido automaticamente. Revise e ajuste se necessário.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case ETAPA.CATEGORIA:
        return (
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
        );

      case ETAPA.INFORMACOES:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InformacoesProduto form={form} onChange={setField} isDark={isDark} />
            <div style={{ height: '1px', backgroundColor: border }} />
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
            <ValidacaoAnuncio form={form} fotos={fotos} avisosIA={resultadoIA?.avisos} isDark={isDark} />
            <RevisaoFinal form={form} fotos={fotos} isDark={isDark} onEditar={() => setEtapa(ETAPA.INFORMACOES)} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(15,15,15,0.96)' : 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 20px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={() => etapa > 0 ? setEtapa(e => e - 1) : navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
            padding: '7px 14px', cursor: 'pointer', color: sub,
            fontSize: '13px', fontWeight: '600', transition: 'background-color 0.15s',
          }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          {etapa > 0 ? 'Voltar' : 'Sair'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #F48FB1, #c0606a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={14} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '800', color: text }}>Anunciar Produto</span>
        </div>

        <div style={{ width: '90px' }} />
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '28px 16px 110px' }}>
        <BarraProgresso etapaAtual={etapa} isDark={isDark} />

        {/* Card principal */}
        <div style={{
          backgroundColor: card, borderRadius: '20px',
          border: `1px solid ${border}`,
          boxShadow: isDark ? 'none' : '0 1px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          {/* Header da etapa */}
          {meta && (
            <div style={{
              padding: '22px 24px 20px',
              borderBottom: `1px solid ${border}`,
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #FFF0F2, #FFD6DC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <meta.Icon size={20} color="#c0606a" strokeWidth={1.8} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: text, margin: '0 0 3px' }}>
                  {meta.titulo}
                </h2>
                <p style={{ fontSize: '13px', color: sub, margin: 0, lineHeight: '1.4' }}>
                  {etapa === ETAPA.CATEGORIA && resultadoIA?.categoria
                    ? 'A IA selecionou automaticamente — confirme ou altere'
                    : meta.sub}
                </p>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div style={{ padding: '24px' }}>
            {renderEtapa()}
          </div>
        </div>
      </div>

      {/* Rodapé fixo */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: isDark ? 'rgba(15,15,15,0.97)' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)', borderTop: `1px solid ${border}`,
        padding: '14px 16px',
      }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          {erro && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: isDark ? '#2a0a0a' : '#FEF2F2',
              border: '1px solid #FCA5A5', borderRadius: '10px',
              padding: '10px 14px', marginBottom: '10px',
            }}>
              <CircleAlert size={14} color="#DC2626" strokeWidth={2} />
              <span style={{ fontSize: '13px', color: '#DC2626' }}>{erro}</span>
            </div>
          )}

          {etapa < ETAPA.REVISAO ? (
            <button
              onClick={() => canAdvance && setEtapa(e => e + 1)}
              disabled={!canAdvance}
              style={{
                width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                background: canAdvance
                  ? 'linear-gradient(135deg, #F48FB1, #c0606a)'
                  : (isDark ? '#2a2a2a' : '#F3F4F6'),
                color: canAdvance ? '#fff' : sub,
                fontSize: '15px', fontWeight: '700',
                cursor: canAdvance ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: canAdvance ? '0 4px 16px rgba(192,96,106,0.35)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {etapa === ETAPA.FOTOS && fotos.length === 0
                ? 'Adicione fotos para continuar'
                : etapa === ETAPA.FOTOS && analisando
                  ? (<><Loader2 size={16} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> Analisando...</>)
                  : 'Continuar'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                background: loading
                  ? (isDark ? '#2a2a2a' : '#F3F4F6')
                  : 'linear-gradient(135deg, #F48FB1, #c0606a)',
                color: loading ? sub : '#fff',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(192,96,106,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading
                ? (<><Loader2 size={16} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> Publicando...</>)
                : (<><Send size={16} strokeWidth={2} /> Publicar Anúncio</>)}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          nav { padding: 0 12px !important; }
        }
      `}</style>
    </div>
  );
}
