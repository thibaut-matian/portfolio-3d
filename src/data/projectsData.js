export const projects = [
 {
  id: 1, // ou le numéro de ton choix
  index: "01",
  total: "03",
  title: "Site Vitrine Cheffe Privée",
  description:
    "Création d'un portfolio sur-mesure pour une activité de cheffe à domicile : mise en valeur des prestations culinaires, design épuré et formulaire de réservation.",
  stack: ["React", "Tailwind CSS", "Vercel"],
  demoUrl: "https://portfolio-cheffe.vercel.app",
  githubUrl: "https://github.com/ton-profil/portfolio-cheffe",
  bgImage: "/chef-privee.png", // <-- Le nom de ton image ici
},

  {
    id: 2,
    index: "02",
    total: "03",
    title: "Plateforme MarsAI",
    description:
      "Portail web pour festival de courts-métrages assistés par IA : gestion des dépôts, visionnage interactif et espace d'administration complet.",
    stack: ["React", "Tailwind CSS", "Vite", "REST API", "S3 Bucket"],
    demoUrl: "https://marsai.aleca.dev",
    githubUrl: "https://github.com/ton-profil/marsai",
    bgImage: "/home-marsai.png",
  },
  {
    id: 3,
    index: "03",
    total: "03",
    title: "Vibesss Blog",
    description:
      "Espace de publication et d'échange conçu pour la rapidité et la sobriété, avec chiffrement Argon2 et API REST modulaire.",
    stack: ["React", "Express", "Argon2", "Sequelize", "MySQL"],
    demoUrl: "https://iridescent-pony-061e8f.netlify.app",
    githubUrl: "https://github.com/ton-profil/vibesss",
    bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop",
  },
  {
  id: 'notaire-office',
  index: '04',
  total: '04',
  title: 'Office Notarial',
  description: 'Conception de la plateforme web et de l’espace client pour une étude notariale : prise de rendez-vous sécurisée, espace documentaire chiffré et interface épurée.',
  stack: ['Next.js', 'Tailwind CSS', 'Node.js', 'Payload CMS'],
  bgImage: '/home.png',
  // Tableau de maquettes pour le carrousel
  screenshots: [
  '/home.png',
  '/qui-suis-je.png',
  '/blog.png'
],
  inProgress: true,
  demoUrl: null,
  githubUrl: null
}
]