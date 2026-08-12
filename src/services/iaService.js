/**
 * Serviço de IA desacoplado.
 * Para integrar com AWS Rekognition, Bedrock, OpenAI Vision ou Google Vision AI,
 * substitua apenas a função `analisarImagens` mantendo o contrato de retorno.
 */

export const CATEGORIAS_MAP = {
  passeio: {
    label: 'Passeio',
    icon: null,
    subcategorias: ['Carrinhos de Bebê', 'Bebê Conforto', 'Cadeirinha para Carro', 'Berço Portátil'],
  },
  quarto: {
    label: 'Quarto do Bebê',
    icon: null,
    subcategorias: ['Berços', 'Mini Berços', 'Cercados', 'Trocadores', 'Móbiles'],
  },
  higiene: {
    label: 'Higiene e Cuidados',
    icon: null,
    subcategorias: ['Kit Higiene', 'Fraldas', 'Lixeiras para Fraldas', 'Toalhas', 'Escovas', 'Kit de Cuidados'],
  },
  roupas: {
    label: 'Roupas',
    icon: null,
    subcategorias: ['Bodies', 'Macacões', 'Vestidos', 'Conjuntos', 'Meias e Toucas', 'Calçados', 'Casacos', 'Enxoval'],
  },
  brinquedos: {
    label: 'Brinquedos',
    icon: null,
    subcategorias: ['Tapetes de Atividades', 'Chocalhos', 'Mordedores', 'Brinquedos Educativos', 'Livros Infantis'],
  },
  maternidade: {
    label: 'Maternidade',
    icon: null,
    subcategorias: ['Bolsas Maternidade', 'Almofadas de Amamentação', 'Bombas Tira-Leite', 'Sutiãs', 'Cintas Pós-Parto', 'Kits Maternidade'],
  },
  banho: {
    label: 'Banho',
    icon: null,
    subcategorias: ['Banheiras', 'Cadeiras de Banho', 'Toalhas com Capuz', 'Kits de Banho'],
  },
};

const PRECOS_BASE = {
  'carrinho': { min: 300, max: 1200, medio: 650 },
  'berço': { min: 200, max: 800, medio: 420 },
  'cadeirinha': { min: 150, max: 600, medio: 320 },
  'bebe conforto': { min: 100, max: 400, medio: 220 },
  'almofada': { min: 50, max: 200, medio: 110 },
  'bomba': { min: 80, max: 500, medio: 250 },
  'body': { min: 8, max: 50, medio: 25 },
  'banheira': { min: 60, max: 250, medio: 130 },
  'default': { min: 30, max: 200, medio: 80 },
};

const MULTIPLICADOR_CONSERVACAO = {
  'Novo': 1.0,
  'Seminovo': 0.75,
  'Bom Estado': 0.55,
  'Com Marcas de Uso': 0.35,
};

