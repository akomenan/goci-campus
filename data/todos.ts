export type TodoItem = {
  id: string;
  label: string;
  done: boolean;
};

export const todos: TodoItem[] = [
  { id: 't1', label: 'Payer les frais de scolarité (1ère tranche)', done: false },
  { id: 't2', label: 'Visiter 2 logements à Yopougon', done: false },
  { id: 't3', label: 'Envoyer CV pour stage Orange CI', done: true },
  { id: 't4', label: 'Renouveler la carte étudiant UFHB', done: false },
];
