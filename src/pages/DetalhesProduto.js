import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL, api } from '../config/api';
import { formatarCep, validarFormatoCep, consultarCep } from '../utils/cep';
import PainelEntrega from '../components/PainelEntrega';
import {
  ArrowLeft, MapPin, Clock, Tag, ShieldCheck, Package,
  ChevronLeft, ChevronRight, X, ZoomIn, Truck, ShoppingCart,
  Sun, Moon, Search,
} from 'lucide-react';

const tempoRelativo = (data) => {
  if (!data) return null;
  const diff = Math.floor((Date.now() - new Date(data)) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return 'ontem';
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function GaleriaImagem({ fotos, isDark, border }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const src = fotos[idx];

  if (!src) return (
    <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', backgroundColor: isDark ? '#1e1e1e' : '#F9FAFB', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Package size={48} color={isDark ? '#333' : '#ddd'} strokeWidth={1} />
    </div>
  );

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setZoom(true)}
          style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${border}`, cursor: 'zoom-in', position: 'relative', backgroundColor: isDark ? '#1a1a1a' : '#fff' }}
        >
          <img src={src} alt="produto" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ZoomIn size={13} color="#fff" strokeWidth={2} />
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>Ampliar</span>
          </div>
          {fotos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + fotos.length) % fotos.length); }}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={16} color="#fff" strokeWidth={2.5} />
              </button>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % fotos.length); }}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={16} color="#fff" strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {fotos.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {fotos.map((f, i) => (
              <div key={i} onClick={() => setIdx(i)}
                style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === idx ? '#c0606a' : border}`, transition: 'border-color 0.2s' }}>
                <img src={f} alt={`foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setZoom(false)} style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#fff" strokeWidth={2} />
          </button>
          {fotos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + fotos.length) % fotos.length); }}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} color="#fff" strokeWidth={2} />
              </button>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % fotos.length); }}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} color="#fff" strokeWidth={2} />
              </button>
            </>
          )}
          <img src={src} alt="zoom" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          {fotos.length > 1 && (
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {fotos.map((_, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'background 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function DetalhesProduto() {
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cepFrete, setCepFrete] = useState('');
  const [entrega, setEntrega] = useState(null);
  const [frete, setFrete] = useState(null);
  const [loadFrete, setLoadFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState('');
  const [cepSalvo, setCepSalvo] = useState(localStorage.getItem('cep_entrega') || '');

  const bg = isDark ? '#0F0F0F' : '#F8F9FA';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#E0E0E0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setProduto)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const calcularFrete = useCallback(async () => {
    if (!validarFormatoCep(cepFrete)) return;
    setLoadFrete(true); setErroFrete(''); setEntrega(null); setFrete(null);
    try {
      const resultado = await consultarCep(cepFrete);
      if (!resultado.valido) { setErroFrete(resultado.erro); return; }
      const data = await api.calcularFrete(produto.id, cepFrete.replace(/\D/g, ''));
      const valorFrete = data.valorFrete ?? 0;
      const { endereco, opcoes } = await consultarCep(cepFrete, valorFrete);
      setFrete(valorFrete);
      setEntrega({ endereco, opcoes });
    } catch { setErroFrete('Erro ao calcular frete. Tente novamente.'); }
    finally { setLoadFrete(false); }
  }, [cepFrete, produto]);

  const handleComprar = () => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    navigate('/checkout', { state: { produto } });
  };

  const fotos = [
    produto?.foto ? `data:image/jpeg;base64,${produto.foto}` : null,
    produto?.foto2 ? `data:image/jpeg;base64,${produto.foto2}` : null,
    produto?.foto3 ? `data:image/jpeg;base64,${produto.foto3}` : null,
    produto?.foto4 ? `data:image/jpeg;base64,${produto.foto4}` : null,
  ].filter(Boolean);
  const disponivel = produto && ['ATIVO', 'DISPONIVEL', 'APROVADO'].includes((produto.statusAnuncio || '').toUpperCase());

  const Nav = () => (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: isDark ? 'rgba(15,15,15,0.96)' : 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
      padding: '0 24px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', color: sub, fontSize: '13px', fontWeight: '600' }}>
        <ArrowLeft size={14} strokeWidth={2} /> Voltar
      </button>
      <button onClick={toggleTheme} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isDark ? <Sun size={15} color="#f0c060" strokeWidth={2} /> : <Moon size={15} color="#c0606a" strokeWidth={2} />}
      </button>
    </nav>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${border}`, borderTopColor: '#c0606a', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: sub, fontSize: '14px' }}>Carregando produto...</p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!produto) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ textAlign: 'center' }}>
          <Search size={48} color={sub} strokeWidth={1} style={{ marginBottom: '16px' }} />
          <h2 style={{ color: text, margin: '0 0 8px' }}>Produto não encontrado</h2>
          <p style={{ color: sub, fontSize: '14px' }}>Este anúncio pode ter sido removido.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '28px 16px 60px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
          <span onClick={() => navigate('/home')} style={{ fontSize: '13px', color: '#c0606a', cursor: 'pointer' }}>Início</span>
          <span style={{ fontSize: '13px', color: sub }}>›</span>
          {produto.categoria && <span style={{ fontSize: '13px', color: sub, textTransform: 'capitalize' }}>{produto.categoria}</span>}
          {produto.categoria && <span style={{ fontSize: '13px', color: sub }}>›</span>}
          <span style={{ fontSize: '13px', color: sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{produto.nome}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)', gap: '24px', alignItems: 'start' }}>

          {/* ── Coluna esquerda ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <GaleriaImagem fotos={fotos} isDark={isDark} border={border} />

            {/* Card descrição */}
            <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px', boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: isDark ? '#2a2a2a' : '#FFF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={14} color="#c0606a" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: text }}>Descrição</span>
              </div>
              <p style={{ fontSize: '14px', color: isDark ? '#ccc' : '#4B5563', margin: 0, lineHeight: '1.75', whiteSpace: 'pre-wrap' }}>
                {produto.descricao || 'Sem descrição.'}
              </p>
            </div>

            {/* Card detalhes */}
            <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px', boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: isDark ? '#2a2a2a' : '#FFF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={14} color="#c0606a" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: text }}>Detalhes do produto</span>
              </div>
              {[
                { label: 'Categoria', value: produto.categoria },
                { label: 'Marca', value: produto.marca },
                { label: 'Conservação', value: produto.conservacao },
                { label: 'CEP de origem', value: produto.cepOrigem },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: '13px', color: sub }}>{label}</span>
                  <span style={{ fontSize: '13px', color: text, fontWeight: '600', textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Coluna direita ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '76px' }}>

            {/* Card principal */}
            <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '22px', boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {produto.categoria && (
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', backgroundColor: isDark ? '#2a1a1c' : '#FFF0F2', color: '#c0606a' }}>
                    {produto.categoria}
                  </span>
                )}
                {produto.conservacao && (
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', backgroundColor: isDark ? '#0a2a1a' : '#F0FDF4', color: '#16A34A' }}>
                    {produto.conservacao}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '20px', fontWeight: '800', color: text, margin: '0 0 14px', lineHeight: '1.3' }}>
                {produto.nome}
              </h1>

              {/* Preço */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#c0606a', margin: 0, lineHeight: 1 }}>
                  {produto.preco ? formatBRL(produto.preco) : 'Consultar'}
                </p>
                {produto.preco && <p style={{ fontSize: '12px', color: sub, margin: '4px 0 0' }}>+ frete calculado abaixo</p>}
              </div>

              {/* Localização */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', borderRadius: '10px', backgroundColor: isDark ? '#1a1a1a' : '#F9FAFB', marginBottom: '10px' }}>
                <MapPin size={14} color="#c0606a" strokeWidth={2} />
                <span style={{ fontSize: '13px', color: text, fontWeight: '500' }}>
                  {produto.cepOrigem || 'Brasil'}
                </span>
              </div>

              {/* Tempo */}
              {produto.dataAnuncio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
                  <Clock size={12} color={sub} strokeWidth={2} />
                  <span style={{ fontSize: '12px', color: sub }}>Publicado {tempoRelativo(produto.dataAnuncio)}</span>
                </div>
              )}

              {/* Botão comprar */}
              {disponivel ? (
                <button
                  onClick={handleComprar}
                  style={{
                    width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #F48FB1, #c0606a)',
                    color: '#fff', fontSize: '15px', fontWeight: '800',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 16px rgba(192,96,106,0.35)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(192,96,106,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(192,96,106,0.35)'; }}
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  Comprar Agora
                </button>
              ) : (
                <div style={{ padding: '14px', borderRadius: '12px', textAlign: 'center', backgroundColor: isDark ? '#1a1a1a' : '#F9FAFB', border: `1px solid ${border}` }}>
                  <span style={{ color: sub, fontSize: '14px', fontWeight: '600' }}>
                    {produto.statusAnuncio === 'RESERVADO' ? 'Produto Reservado'
                      : produto.statusAnuncio === 'VENDIDO' ? 'Produto Vendido'
                      : 'Em Análise'}
                  </span>
                </div>
              )}
            </div>

            {/* Card frete */}
            {disponivel && (
              <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px', boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: isDark ? '#2a2a2a' : '#FFF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={14} color="#c0606a" strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: text }}>Calcular Frete</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={cepFrete}
                    onChange={e => { setCepFrete(formatarCep(e.target.value)); setFrete(null); setEntrega(null); setErroFrete(''); }}
                    onKeyDown={e => e.key === 'Enter' && calcularFrete()}
                    placeholder="00000-000"
                    maxLength={9}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', border: `1.5px solid ${border}`, backgroundColor: isDark ? '#1a1a1a' : '#F9FAFB', color: text, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#c0606a'}
                    onBlur={e => e.target.style.borderColor = border}
                  />
                  <button
                    onClick={calcularFrete}
                    disabled={loadFrete || !validarFormatoCep(cepFrete)}
                    style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: validarFormatoCep(cepFrete) ? '#c0606a' : (isDark ? '#2a2a2a' : '#E5E7EB'), color: validarFormatoCep(cepFrete) ? '#fff' : sub, fontSize: '13px', fontWeight: '700', cursor: validarFormatoCep(cepFrete) ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                  >
                    {loadFrete ? (
                      <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    ) : 'Calcular'}
                  </button>
                </div>

                {erroFrete && <p style={{ fontSize: '12px', color: '#EF4444', margin: '8px 0 0' }}>{erroFrete}</p>}

                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', color: '#c0606a', textDecoration: 'none', opacity: 0.85 }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >Não sei meu CEP</a>

                {entrega && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {cepSalvo === cepFrete ? (
                      <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>✓ CEP salvo para a compra</span>
                    ) : (
                      <button
                        onClick={() => { localStorage.setItem('cep_entrega', cepFrete); setCepSalvo(cepFrete); }}
                        style={{ fontSize: '12px', fontWeight: '700', color: '#c0606a', background: 'none', border: `1px solid #c0606a`, borderRadius: '8px', padding: '5px 12px', cursor: 'pointer' }}
                      >
                        Salvar CEP para a compra
                      </button>
                    )}
                  </div>
                )}

                {entrega && (
                  <PainelEntrega
                    endereco={entrega.endereco} opcoes={entrega.opcoes}
                    isDark={isDark} border={border} text={text} sub={sub}
                    onOpcaoSelecionada={opcao => setFrete(opcao.valor)}
                  />
                )}
                {frete !== null && !entrega && (
                  <p style={{ fontSize: '14px', color: '#16A34A', fontWeight: '700', margin: '10px 0 0' }}>
                    Frete: {formatBRL(frete)}
                    {produto.preco && <span style={{ color: sub, fontWeight: '400' }}> · Total: {formatBRL(Number(produto.preco) + Number(frete))}</span>}
                  </p>
                )}
              </div>
            )}

            {/* Card vendedor */}
            {produto.vendedor && (
              <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '18px', boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 12px' }}>Anunciante</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isDark ? '#2a2a2a' : '#FFF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#c0606a' }}>
                      {(produto.vendedor.nome || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: text, margin: 0 }}>{produto.vendedor.nome}</p>
                    <p style={{ fontSize: '12px', color: sub, margin: '2px 0 0' }}>Membro da plataforma</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .det-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default DetalhesProduto;
