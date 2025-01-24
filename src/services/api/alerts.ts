import { v4 as uuidv4 } from 'uuid';

export interface PriceAlert {
  id: string;
  cryptoId: string;
  price: number;
  condition: 'above' | 'below';
  active: boolean;
}

const alerts: PriceAlert[] = [];

export function createPriceAlert(data: Omit<PriceAlert, 'id'>): PriceAlert {
  const alert: PriceAlert = {
    id: uuidv4(),
    ...data
  };
  alerts.push(alert);
  return alert;
}

export function getPriceAlerts(): PriceAlert[] {
  return alerts;
}

export function deletePriceAlert(id: string): void {
  const index = alerts.findIndex(alert => alert.id === id);
  if (index !== -1) {
    alerts.splice(index, 1);
  }
}

export function togglePriceAlert(id: string): void {
  const alert = alerts.find(alert => alert.id === id);
  if (alert) {
    alert.active = !alert.active;
  }
}