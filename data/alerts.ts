export type AlertItem = {
  id: string;
  titre: string;
  message: string;
  type: 'deadline' | 'info' | 'urgent';
  date: string;
};

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    titre: 'Inscription pédagogique',
    message: 'Clôture des inscriptions UFHB — 15 septembre 2026',
    type: 'deadline',
    date: '2026-09-15',
  },
  {
    id: 'a2',
    titre: 'Bourse d\'excellence',
    message: 'Dossier à déposer avant le 20 septembre (MENET-FP)',
    type: 'urgent',
    date: '2026-09-20',
  },
  {
    id: 'a3',
    titre: 'Forum stages Cocody',
    message: 'Rencontre entreprises au campus Cocody — 12 septembre',
    type: 'info',
    date: '2026-09-12',
  },
];
