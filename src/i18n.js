export const texts = {
  pt: {
    role: 'Engenharia de Software · Backend, Mobile & IA',
    enter: 'Entrar →',
    skip: 'Pular intro ⏭',
    doorHint: 'clique na porta para entrar →',
    back: '← Voltar',
    nav: {about:'Sobre Mim',projects:'Projetos',experience:'Experiências',contact:'Contato',agenda:'Agenda'},
    about: {
      title: 'Sobre Mim',
      body: 'Estudante de Engenharia de Software na PUC Minas com formação técnica em Informática pelo Senac. Estagiária em Desenvolvimento Backend Web na VTreal, onde atuo com APIs REST, bancos de dados e metodologias ágeis. Tenho interesse em Backend, Mobile e Inteligência Artificial/Machine Learning.',
      skills: 'Habilidades',
    },
    screen: {title:'Projetos', sub:'Linha do tempo · do mais antigo ao mais recente', repo:'Ver no GitHub →'},
  },
  en: {
    role: 'Software Engineering · Backend, Mobile & AI',
    enter: 'Enter →',
    skip: 'Skip intro ⏭',
    doorHint: 'click the door to enter →',
    back: '← Back',
    nav: {about:'About Me',projects:'Projects',experience:'Experience',contact:'Contact',agenda:'Schedule'},
    about: {
      title: 'About Me',
      body: 'Software Engineering student at PUC Minas with a technical degree in IT from Senac. Currently interning as a Backend Web Developer at VTreal, working with REST APIs, databases and agile methodologies. Interested in Backend, Mobile and AI/Machine Learning.',
      skills: 'Skills',
    },
    screen: {title:'Projects', sub:'Timeline · oldest to newest', repo:'View on GitHub →'},
  },
}

export const projects = [
  {
    year: 2024,
    name: 'E-commerce de Doces',
    tech: ['PHP', 'MySQL', 'JavaScript'],
    desc: 'Loja virtual completa com catálogo de produtos, carrinho, checkout e painel admin. Notificações automáticas via API do WhatsApp.',
    repo: 'https://github.com/gabiscamp/e-commerce',
  },
  {
    year: 2025,
    name: 'RH com Reconhecimento Facial',
    tech: ['Python', 'Flask', 'scikit-learn'],
    desc: 'Sistema de controle de acesso com reconhecimento facial e análise de desempenho de funcionários usando Machine Learning.',
    repo: 'https://github.com/gabiscamp/reconhecimento-facial',
  },
  {
    year: 2025,
    name: 'Educação Financeira (TIAW)',
    tech: ['JavaScript', 'HTML', 'CSS'],
    desc: 'Aplicação web de educação financeira desenvolvida na disciplina TIAW da PUC Minas.',
    repo: 'https://github.com/gabiscamp/icei-pucminas-psg-ads-m-2025-2-tiaw-educacao-financeira',
  },
  {
    year: 2026,
    name: 'PI Van – Gestão de Transporte',
    tech: ['Flutter', 'Dart', 'Firebase'],
    desc: 'App mobile para gestão de transporte escolar com autenticação, cadastro de turmas e planejamento de rotas.',
    repo: 'https://github.com/gabiscamp/pi-van',
  },
  {
    year: 2026,
    name: 'Este Portfólio 3D',
    tech: ['React', 'Three.js', 'R3F'],
    desc: 'Portfólio interativo com cena 3D, animações e referências a séries. Feito para a disciplina DIAW na PUC Minas.',
    repo: 'https://github.com/gabiscamp',
  },
]
