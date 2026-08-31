import type { InstitutionalPage } from './types'

/**
 * Conteudo institucional da APAE de Apiuna (dados reais).
 * Organizado em subpaginas de blocos. Serve de base ate o backend/Admin assumir.
 */
export const apiunaInstitucional: InstitutionalPage[] = [
  // ---------------------------------------------------------------- Historico
  {
    slug: 'historico',
    title: 'Histórico',
    subtitle: 'A trajetória da APAE de Apiúna.',
    order: 1,
    blocks: [
      {
        type: 'paragraph',
        text: 'Em 1993, com o empenho e dedicação da Secretaria da Educação na pessoa da senhora Sueli Moser, então secretária, juntamente com seu Belfir Moser e Mário Roedel, iniciou-se o movimento apaeano em nosso município, atendendo 5 alunos e contando apenas com voluntários. Em 8 de setembro de 1994, sob orientação da APAE de Presidente Getúlio, iniciava-se o atendimento efetivo, com cedência de professores e equipe técnica às pessoas com deficiência do município de Apiúna.',
      },
      {
        type: 'paragraph',
        text: 'A APAE funcionou como extensão de Presidente Getúlio até o dia 24 de agosto de 1995, quando tomou posse a primeira diretoria da APAE de Apiúna, na oportunidade optando por nomeá-la Escola Especial "Academia do Amor".',
      },
      {
        type: 'paragraph',
        text: 'Passou então a atender 18 alunos do município e, a partir de 1999, começou a atender também as pessoas com deficiência do município de Ascurra.',
      },
      {
        type: 'paragraph',
        text: 'Em 1999, foi criado o regimento da escola com a participação de representantes de toda a comunidade escolar e da diretoria do órgão mantenedor. Além do caráter mantenedor, a Associação busca colocar em prática projetos que visem à prevenção de deficiências intelectuais e à inclusão, tanto no ensino regular quanto no mercado de trabalho, procurando promover seus serviços em sua plenitude.',
      },
      {
        type: 'highlight',
        icon: '🎯',
        title: 'Objetivo',
        text: 'Proporcionar o atendimento à pessoa com Deficiência Intelectual e Múltipla, promovendo seu desenvolvimento físico, social, psíquico, intelectual e profissional, facilitando sua inclusão.',
      },
      {
        type: 'keyValue',
        title: 'Identificação da entidade',
        rows: [
          { label: 'Nome', value: 'APAE – Associação de Pais e Amigos dos Excepcionais de Apiúna' },
          { label: 'CNPJ', value: '00.814.388/0001-64' },
          { label: 'Endereço', value: 'Rua Ponta Grossa, 93 — Centro, Apiúna-SC' },
          { label: 'CEP', value: '89135-000' },
          { label: 'Telefone', value: '(47) 3353-0244' },
          { label: 'Categoria', value: 'Sociedade Civil, Pessoa Jurídica de Direito Privado, de caráter assistencial, sem fins lucrativos e com duração por tempo indeterminado.' },
        ],
      },
      {
        type: 'highlight',
        icon: '💚',
        title: 'Missão',
        text: 'Promover a inclusão e a melhoria da qualidade de vida de todas as pessoas.',
      },
      {
        type: 'highlight',
        icon: '👁️',
        title: 'Visão',
        text: 'Ser reconhecida pela excelência no atendimento, inclusão e promoção da qualidade de vida de todas as pessoas.',
      },
      {
        type: 'list',
        title: 'Valores',
        variant: 'check',
        items: [
          'Conhecimento',
          'Eficácia',
          'Ética',
          'Inovação',
          'Moralidade',
          'Inclusão',
          'Equidade',
          'Respeito',
          'Compromisso',
          'Transparência',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Presidente
  {
    slug: 'presidente',
    title: 'Presidente',
    subtitle: 'Responsável atual pela entidade.',
    order: 2,
    blocks: [
      {
        type: 'person',
        name: 'Juliano Atalíbio Bittencourt',
        role: 'Presidente da APAE de Apiúna',
        note: 'Responsável atual pela entidade.',
      },
      {
        type: 'highlight',
        icon: '🎯',
        title: 'Objetivo',
        text: 'Proporcionar o atendimento à pessoa com Deficiência Intelectual e Múltipla, promovendo seu desenvolvimento físico, social, psíquico, intelectual e profissional, facilitando sua inclusão.',
      },
    ],
  },

  // ------------------------------------------------- Estrutura organizacional
  {
    slug: 'estrutura-organizacional',
    title: 'Estrutura organizacional',
    subtitle: 'Diretoria executiva, procuradoria e conselhos.',
    order: 3,
    blocks: [
      {
        type: 'people',
        title: 'Diretoria Executiva',
        members: [
          { role: 'Presidente', name: 'Juliano Atalíbio Bittencourt' },
          { role: 'Vice-Presidente', name: 'Euclides Pedroso' },
          { role: '1º Diretor Secretário', name: 'Vera Lúcia Rezini' },
          { role: '2º Diretor Secretário', name: 'Ana Mélia Soares de Brito Machado' },
          { role: '1º Diretor Financeiro', name: 'Sidnéia Aparecida de Souza' },
          { role: '2º Diretor Financeiro', name: 'Fabio Cerutti' },
          { role: 'Diretor de Patrimônio', name: 'Jeferson França' },
          { role: 'Diretor Social', name: 'Solange Poli' },
        ],
      },
      {
        type: 'people',
        title: 'Procuradoria Geral',
        members: [{ role: 'Procurador Jurídico', name: 'Willy Whoel' }],
      },
      {
        type: 'people',
        title: 'Conselho Fiscal',
        members: [
          { role: 'Conselheiro Fiscal', name: 'Marcelo Deluca' },
          { role: 'Conselheiro Fiscal', name: 'Maria Cardoso Zambonetti' },
          { role: 'Conselheiro Fiscal', name: 'Vanessa Girardi Fistarol' },
          { role: 'Suplente', name: 'Giani Fátima Berlanda' },
          { role: 'Suplente', name: 'Wilian Darlan Bonomini' },
          { role: 'Suplente', name: 'Mara Cristina Mendes da Silva' },
        ],
      },
      {
        type: 'people',
        title: 'Conselho de Administração',
        members: [
          { role: 'Membro', name: 'Antônio Carlos Burini' },
          { role: 'Membro', name: 'Jucelia Grzybovsky' },
          { role: 'Membro', name: 'Lirio Girardi' },
          { role: 'Membro', name: 'Lucéia Meier Gochinski Dziedricki' },
          { role: 'Membro', name: 'Rosimar Bernardi' },
          { role: 'Membro', name: 'Tarciano Henrique Kern' },
          { role: 'Membro', name: 'Dilma Rosa E. da Silva' },
        ],
      },
    ],
  },

  // -------------------------------------------------- Programas pedagogicos
  {
    slug: 'programas-pedagogicos',
    title: 'Programas Pedagógicos',
    subtitle: 'Programas organizados por faixa etária e necessidades do educando.',
    order: 4,
    blocks: [
      {
        type: 'paragraph',
        text: 'A APAE de Apiúna tem por objetivo o desenvolvimento global do educando com necessidades especiais, tornando-o capaz de desenvolver suas habilidades dentro das possibilidades e limites de sua deficiência, buscando sempre atividades práticas que o levem a compreender de maneira real e concreta as situações do dia a dia.',
      },
      {
        type: 'paragraph',
        text: 'Tornar nosso educando o mais independente possível, dentro de suas possibilidades. Na APAE, cada programa tem suas metas e objetivos relacionados à faixa etária envolvida.',
      },
      {
        type: 'cards',
        title: 'Programas por faixa etária',
        cards: [
          { icon: '🍼', title: 'Estimulação Precoce', description: '0 ano a 5 anos e 11 meses.' },
          { icon: '📘', title: 'Serviço Pedagógico Específico (SPE)', description: '6 anos a 17 anos e 11 meses.' },
          { icon: '🧠', title: 'Atendimento Educacional Especializado (AEE)', description: '6 anos a 17 anos e 11 meses.' },
          { icon: '🤝', title: 'Serviço de Atendimento Especializado (SAE)', description: 'Acima de 18 anos.' },
          { icon: '🛠️', title: 'Serviço de Vivências Laborais', description: 'Acima de 14 anos.' },
          { icon: '💼', title: 'PROEP – Iniciação para o Trabalho', description: 'Acima de 17 anos.' },
        ],
      },
      {
        type: 'heading',
        text: 'Estimulação Precoce',
      },
      {
        type: 'paragraph',
        text: 'O atendimento neste programa tem como objetivo o desenvolvimento integral dos aspectos físicos, psicológicos, sociais e culturais de crianças de 3 a 5 anos e 11 meses, com atraso no desenvolvimento neuropsicomotor, síndromes, paralisia cerebral e casos de risco como baixo apgar, baixo peso, prematuridade, desnutrição, vulnerabilidade social, econômica e cultural, e filhos de pais com deficiência intelectual, considerando primordial a construção harmônica do desenvolvimento da primeira infância.',
      },
      {
        type: 'paragraph',
        text: 'A estimulação essencial une a neuroplasticidade cerebral à capacidade de aprendizagem. São ações e atividades planejadas de maneira natural e lúdica que estimulam a criança, ampliando a possibilidade de vivenciar o mundo e adquirir habilidades para registrar e entender o que ocorre ao seu redor.',
      },
      {
        type: 'paragraph',
        text: 'As intervenções clínico-pedagógicas atuam nas funções cognitivas, motoras e sociais, buscando o desenvolvimento de habilidades adaptativas conceituais, sociais e práticas. São orientadas pela equipe multiprofissional — fisioterapeutas, fonoaudiólogos, terapeutas ocupacionais, médico neurologista e pedagogos — de acordo com as individualidades e necessidades de cada criança. A família é parte integrante das intervenções e recebe orientações para dar continuidade em seus lares.',
      },
      {
        type: 'heading',
        text: 'Serviço Pedagógico Específico (SPE)',
      },
      {
        type: 'paragraph',
        text: 'Nesta modalidade são atendidos alunos de 6 a 17 anos e 11 meses com alterações importantes no processo de desenvolvimento, aprendizagem e adaptação social. O programa segue um currículo funcional natural, com aulas de musicalização, psicomotricidade, atividades da vida diária e alfabetização, em espaços organizados de maneira facilitadora à aprendizagem, buscando torná-los mais independentes, produtivos e aceitos socialmente.',
      },
      {
        type: 'paragraph',
        text: '"Currículo funcional é ensinar conhecimentos e habilidades que possam ser usadas pelo estudante, que sejam úteis em diferentes ambientes e que continuem sendo úteis através do tempo." (Le Blanc, 1992).',
      },
      {
        type: 'heading',
        text: 'TGD / TEA',
      },
      {
        type: 'paragraph',
        text: 'O serviço atende pessoas com diagnóstico de deficiência intelectual moderada ou severa associada a outros transtornos. Busca, por meio de atividades pedagógicas e clínicas, condições que favoreçam o desenvolvimento nas áreas motora, da linguagem, cognição, cuidados pessoais, socialização e desenvolvimento de habilidades significativas para a vida. Os assistidos participam de atividades extraclasse de Educação Física, Artes, Informática e Ensino Religioso, com duração de 45 minutos cada.',
      },
      {
        type: 'heading',
        text: 'AEE – Atendimento Educacional Especializado',
      },
      {
        type: 'paragraph',
        text: 'Serviço da Educação Especial que cria condições para o desenvolvimento das funções cognitivas (atenção voluntária, memória, criatividade, imaginação, pensamento, linguagem, controle do comportamento, capacidade de planejamento), favorecendo a construção e a internalização de conceitos introduzidos pela escola regular. O AEE não substitui a escolarização e está condicionado à matrícula na classe regular da educação básica, sendo realizado no período inverso ao da classe frequentada pelo aluno.',
      },
      {
        type: 'highlight',
        icon: '🎯',
        title: 'Objetivo do AEE',
        text: 'Qualificar as funções psicológicas superiores do educando para a autorregulação de sua estrutura cognitiva e construção de conceitos, mediante intervenções pedagógicas que possibilitem avanços no seu processo de aprendizagem.',
      },
      {
        type: 'paragraph',
        text: 'Estrutura e funcionamento: o AEE/DI é realizado após avaliação diagnóstica e funcional do aluno, por uma equipe composta de, no mínimo, um médico, um psicólogo e um pedagogo. Atendimento em grupo de no máximo quatro alunos por turma (individual em caráter temporário quando necessário), no mínimo duas vezes por semana, com carga horária de 90 minutos por atendimento.',
      },
      {
        type: 'heading',
        text: 'Serviço de Atendimento Especializado (SAE)',
      },
      {
        type: 'paragraph',
        text: 'A proposta do SAE realiza estratégias baseadas no "Currículo Funcional Natural", contribuindo para o desenvolvimento dos alunos na construção do conhecimento, na independência, na autonomia e nas habilidades funcionais para a vida. O planejamento acontece por meio de projetos, com base em quatro áreas: ocupacional, doméstica, comunitária e escolar.',
      },
      {
        type: 'list',
        title: 'Objetivos específicos do SAE',
        variant: 'check',
        items: [
          'Desenvolver maior independência quanto à higiene pessoal e do ambiente, alimentação e vestuário',
          'Minimizar ou eliminar comportamentos inadequados',
          'Demonstrar atitudes de respeito para consigo, com o outro e com a comunidade',
          'Trabalhar a autoestima e a afetividade',
          'Desenvolver a socialização e a permanência nos diversos ambientes',
          'Oportunizar a conscientização corporal e o estímulo sensorial',
          'Desenvolver habilidades de comunicação, fazendo-se compreensível',
          'Aprimorar as habilidades acadêmicas e motoras',
          'Desenvolver a expressão dos sentimentos por meio de atividades artísticas',
        ],
      },
      {
        type: 'heading',
        text: 'Serviço de Vivências Laborais (SVL)',
      },
      {
        type: 'paragraph',
        text: 'Direcionado a pessoas com Deficiência Intelectual e Múltipla que, devido à significância de sua deficiência, não apresentam condições de inserção no programa de Qualificação para o Mercado de Trabalho. Tem por objetivo a integração social por meio de atividades de adaptação e capacitação para o trabalho, através de projetos como artesanato, horta e papel reciclado, com atividades complementares no laboratório de informática.',
      },
      {
        type: 'heading',
        text: 'PROEP – Iniciação para o Trabalho',
      },
      {
        type: 'paragraph',
        text: 'Programa voltado à iniciação para o trabalho, atende alunos com idade superior a 17 anos, com deficiência intelectual ou múltipla, e ocupa-se de desenvolver o potencial de trabalho: hábitos e atitudes de postura adequada, aperfeiçoamento de conhecimentos básicos para a profissionalização e treinamento para o exercício de atividades profissionais e futura colocação no mercado. A qualificação é subdividida em: Iniciação para o Trabalho, Qualificação para o Trabalho e Colocação no Trabalho.',
      },
      {
        type: 'heading',
        text: 'Avaliação',
      },
      {
        type: 'paragraph',
        text: 'No Serviço de Estimulação Precoce, o acompanhamento é feito através do "Portage", guia que operacionaliza cada um dos 580 itens do Inventário Portage e abrange cinco áreas de desenvolvimento: motor, cognição, linguagem, socialização e autocuidados. Nos demais serviços, a avaliação é diagnóstica, descritiva e contínua, com base no Plano de Intervenção e Avaliação individual (PDI/PAI/PEI). A avaliação mais detalhada é encontrada no ECA – Escala de Comportamento Adaptativo da APAE.',
      },
    ],
  },

  // ------------------------------------------------ Programas de atendimento
  {
    slug: 'programas-de-atendimento',
    title: 'Programas de atendimento',
    subtitle: 'Áreas de atuação e equipe multiprofissional.',
    order: 5,
    blocks: [
      {
        type: 'cards',
        title: 'Áreas de atendimento',
        cards: [
          { icon: '🩺', title: 'Saúde', description: 'Medicina, enfermagem, fisioterapia, fonoaudiologia, nutrição, terapia ocupacional e odontologia.' },
          { icon: '🧑\u200d🏫', title: 'Educação', description: 'Artes, Educação Física e Informática, além do atendimento pedagógico especializado.' },
          { icon: '🤝', title: 'Serviço Social', description: 'Acolhimento das famílias, orientação e garantia de direitos.' },
          { icon: '🧩', title: 'Psicologia', description: 'Acompanhamento e apoio ao desenvolvimento do educando.' },
        ],
      },
      {
        type: 'paragraph',
        text: 'As atividades pedagógicas ocorrem em parceria com a equipe técnica multiprofissional, visando à melhor qualidade de vida e ao desempenho das atividades funcionais do educando.',
      },
    ],
  },

  // --------------------------------------------------------------- Profissionais
  {
    slug: 'profissionais',
    title: 'Profissionais',
    subtitle: 'Equipe multiprofissional que atende os educandos.',
    order: 6,
    blocks: [
      {
        type: 'paragraph',
        text: 'A APAE de Apiúna conta com uma equipe multiprofissional que atua de forma integrada no atendimento aos educandos e no apoio às famílias.',
      },
      {
        type: 'list',
        title: 'Áreas profissionais',
        variant: 'check',
        items: [
          'Pedagogia e Educação Especial',
          'Medicina (neurologia) e Enfermagem',
          'Fisioterapia',
          'Fonoaudiologia',
          'Terapia Ocupacional',
          'Psicologia',
          'Nutrição',
          'Odontologia',
          'Serviço Social',
          'Professores de Artes, Educação Física e Informática',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------- Convenios
  {
    slug: 'convenios',
    title: 'Convênios',
    subtitle: 'Parcerias que viabilizam o atendimento gratuito.',
    order: 7,
    blocks: [
      {
        type: 'list',
        title: 'Convênios e parcerias',
        variant: 'check',
        items: [
          'Fundação Catarinense de Educação Especial',
          'Programa Gente Especial (MRD)',
          'CELESC – Centrais Elétricas de Santa Catarina (Sollo)',
          'SUS – Sistema Único de Saúde',
          'Prefeitura de Apiúna – Termo de Fomento',
          'Prefeitura de Ascurra – Termo de Fomento',
          'Mesa Brasil',
        ],
      },
    ],
  },
]
