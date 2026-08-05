export const formatarCep = (valor) =>
  valor.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

export const validarFormatoCep = (cep) =>
  cep.replace(/\D/g, '').length === 8;

const DIAS_UTEIS_SEMANA = [1, 2, 3, 4, 5]; // seg–sex

const adicionarDiasUteis = (dias) => {
  const data = new Date();
  let adicionados = 0;
  while (adicionados < dias) {
    data.setDate(data.getDate() + 1);
    if (DIAS_UTEIS_SEMANA.includes(data.getDay())) adicionados++;
  }
  return data;
};

const formatarDataEntrega = (data) =>
  data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

const gerarOpcoesEntrega = (valorFrete) => {
  const opcoes = [
    { id: 'pac', nome: 'PAC', icone: '📦', prazo: 8, valor: valorFrete },
    { id: 'sedex', nome: 'SEDEX', icone: '⚡', prazo: 3, valor: valorFrete > 0 ? valorFrete * 1.8 : 0 },
  ];
  if (valorFrete === 0) {
    opcoes.forEach(o => { o.valor = 0; o.gratis = true; });
  }
  return opcoes.map(o => ({
    ...o,
    dataEstimada: adicionarDiasUteis(o.prazo),
    dataFormatada: formatarDataEntrega(adicionarDiasUteis(o.prazo)),
  }));
};

/**
 * Consulta o CEP na ViaCEP e retorna endereço + opções de entrega.
 * @returns {Promise<{valido: boolean, endereco?: object, opcoes?: array, erro?: string}>}
 */
export const consultarCep = async (cep, valorFrete = 0) => {
  const numeros = cep.replace(/\D/g, '');
  if (numeros.length !== 8) return { valido: false, erro: 'CEP inválido.' };

  try {
    const res = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
    if (!res.ok) throw new Error('Erro de rede');
    const data = await res.json();
    if (data.erro) return { valido: false, erro: 'CEP não encontrado. Verifique o CEP informado e tente novamente.' };
    return {
      valido: true,
      endereco: { cep: data.cep, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf },
      opcoes: gerarOpcoesEntrega(valorFrete),
    };
  } catch {
    return { valido: false, erro: 'Não foi possível validar o CEP no momento. Tente novamente em alguns instantes.' };
  }
};

/** Mantida para compatibilidade com código existente */
export const validarCep = async (cep) => {
  const resultado = await consultarCep(cep);
  return { valido: resultado.valido, erro: resultado.erro };
};
