export interface BrazilState {
  sigla: string;
  nome: string;
  cidades: string[];
}

export const BRAZIL_STATES: BrazilState[] = [
  {
    sigla: 'AC',
    nome: 'Acre',
    cidades: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó', 'Brasiléia', 'Senador Guiomard', 'Plácido de Castro', 'Xapuri', 'Mâncio Lima']
  },
  {
    sigla: 'AL',
    nome: 'Alagoas',
    cidades: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares', 'Penedo', 'São Miguel dos Campos', 'Campo Alegre', 'Coruripe', 'Delmiro Gouveia']
  },
  {
    sigla: 'AP',
    nome: 'Amapá',
    cidades: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande', 'Mazagão', 'Tartarugalzinho', 'Vitória do Jari', 'Pedra Branca do Amapari']
  },
  {
    sigla: 'AM',
    nome: 'Amazonas',
    cidades: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari', 'Tabatinga', 'Maués', 'Tefé', 'Manicoré', 'Humaitá', 'Iranduba']
  },
  {
    sigla: 'BA',
    nome: 'Bahia',
    cidades: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Itabuna', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Teixeira de Freitas', 'Barreiras', 'Alagoinhas', 'Porto Seguro', 'Simões Filho', 'Paulo Afonso']
  },
  {
    sigla: 'CE',
    nome: 'Ceará',
    cidades: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá', 'Canindé', 'Aquiraz', 'Pacatuba', 'Cascavel']
  },
  {
    sigla: 'DF',
    nome: 'Distrito Federal',
    cidades: ['Brasília', 'Ceilândia', 'Samambaia', 'Taguatinga', 'Plano Piloto', 'Planaltina', 'Águas Claras', 'Recanto das Emas', 'Gama', 'Guará', 'Santa Maria', 'Sobradinho', 'São Sebastião', 'Vicente Pires']
  },
  {
    sigla: 'ES',
    nome: 'Espírito Santo',
    cidades: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Linhares', 'São Mateus', 'Guarapari', 'Colatina', 'Aracruz', 'Viana', 'Nova Venécia']
  },
  {
    sigla: 'GO',
    nome: 'Goiás',
    cidades: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Águas Lindas de Goiás', 'Luziânia', 'Valparaíso de Goiás', 'Trindade', 'Formosa', 'Senador Canedo', 'Itumbiara', 'Catalão', 'Jataí', 'Caldas Novas']
  },
  {
    sigla: 'MA',
    nome: 'Maranhão',
    cidades: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas', 'Santa Inês', 'Barra do Corda', 'Pinheiro']
  },
  {
    sigla: 'MT',
    nome: 'Mato Grosso',
    cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste', 'Barra do Garças', 'Cáceres', 'Alta Floresta']
  },
  {
    sigla: 'MS',
    nome: 'Mato Grosso do Sul',
    cidades: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Naviraí', 'Nova Andradina', 'Aquidauana', 'Sidrolândia', 'Paranaíba', 'Maracaju']
  },
  {
    sigla: 'MG',
    nome: 'Minas Gerais',
    cidades: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga', 'Sete Lagoas', 'Divinópolis', 'Santa Luzia', 'Ibirité', 'Poços de Caldas', 'Patos de Minas', 'Pouso Alegre', 'Teófilo Otoni', 'Varginha']
  },
  {
    sigla: 'PA',
    nome: 'Pará',
    cidades: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 'Abaetetuba', 'Cametá', 'Marituba', 'Bragança', 'São Félix do Xingu', 'Barcarena', 'Altamira', 'Tucuruí', 'Paragominas']
  },
  {
    sigla: 'PB',
    nome: 'Paraíba',
    cidades: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa', 'Cajazeiras', 'Cabedelo', 'Guarabira', 'Sapé', 'Mamanguape', 'Queimadas']
  },
  {
    sigla: 'PR',
    nome: 'Paraná',
    cidades: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá', 'Araucária', 'Toledo', 'Apucarana', 'Pinhais', 'Campo Largo', 'Arapongas', 'Almirante Tamandaré', 'Umuarama']
  },
  {
    sigla: 'PE',
    nome: 'Pernambuco',
    cidades: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão', 'Igarassu', 'São Lourenço da Mata', 'Santa Cruz do Capibaribe', 'Abreu e Lima', 'Ipojuca']
  },
  {
    sigla: 'PI',
    nome: 'Piauí',
    cidades: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Barras', 'Campo Maior', 'União', 'Altos', 'Esperantina', 'José de Freitas', 'Pedro II']
  },
  {
    sigla: 'RJ',
    nome: 'Rio de Janeiro',
    cidades: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 'Volta Redonda', 'Macaé', 'Magé', 'Itaboraí', 'Cabo Frio', 'Angra dos Reis', 'Nova Friburgo', 'Barra Mansa', 'Mesquita', 'Teresópolis', 'Maricá', 'Rio das Ostras', 'Resende']
  },
  {
    sigla: 'RN',
    nome: 'Rio Grande do Norte',
    cidades: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 'Ceará-Mirim', 'Caicó', 'Assu', 'Currais Novos', 'São José de Mipibu', 'Santa Cruz', 'Nova Cruz']
  },
  {
    sigla: 'RS',
    nome: 'Rio Grande do Sul',
    cidades: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Alvorada', 'Passo Fundo', 'Sapucaia do Sul', 'Uruguaiana', 'Santa Cruz do Sul', 'Cachoeirinha', 'Bento Gonçalves', 'Bagé', 'Erechim', 'Guaíba']
  },
  {
    sigla: 'RO',
    nome: 'Rondônia',
    cidades: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Rolim de Moura', 'Jaru', 'Guajará-Mirim', 'Machadinho D\'Oeste', 'Pimenta Bueno']
  },
  {
    sigla: 'RR',
    nome: 'Roraima',
    cidades: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima', 'Cantá', 'Mucajaí', 'Bonfim', 'Alto Alegre', 'Amajari']
  },
  {
    sigla: 'SC',
    nome: 'Santa Catarina',
    cidades: ['Joinville', 'Florianópolis', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma', 'Jaraguá do Sul', 'Palhoça', 'Lages', 'Balneário Camboriú', 'Brusque', 'Tubarão', 'São Bento do Sul', 'Camboriú', 'Navegantes', 'Caçador', 'Concórdia']
  },
  {
    sigla: 'SP',
    nome: 'São Paulo',
    cidades: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'São José dos Campos', 'Santo André', 'Ribeirão Preto', 'Osasco', 'Sorocaba', 'Mauá', 'São José do Rio Preto', 'Mogi das Cruzes', 'Santos', 'Diadema', 'Jundiaí', 'Piracicaba', 'Carapicuíba', 'Bauru', 'Itaquaquecetuba', 'São Vicente', 'Franca', 'Praia Grande', 'Guarujá', 'Taubaté', 'Limeira', 'Suzano', 'Taboão da Serra', 'Sumaré', 'Barueri', 'Embu das Artes', 'Indaiatuba', 'Cotia', 'Americana', 'Marília', 'Araraquara', 'Jacareí', 'Presidente Prudente', 'Hortolândia', 'Rio Claro', 'São Carlos', 'Araçatuba']
  },
  {
    sigla: 'SE',
    nome: 'Sergipe',
    cidades: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão', 'Estância', 'Tobias Barreto', 'Simão Dias', 'Itabaianinha', 'Poço Redondo']
  },
  {
    sigla: 'TO',
    nome: 'Tocantins',
    cidades: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 'Araguatins', 'Colinas do Tocantins', 'Guaraí', 'Tocantinópolis', 'Dianópolis']
  }
];

export function getStatesList() {
  return BRAZIL_STATES.map(s => ({ sigla: s.sigla, nome: `${s.sigla} - ${s.nome}` }));
}

export function getCitiesForState(sigla: string): string[] {
  if (!sigla) return [];
  const state = BRAZIL_STATES.find(s => s.sigla.toUpperCase() === sigla.toUpperCase());
  return state ? state.cidades : [];
}
