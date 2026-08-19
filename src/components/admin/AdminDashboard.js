import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { api } from '../../config/api';

const CORES = ['#c0606a', '#4caf50', '#ff9800', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6', '#64748b'];
const PERIODOS = [
  ['hoje', 'Hoje'], ['7d', 'Últimos 7 dias'], ['30d', 'Últimos 30 dias'],
  ['mes', 'Este mês'], ['total', 'Total geral']
];

const dinheiro = (valor) => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataCurta = (valor) => {
  if (!valor) return '';
  const [, mes, dia] = valor.split('-');
  return `${dia}/${mes}`;
};

function AdminDashboard({ isDark }) {
  const [periodo, setPeriodo] = useState('7d');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro('');
    api.buscarDashboardAdmin(periodo)
      .then(resultado => { if (ativo) setDados(resultado); })
      .catch(err => { if (ativo) setErro(err.message || 'Não foi possível carregar o Dashboard.'); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, [periodo, tentativa]);

  const painel = isDark ? '#141414' : '#fff';
  const borda = isDark ? '#2a2a2a' : '#f0e6e8';
  const texto = isDark ? '#e0e0e0' : '#333';
  const secundario = isDark ? '#888' : '#777';
  const grade = isDark ? '#2a2a2a' : '#eee';

  const tooltipStyle = { backgroundColor: painel, border: `1px solid ${borda}`, borderRadius: '8px', color: texto };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: secundario }}>Carregando Dashboard...</div>;
  if (erro) return (
    <div style={{ padding: '32px', borderRadius: '16px', backgroundColor: painel, border: `1px solid ${borda}`, textAlign: 'center' }}>
      <p style={{ color: '#ef4444', margin: '0 0 14px' }}>{erro}</p>
      <button onClick={() => setTentativa(t => t + 1)} style={{ padding: '8px 14px', cursor: 'pointer' }}>Tentar novamente</button>
    </div>
  );
  if (!dados) return null;

  const grupos = [
    ['Usuários', [
      ['Total', dados.usuarios.total], ['Ativos', dados.usuarios.ativos], ['Inativos', dados.usuarios.inativos],
      ['Administradores', dados.usuarios.administradores], ['Anunciantes', dados.usuarios.anunciantes]
    ]],
    ['Produtos', [
      ['Total', dados.produtos.total], ['Em análise', dados.produtos.emAnalise], ['Disponíveis', dados.produtos.disponiveis],
      ['Reservados', dados.produtos.reservados], ['Vendidos', dados.produtos.vendidos], ['Reprovados', dados.produtos.reprovados]
    ]],
    ['Pedidos', [
      ['Total', dados.pedidos.total], ['Pendentes', dados.pedidos.pendente], ['Aprovados', dados.pedidos.aprovado],
      ['Finalizados', dados.pedidos.finalizado], ['Liberados', dados.pedidos.liberado], ['Cancelados', dados.pedidos.cancelado]
    ]],
    ['Financeiro', [
      ['Produtos vendidos', dinheiro(dados.financeiro.valorProdutosVendidos)], ['Fretes', dinheiro(dados.financeiro.valorFretes)],
      ['Total dos pedidos', dinheiro(dados.financeiro.valorTotalPedidos)], ['Saldo retido atual', dinheiro(dados.financeiro.saldoRetidoAtual)],
      ['Saldo disponível atual', dinheiro(dados.financeiro.saldoLiberadoAtual)], ['Comissões', dinheiro(dados.financeiro.totalComissoes)],
      ['Saques', `${dados.financeiro.totalSaques} · ${dinheiro(dados.financeiro.valorTotalSaques)}`]
    ]]
  ];

  const prepararDatas = lista => (lista || []).map(item => ({ ...item, dataLabel: dataCurta(item.data) }));

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: texto }}>Dashboard</h1>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: secundario }}>Visão geral com dados reais do sistema</p>
        </div>
        <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borda}`, backgroundColor: painel, color: texto }}>
          {PERIODOS.map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
        </select>
      </div>

      {grupos.map(([titulo, metricas]) => (
        <div key={titulo} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', color: secundario, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{titulo}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '10px' }}>
            {metricas.map(([label, valor]) => (
              <div key={label} style={{ padding: '16px', borderRadius: '14px', backgroundColor: painel, border: `1px solid ${borda}` }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: texto, overflowWrap: 'anywhere' }}>{valor ?? 0}</div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: secundario }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 430px), 1fr))', gap: '16px' }}>
        <ChartCard titulo="Pedidos criados por período" painel={painel} borda={borda} texto={texto} vazio={!dados.pedidosPorPeriodo?.length}>
          <ResponsiveContainer width="100%" height={280}><LineChart data={prepararDatas(dados.pedidosPorPeriodo)}><CartesianGrid stroke={grade} /><XAxis dataKey="dataLabel" stroke={secundario} /><YAxis allowDecimals={false} stroke={secundario} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="quantidade" name="Pedidos" stroke="#c0606a" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard titulo="Valor das vendas registradas por período" subtitulo="Agrupado pela data de criação do pedido" painel={painel} borda={borda} texto={texto} vazio={!dados.valoresPorPeriodo?.length}>
          <ResponsiveContainer width="100%" height={280}><LineChart data={prepararDatas(dados.valoresPorPeriodo)}><CartesianGrid stroke={grade} /><XAxis dataKey="dataLabel" stroke={secundario} /><YAxis stroke={secundario} /><Tooltip contentStyle={tooltipStyle} formatter={dinheiro} /><Legend /><Line type="monotone" dataKey="produtos" name="Produtos" stroke="#c0606a" /><Line type="monotone" dataKey="frete" name="Frete" stroke="#3b82f6" /><Line type="monotone" dataKey="total" name="Total" stroke="#4caf50" /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard titulo="Novos usuários" painel={painel} borda={borda} texto={texto} vazio={!dados.usuariosPorPeriodo?.length}>
          <ResponsiveContainer width="100%" height={280}><BarChart data={prepararDatas(dados.usuariosPorPeriodo)}><CartesianGrid stroke={grade} /><XAxis dataKey="dataLabel" stroke={secundario} /><YAxis allowDecimals={false} stroke={secundario} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="quantidade" name="Usuários" fill="#8b5cf6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard titulo="Produtos cadastrados" painel={painel} borda={borda} texto={texto} vazio={!dados.produtosPorPeriodo?.length}>
          <ResponsiveContainer width="100%" height={280}><BarChart data={prepararDatas(dados.produtosPorPeriodo)}><CartesianGrid stroke={grade} /><XAxis dataKey="dataLabel" stroke={secundario} /><YAxis allowDecimals={false} stroke={secundario} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="quantidade" name="Produtos" fill="#ff9800" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <PieCard titulo="Status dos produtos" dados={dados.statusProdutos} {...{ painel, borda, texto, tooltipStyle }} />
        <PieCard titulo="Status dos pedidos" dados={dados.statusPedidos} {...{ painel, borda, texto, tooltipStyle }} />
        <RankingCard titulo="Categorias com mais anúncios" dados={dados.categoriasAnuncios} {...{ painel, borda, texto, secundario }} />
        <RankingCard titulo="Categorias com mais vendas concluídas" dados={dados.categoriasVendas} {...{ painel, borda, texto, secundario }} />
      </div>

      <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', backgroundColor: painel, border: `1px solid ${borda}`, color: secundario, fontSize: '12px' }}>
        Saques: {dados.financeiro.saquesPendentes} pendentes, {dados.financeiro.saquesAprovados} aprovados e {dados.financeiro.saquesRejeitados} rejeitados. Saldos exibidos são valores atuais, independentemente do período.
      </div>
    </section>
  );
}

function ChartCard({ titulo, subtitulo, painel, borda, texto, vazio, children }) {
  return <div style={{ padding: '18px', borderRadius: '16px', backgroundColor: painel, border: `1px solid ${borda}`, minWidth: 0 }}><h3 style={{ margin: 0, fontSize: '15px', color: texto }}>{titulo}</h3>{subtitulo && <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0' }}>{subtitulo}</p>}<div style={{ marginTop: '16px' }}>{vazio ? <Vazio /> : children}</div></div>;
}

function PieCard({ titulo, dados = [], painel, borda, texto, tooltipStyle }) {
  return <ChartCard {...{ titulo, painel, borda, texto }} vazio={!dados.length}><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={dados} dataKey="quantidade" nameKey="nome" cx="50%" cy="45%" outerRadius={85} label>{dados.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend /></PieChart></ResponsiveContainer></ChartCard>;
}

function RankingCard({ titulo, dados = [], painel, borda, texto, secundario }) {
  return <ChartCard {...{ titulo, painel, borda, texto }} vazio={!dados.length}><div>{dados.slice(0, 10).map((item, i) => <div key={`${item.nome}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${borda}` }}><span style={{ color: secundario, fontSize: '13px' }}>{i + 1}. {item.nome}</span><strong style={{ color: texto }}>{item.quantidade}</strong></div>)}</div></ChartCard>;
}

function Vazio() {
  return <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '13px' }}>Sem dados no período.</div>;
}

export default AdminDashboard;
