import React from 'react';
import { CATEGORIAS_MAP } from '../../services/iaService';

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
        display: 'flex', alignItems: 'center', gap: '10px',
        backgroundColor: isDark ? '#0a2a1a' : '#f0fdf4',
        border: '1px solid #22c55e', borderRadius: '12px', padding: '14px 16px',
      }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>Anúncio pronto para publicar!</div>
          <div style={{ fontSize: '12px', color: isDark ? '#4ade80' : '#15803d' }}>Todas as informações estão completas.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {erros.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          backgroundColor: isDark ? '#2a0a0a' : '#fef2f2',
          border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 12px',
        }}>
          <span style={{ fontSize: '14px', marginTop: '1px' }}>❌</span>
          <span style={{ fontSize: '13px', color: isDark ? '#fca5a5' : '#dc2626' }}>{a.msg}</span>
        </div>
      ))}
      {alertas.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          backgroundColor: isDark ? '#2a1a00' : '#fffbeb',
          border: '1px solid #fcd34d', borderRadius: '10px', padding: '10px 12px',
        }}>
          <span style={{ fontSize: '14px', marginTop: '1px' }}>⚠️</span>
          <span style={{ fontSize: '13px', color: isDark ? '#fcd34d' : '#92400e' }}>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}
