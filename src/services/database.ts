import { prisma } from '../lib/db';
import type { Prediction, PriceAlert } from './api';

export async function storeHistoricalPrice(cryptoId: string, price: number, timestamp: Date) {
  try {
    await prisma.historicalPrice.create({
      data: {
        cryptoId,
        price,
        timestamp,
      },
    });
  } catch (error) {
    console.error('Error storing historical price:', error);
  }
}

export async function getHistoricalPrices(cryptoId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    return await prisma.historicalPrice.findMany({
      where: {
        cryptoId,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
}

export async function storePrediction(prediction: Prediction & { cryptoId: string }) {
  try {
    await prisma.prediction.create({
      data: {
        cryptoId: prediction.cryptoId,
        price: prediction.price,
        confidence: prediction.confidence,
        direction: prediction.direction,
        timestamp: new Date(prediction.timestamp),
        timeframe: prediction.timeframe,
      },
    });
  } catch (error) {
    console.error('Error storing prediction:', error);
  }
}

export async function getLatestPrediction(cryptoId: string) {
  try {
    return await prisma.prediction.findFirst({
      where: {
        cryptoId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching latest prediction:', error);
    return null;
  }
}

export async function createPriceAlertDB(alert: Omit<PriceAlert, 'id'>) {
  try {
    return await prisma.priceAlert.create({
      data: {
        cryptoId: alert.cryptoId,
        price: alert.price,
        condition: alert.condition,
        active: alert.active,
      },
    });
  } catch (error) {
    console.error('Error creating price alert:', error);
    return null;
  }
}

export async function getPriceAlertsDB(cryptoId?: string) {
  try {
    return await prisma.priceAlert.findMany({
      where: cryptoId ? {
        cryptoId,
        active: true,
      } : {
        active: true,
      },
    });
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    return [];
  }
}

export async function updatePriceAlertDB(id: string, active: boolean) {
  try {
    return await prisma.priceAlert.update({
      where: { id },
      data: { active },
    });
  } catch (error) {
    console.error('Error updating price alert:', error);
    return null;
  }
}

export async function deletePriceAlertDB(id: string) {
  try {
    await prisma.priceAlert.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting price alert:', error);
    return false;
  }
}