export type AlertItem = {
  id: string;
  type: 'deadline' | 'urgent' | 'info';
  titre: string;
  message: string;
  date: string;
};

/** Rempli plus tard — vie étudiante / opportunités. */
export const alerts: AlertItem[] = [];