const RECONHECIMENTO_SIMULADO = [
  { keywords: ['carrinho', 'stroller'], categoria: 'passeio', subcategoria: 'Carrinhos de Bebê', produto: 'Carrinho de Bebê', faixaEtaria: '0 a 3 anos', confianca: 0.92 },
  { keywords: ['bebe conforto', 'bebê conforto', 'conforto'], categoria: 'passeio', subcategoria: 'Bebê Conforto', produto: 'Bebê Conforto', faixaEtaria: '0 a 12 meses', confianca: 0.90 },
  { keywords: ['cadeirinha', 'cadeira carro'], categoria: 'passeio', subcategoria: 'Cadeirinha para Carro', produto: 'Cadeirinha para Automóvel', faixaEtaria: '0 a 4 anos', confianca: 0.88 },
  { keywords: ['berco', 'berço'], categoria: 'quarto', subcategoria: 'Berços', produto: 'Berço', faixaEtaria: '0 a 2 anos', confianca: 0.91 },
  { keywords: ['mini berco', 'mini berço', 'berco portatil'], categoria: 'quarto', subcategoria: 'Mini Berços', produto: 'Mini Berço', faixaEtaria: '0 a 6 meses', confianca: 0.89 },
  { keywords: ['cercado', 'chiqueirinho'], categoria: 'quarto', subcategoria: 'Cercados', produto: 'Cercado', faixaEtaria: '6 meses a 2 anos', confianca: 0.87 },
  { keywords: ['mamadeira'], categoria: 'maternidade', subcategoria: 'Kits Maternidade', produto: 'Mamadeira', faixaEtaria: '0 a 18 meses', confianca: 0.93 },
  { keywords: ['chupeta'], categoria: 'maternidade', subcategoria: 'Kits Maternidade', produto: 'Chupeta', faixaEtaria: '0 a 24 meses', confianca: 0.95 },
  { keywords: ['esterilizador'], categoria: 'maternidade', subcategoria: 'Kits Maternidade', produto: 'Esterilizador', faixaEtaria: '0 a 24 meses', confianca: 0.90 },
  { keywords: ['almofada'], categoria: 'maternidade', subcategoria: 'Almofadas de Amamentação', produto: 'Almofada de Amamentação', faixaEtaria: '0 a 12 meses', confianca: 0.88 },
  { keywords: ['bomba', 'tira leite'], categoria: 'maternidade', subcategoria: 'Bombas Tira-Leite', produto: 'Bomba Tira-Leite', faixaEtaria: 'Maternidade', confianca: 0.86 },
  { keywords: ['bolsa maternidade', 'mochila maternidade'], categoria: 'maternidade', subcategoria: 'Bolsas Maternidade', produto: 'Bolsa Maternidade', faixaEtaria: 'Maternidade', confianca: 0.89 },
  { keywords: ['banheira'], categoria: 'banho', subcategoria: 'Banheiras', produto: 'Banheira de Bebê', faixaEtaria: '0 a 2 anos', confianca: 0.91 },
  { keywords: ['cadeira alimentacao', 'cadeira refeicao'], categoria: 'banho', subcategoria: 'Cadeiras de Banho', produto: 'Cadeira de Alimentação', faixaEtaria: '6 meses a 3 anos', confianca: 0.90 },
  { keywords: ['body', 'bodinho'], categoria: 'roupas', subcategoria: 'Bodies', produto: 'Body Infantil', faixaEtaria: '0 a 12 meses', confianca: 0.87 },
  { keywords: ['macacao', 'macacão'], categoria: 'roupas', subcategoria: 'Macacões', produto: 'Macacão Infantil', faixaEtaria: '0 a 24 meses', confianca: 0.86 },
  { keywords: ['vestido'], categoria: 'roupas', subcategoria: 'Vestidos', produto: 'Vestido Infantil', faixaEtaria: '0 a 3 anos', confianca: 0.88 },
  { keywords: ['tapete'], categoria: 'brinquedos', subcategoria: 'Tapetes de Atividades', produto: 'Tapete de Atividades', faixaEtaria: '0 a 18 meses', confianca: 0.85 },
  { keywords: ['mobile', 'móbile'], categoria: 'quarto', subcategoria: 'Móbiles', produto: 'Móbile Musical', faixaEtaria: '0 a 12 meses', confianca: 0.84 },
  { keywords: ['chocalho'], categoria: 'brinquedos', subcategoria: 'Chocalhos', produto: 'Chocalho', faixaEtaria: '0 a 12 meses', confianca: 0.92 },
  { keywords: ['mordedor'], categoria: 'brinquedos', subcategoria: 'Mordedores', produto: 'Mordedor', faixaEtaria: '3 a 18 meses', confianca: 0.91 },
  { keywords: ['trocador'], categoria: 'quarto', subcategoria: 'Trocadores', produto: 'Trocador', faixaEtaria: '0 a 2 anos', confianca: 0.89 },
  { keywords: ['higiene'], categoria: 'higiene', subcategoria: 'Kit Higiene', produto: 'Kit Higiene Bebê', faixaEtaria: '0 a 3 anos', confianca: 0.86 },
  { keywords: ['fralda'], categoria: 'higiene', subcategoria: 'Fraldas', produto: 'Fraldas', faixaEtaria: '0 a 3 anos', confianca: 0.94 },
  { keywords: ['toalha'], categoria: 'banho', subcategoria: 'Toalhas com Capuz', produto: 'Toalha com Capuz', faixaEtaria: '0 a 3 anos', confianca: 0.88 },
  { keywords: ['enxoval'], categoria: 'roupas', subcategoria: 'Enxoval', produto: 'Enxoval de Bebê', faixaEtaria: '0 a 3 meses', confianca: 0.87 },
];

const CORES = ['Branco', 'Preto', 'Cinza', 'Azul', 'Rosa', 'Bege', 'Verde', 'Amarelo', 'Vermelho', 'Lilás'];
const MARCAS = ['Burigotto', 'Galzerano', 'Graco', 'Chicco', 'Maxi-Cosi', 'Safety 1st', 'Kiddo', 'Infanti', 'Multikids', 'Fisher-Price'];

