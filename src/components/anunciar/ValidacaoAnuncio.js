import React from 'react';
import { CircleAlert, TriangleAlert, CircleCheck } from 'lucide-react';

export default function ValidacaoAnuncio({ form, fotos, avisosIA, isDark }) {
  const avisos = [...(avisosIA || [])];

  if (fotos.length === 0) avisos.push({ tipo: 'foto', msg: 'Adicione pelo menos uma foto do produto.' });
  if (!form.nome) avisos.push({ tipo: 'campo', msg: 'Título do anúncio é obrigatório.' });
  if (form.nome && form.nome.length < 10) avisos.push({ tipo: 'campo', msg: 'Título muito curto. Seja mais descritivo.' });
  if (!form.categoria) avisos.push({ tipo: 'campo', msg: 'Selecione uma categoria.' });
  if (!form.subcategoria) avisos.push({ tipo: 'campo', msg: 'Selecione uma subcategoria.' });
  if (!form.conservacao) avisos.push({ tipo: 'campo', msg: 'Informe o estado de conservação.' });
  if (!form.preco || parseFloat(form.preco) <= 0) avisos.push({ tipo: 'campo', msg: 'Informe o preço do produto.' });
  if (!form.cepOrigem || form.cepOrigem.length < 9) avisos.push({ tipo: 'campo', msg: 'CEP de origem inválido.' });
  if (form.descricao && form.descricao.length < 30) avisos.push({ tipo: 'descricao', msg: 'Descrição muito curta. Adicione mais detalhes.' });

  const erros = avisos.filter(a => ['foto', 'campo'].includes(a.tipo));
  const alertas = avisos.filter(a => !['foto', 'campo'].includes(a.tipo));

  if (avisos.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        backgroundColor: isDark ? '#0a2a1a' : '#F0FDF4',
        border: '1.5px solid #22C55E', borderRadius: '14px', padding: '16px',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: isDark ? '#14532D' : '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <CircleCheck size={20} color="#16A34A" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#16A34A' }}>Anúncio pronto para publicar!</div>
          <div style={{ fontSize: '12px', color: isDark ? '#4ADE80' : '#15803D', marginTop: '2px' }}>Todas as informações estão completas.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {erros.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          backgroundColor: isDark ? '#2a0a0a' : '#FEF2F2',
          border: '1px solid #FCA5A5', borderRadius: '10px', padding: '12px 14px',
        }}>
          <CircleAlert size={15} color="#DC2626" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontSize: '13px', color: isDark ? '#FCA5A5' : '#DC2626', lineHeight: '1.4' }}>{a.msg}</span>
        </div>
      ))}
      {alertas.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          backgroundColor: isDark ? '#2a1a00' : '#FFFBEB',
          border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 14px',
        }}>
          <TriangleAlert size={15} color="#D97706" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontSize: '13px', color: isDark ? '#FCD34D' : '#92400E', lineHeight: '1.4' }}>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}
