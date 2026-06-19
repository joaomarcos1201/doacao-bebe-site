// Status canônicos do anúncio.
// Por razões históricas o banco acumulou variações para o mesmo significado
// (ex.: aprovado já foi gravado como "ATIVO", "APROVADO" e "DISPONIVEL").
// Estas listas mantêm a exibição tolerante a essas variações.

export const STATUS_APROVADO = 'DISPONIVEL';
export const STATUS_PENDENTE = 'EM_ANALISE';

const APROVADOS = ['ATIVO', 'APROVADO', 'DISPONIVEL'];
const PENDENTES = ['INATIVO', 'EM_ANALISE', 'PENDENTE'];

const normalizar = (status) => (status || '').trim().toUpperCase();

export const isAprovado = (produto) => APROVADOS.includes(normalizar(produto?.statusAnuncio));
export const isPendente = (produto) => PENDENTES.includes(normalizar(produto?.statusAnuncio));