function detectarPorNomeArquivo(nomes) {
  const texto = nomes.join(' ').toLowerCase();
  for (const item of RECONHECIMENTO_SIMULADO) {
    if (item.keywords.some(k => texto.includes(k))) return item;
  }
  return null;
}

function gerarTitulo(produto, marca, cor, conservacao) {
  const partes = [produto];
  if (marca) partes.push(marca);
  if (cor) partes.push(cor);
  if (conservacao && conservacao !== 'Novo') partes.push(conservacao);
  return partes.join(' ');
}

function gerarDescricao(produto, conservacao, faixaEtaria) {
  const estadoTexto = {
    'Novo': 'em perfeito estado, nunca utilizado',
    'Seminovo': 'em ótimo estado de conservação, com pouquíssimo uso',
    'Bom Estado': 'em bom estado, com marcas mínimas de uso',
    'Com Marcas de Uso': 'com marcas de uso normais, funcionando perfeitamente',
  }[conservacao] || 'em bom estado';
  return `${produto} ${estadoTexto}. Produto higienizado e pronto para uso.${faixaEtaria ? ` Indicado para ${faixaEtaria}.` : ''} Todas as peças originais presentes. Ótima oportunidade para quem busca qualidade com economia.`;
}

function sugerirPreco(produto, conservacao) {
  const chave = Object.keys(PRECOS_BASE).find(k => produto.toLowerCase().includes(k)) || 'default';
  const base = PRECOS_BASE[chave];
  const mult = MULTIPLICADOR_CONSERVACAO[conservacao] || 0.6;
  return {
    sugerido: Math.round(base.medio * mult),
    min: Math.round(base.min * mult),
    max: Math.round(base.max * mult),
  };
}

function validarImagens(arquivos) {
  const avisos = [];
  const vistos = new Set();
  arquivos.forEach((f, i) => {
    if (f.size < 20000) avisos.push({ tipo: 'qualidade', msg: `Foto ${i + 1}: resolução muito baixa. Envie uma foto mais nítida.` });
    if (!f.type.startsWith('image/')) avisos.push({ tipo: 'formato', msg: `Arquivo ${i + 1}: formato inválido. Use JPG, PNG ou WEBP.` });
    const chave = `${f.name}-${f.size}`;
    if (vistos.has(chave)) avisos.push({ tipo: 'duplicada', msg: `Foto ${i + 1}: parece duplicada. Remova fotos repetidas.` });
    vistos.add(chave);
  });
  return avisos;
}

/**
 * Ponto de integração principal.
 * Substitua este corpo para conectar com AWS Rekognition, Bedrock, OpenAI Vision, etc.
 */
export async function analisarImagens(arquivos) {
  await new Promise(r => setTimeout(r, 2200));

  const avisos = validarImagens(arquivos);
  const reconhecido = detectarPorNomeArquivo(arquivos.map(f => f.name));

  if (!reconhecido) {
    return {
      sucesso: true,
      confianca: 0.45,
      sugestoes: [
        { categoria: 'roupas', subcategoria: 'Bodies', produto: 'Roupa Infantil', faixaEtaria: '0 a 24 meses' },
        { categoria: 'brinquedos', subcategoria: 'Brinquedos Educativos', produto: 'Brinquedo Infantil', faixaEtaria: '0 a 3 anos' },
        { categoria: 'higiene', subcategoria: 'Kit Higiene', produto: 'Item de Higiene', faixaEtaria: '0 a 3 anos' },
      ],
      cor: CORES[0], marca: '', conservacao: 'Bom Estado',
      titulo: '', descricao: '', precoSugerido: null, avisos,
    };
  }

  const cor = CORES[Math.floor(Math.random() * CORES.length)];
  const marca = MARCAS[Math.floor(Math.random() * 5)];
  const conservacao = 'Seminovo';

  return {
    sucesso: true,
    confianca: reconhecido.confianca,
    categoria: reconhecido.categoria,
    subcategoria: reconhecido.subcategoria,
    produto: reconhecido.produto,
    faixaEtaria: reconhecido.faixaEtaria,
    cor, marca, conservacao,
    titulo: gerarTitulo(reconhecido.produto, marca, cor, conservacao),
    descricao: gerarDescricao(reconhecido.produto, conservacao, reconhecido.faixaEtaria),
    precoSugerido: sugerirPreco(reconhecido.produto, conservacao),
    avisos,
  };
}
