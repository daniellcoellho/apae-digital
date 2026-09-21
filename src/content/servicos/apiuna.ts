import type { ServicosContent } from './types'

/**
 * Atendimentos Prestados da APAE de Apiuna (dados reais),
 * divididos em area Interdisciplinar/Saude e area Educacional.
 */
export const apiunaServicos: ServicosContent = {
  intro: [
    {
      type: 'paragraph',
      text: 'A Escola Especial "Academia do Amor" e Centro de Atendimento Educacional Especializado – APAE de Apiúna, através de seus professores, equipe interdisciplinar e demais profissionais, desenvolve uma proposta interdisciplinar junto à pessoa com deficiência intelectual e/ou múltipla e transtorno do espectro autista.',
    },
    {
      type: 'paragraph',
      text: 'O usuário poderá receber acompanhamento técnico nas áreas de psicologia, serviço social, nutrição, fonoaudiologia, fisioterapia, terapia ocupacional, odontologia e atendimento médico psiquiátrico. São oferecidas também atividades complementares como informática, dança, educação física, artes e musicoterapia. A instituição realiza encaminhamentos ao mercado de trabalho, à rede regular de ensino e à rede socioassistencial.',
    },
    {
      type: 'paragraph',
      text: 'A instituição presta ainda atendimento de assistência social, visando à melhoria na qualidade de vida da pessoa com deficiência e de sua família. Realiza a escuta, a acolhida, fornece informação e intervém na garantia e defesa de direitos, articulando com os serviços de políticas públicas setoriais e apoiando as famílias em sua função protetiva.',
    },
  ],

  areas: [
    {
      id: 'saude',
      title: 'Área interdisciplinar e da saúde',
      description:
        'Acompanhamento técnico especializado que apoia o desenvolvimento e a qualidade de vida do educando e de sua família.',
      services: [
        {
          id: 'fisioterapia',
          title: 'Fisioterapia',
          icon: 'atividade',
          summary: 'Autonomia, funcionalidade e qualidade de vida.',
          blocks: [
            {
              type: 'paragraph',
              text: 'A fisioterapia é uma ciência da saúde que estuda, previne e trata os distúrbios cinético-funcionais intercorrentes em órgãos e sistemas do corpo humano. Tem o propósito de gerar maior autonomia, funcionalidade e aumento da qualidade de vida funcional aos educandos atendidos pela instituição.',
            },
            {
              type: 'list',
              title: 'Modalidades atendidas',
              variant: 'check',
              items: [
                'Fisioterapia convencional',
                'Fisioterapia na geriatria',
                'Fisioterapia na pediatria',
                'Fisioterapia em neurologia',
                'PediaSuit intensivo',
              ],
            },
          ],
        },
        {
          id: 'fonoaudiologia',
          title: 'Fonoaudiologia',
          icon: 'fala',
          summary: 'Comunicação, linguagem e funções orais.',
          blocks: [
            {
              type: 'paragraph',
              text: 'A fonoaudiologia realiza atendimentos individuais, em grupo e orientações, visando à promoção de saúde através do trabalho com a comunicação e otimizando a interação no ambiente escolar e social.',
            },
            {
              type: 'paragraph',
              text: 'Trabalha com os diferentes aspectos da comunicação humana: linguagem oral e escrita, fala, comunicação alternativa e funções de deglutição, respiração e mastigação.',
            },
          ],
        },
        {
          id: 'psicologia',
          title: 'Psicologia',
          icon: 'cerebro',
          summary: 'Avaliação, atendimento e orientação.',
          blocks: [
            {
              type: 'paragraph',
              text: 'O setor de Psicologia realiza avaliação psicológica e atendimentos individuais ou em grupo, conforme as necessidades específicas de cada caso. Também presta orientação psicológica para famílias e professores, favorecendo o desenvolvimento nos aspectos afetivos e cognitivos, aumentando a qualidade de vida e construindo possibilidades de inserção no meio social.',
            },
            {
              type: 'paragraph',
              text: 'O serviço acompanha transtornos nas áreas intelectual, emocional e comportamental dos educandos. Os profissionais estimulam o desenvolvimento das capacidades do indivíduo, considerando suas potencialidades, e atuam também no processo de triagem e avaliação diagnóstica para inserção do assistido na entidade.',
            },
          ],
        },
        {
          id: 'terapia-ocupacional',
          title: 'Terapia Ocupacional',
          icon: 'mao',
          summary: 'Habilidades para as atividades da vida diária.',
          blocks: [
            {
              type: 'paragraph',
              text: 'O terapeuta ocupacional trata as habilidades de desempenho ocupacional, aplicando métodos, técnicas e abordagens que recuperam ou melhoram as habilidades necessárias para atividades de vida diária, prática e de lazer — sejam elas motoras, perceptivas, sensoriais, cognitivas, sociais e de comunicação.',
            },
            {
              type: 'list',
              title: 'Recursos terapêuticos utilizados',
              variant: 'check',
              items: [
                'Integração Sensorial: minimiza distúrbios sensoriais que afetam o desenvolvimento e as habilidades funcionais',
                'Tecnologia Assistiva: pranchas de comunicação, em conjunto com a fonoaudiologia',
                'Atividades da Vida Diária (AVD): adaptações como engrossador de talheres e copo adaptado',
                'Órteses: dispositivos que estabilizam e corrigem deformidades dos membros superiores',
                'Cadeiras de rodas: adequação postural para evitar deformidades',
              ],
            },
          ],
        },
        {
          id: 'servico-social',
          title: 'Serviço Social',
          icon: 'parceria',
          summary: 'Orientação, direitos e rede de apoio.',
          blocks: [
            {
              type: 'paragraph',
              text: 'A atuação do Serviço Social é voltada ao atendimento das pessoas com deficiência intelectual e/ou múltipla e transtorno do espectro autista e de suas famílias, com programas de orientação, apoio socioassistencial e garantia e defesa de direitos, articulando as áreas de educação e saúde.',
            },
            {
              type: 'paragraph',
              text: 'O setor orienta e encaminha as famílias na superação de suas dificuldades; realiza visita domiciliar e institucional quando necessário; faz encaminhamentos para a rede socioassistencial; supervisiona o educando na inclusão no mercado de trabalho; e presta orientação sobre acesso a direitos e benefícios.',
            },
          ],
        },
        {
          id: 'setor-medico',
          title: 'Setor Médico',
          icon: 'saude',
          summary: 'Atendimento neurológico e acompanhamento.',
          blocks: [
            {
              type: 'paragraph',
              text: 'O setor médico prioriza a área neurológica no atendimento dos educandos, com o objetivo de prevenir e tratar distúrbios do desenvolvimento neuromotor e psíquico.',
            },
            {
              type: 'paragraph',
              text: 'Atualmente a APAE de Apiúna conta com atendimento de neurologista, realizando consultas, emissão de receitas e atualização de laudos conforme demanda espontânea e por solicitação de profissionais da equipe interdisciplinar.',
            },
          ],
        },
      ],
    },

    {
      id: 'educacional',
      title: 'Serviços na área educacional',
      description:
        'Programas organizados por faixa etária e perfil do educando, do desenvolvimento infantil à preparação para o trabalho.',
      services: [
        {
          id: 'estimulacao-precoce',
          title: 'Estimulação Precoce',
          icon: 'bebe',
          summary: '0 a 5 anos e 11 meses.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Tem como objetivo o desenvolvimento integral dos aspectos físicos, psicológicos, sociais e culturais de crianças de 0 a 5 anos e 11 meses com Atraso Global do Desenvolvimento (ou prognóstico) e/ou Transtorno do Espectro Autista, e casos de risco como baixo Apgar, baixo peso, prematuridade, desnutrição e vulnerabilidade social. Considera primordial a construção harmônica do desenvolvimento da primeira infância.',
            },
            {
              type: 'paragraph',
              text: 'Paralelamente, as crianças são encaminhadas ao Centro de Educação Infantil (CEI) para ampliar o desenvolvimento pedagógico, social e emocional. As que atingirem os objetivos do programa são encaminhadas à rede regular de ensino.',
            },
          ],
        },
        {
          id: 'spe',
          title: 'Serviço Pedagógico Específico (SPE)',
          icon: 'livro',
          summary: '6 a 17 anos — DI grave ou profunda.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Atende educandos de 6 a 17 anos com Deficiência Intelectual grave ou profunda, associada ou não a outras deficiências, desde que ligadas a quadros de saúde e/ou comportamentais que inviabilizem sua permanência no contexto escolar comum.',
            },
          ],
        },
        {
          id: 'spe-tea',
          title: 'Serviço Pedagógico Específico – TEA',
          icon: 'peca',
          summary: 'TEA nível 3 ou DI grave associada.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Atendimento de educandos com diagnóstico de TEA de baixo nível funcional (nível 3) ou deficiência intelectual grave associada ao TEA, desde que ligados a quadros de saúde e/ou comportamentais que inviabilizem a permanência no contexto escolar comum. São oferecidos também atendimentos de educação física, informática e artes.',
            },
          ],
        },
        {
          id: 'aee-di',
          title: 'AEE – Atendimento Educacional Especializado (DI)',
          icon: 'alvo',
          summary: 'Acima de 6 anos, complementar à rede regular.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Para educandos acima de 6 anos com frequência na rede regular de ensino e diagnóstico de deficiência intelectual grave com baixo nível funcional e/ou TEA de baixo nível funcional, oriundos de escolas estaduais, particulares ou municipais.',
            },
            {
              type: 'paragraph',
              text: 'Conforme convênio, os educandos das turmas de AEE não frequentam a instituição todos os dias, apenas em dias alternados, e o atendimento é realizado por sessão. São oferecidos também atendimentos de educação física, informática e artes.',
            },
          ],
        },
        {
          id: 'tea',
          title: 'Transtorno do Espectro Autista (TEA)',
          icon: 'acolhimento',
          summary: 'TEA associado a DI severa.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Programa dirigido a educandos com diagnóstico de Transtorno do Espectro Autista (TEA) associado a Deficiência Intelectual severa, que necessitam de apoio extensivo e/ou generalizado. São oferecidos também atendimentos de educação física, informática e artes.',
            },
          ],
        },
        {
          id: 'sae',
          title: 'Serviço de Atendimento Específico (SAE e SAE/TEA)',
          icon: 'apoio',
          summary: 'Acima de 17 anos.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Atendimento para educandos acima de 17 anos com diagnóstico de deficiência intelectual moderada ou grave, associada ou não a outras deficiências (sem potencial laboral). No SAE/TEA, os educandos devem ter diagnóstico de TEA de baixo nível funcional (nível 3) ou deficiência intelectual grave associada ao TEA. São oferecidos também atendimentos de educação física, informática e artes.',
            },
          ],
        },
        {
          id: 'proep',
          title: 'Educação Profissional (PROEP)',
          icon: 'maleta',
          summary: 'Acima de 14 anos — iniciação para o trabalho.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Iniciação para o trabalho, pré-qualificação e atividade de locomoção independente. Educandos elegíveis acima de 14 anos (de 14 a 17 anos devem enviar comprovante de frequência na rede regular de ensino). Voltado a diagnóstico de deficiência intelectual leve ou moderada, associada ou não a outras deficiências, ou TEA com perspectiva de mercado de trabalho.',
            },
            {
              type: 'paragraph',
              text: 'O educando encaminhado ao mercado de trabalho, após o período de contrato de experiência ou o acompanhamento sistemático necessário, é desligado da frequência da APAE.',
            },
          ],
        },
        {
          id: 'svl',
          title: 'Serviço de Vivências Laborais (SVL)',
          icon: 'ferramenta',
          summary: 'Acima de 14 anos — capacidade laboral.',
          blocks: [
            {
              type: 'paragraph',
              text: 'Turma para educandos com capacidade laboral que não seguem para o mercado de trabalho. Elegíveis acima de 14 anos (de 14 a 17 anos devem enviar comprovante de frequência na rede regular de ensino). Voltado a diagnóstico de deficiência intelectual leve ou moderada, associada ou não a outras deficiências, ou TEA.',
            },
          ],
        },
      ],
    },
  ],
}
