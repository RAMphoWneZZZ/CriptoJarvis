import React, { useState } from 'react';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { createPriceAlert, deletePriceAlert, getPriceAlerts, togglePriceAlert, type PriceAlert } from '../services/api/alerts';

interface PriceAlertsProps {
  cryptoId: string;
  currentPrice: number;
}

export function PriceAlerts({ cryptoId, currentPrice }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(getPriceAlerts());
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [newAlertCondition, setNewAlertCondition] = useState<'above' | 'below'>('above');

  const handleCreateAlert = () => {
    if (!newAlertPrice) return;
    
    const newAlert = createPriceAlert({
      cryptoId,
      price: parseFloat(newAlertPrice),
      condition: newAlertCondition,
      active: true
    });
    
    setAlerts([...alerts, newAlert]);
    setNewAlertPrice('');
  };

  const handleDeleteAlert = (id: string) => {
    deletePriceAlert(id);
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    togglePriceAlert(id);
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Alertas de Precio
        </h3>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={newAlertPrice}
          onChange={(e) => setNewAlertPrice(e.target.value)}
          placeholder="Ingresa precio"
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <select
          value={newAlertCondition}
          onChange={(e) => setNewAlertCondition(e.target.value as 'above' | 'below')}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        >
          <option value="above">Por encima</option>
          <option value="below">Por debajo</option>
        </select>
        <button
          onClick={handleCreateAlert}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {alerts.filter(alert => alert.cryptoId === cryptoId).map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleAlert(alert.id)}
                className={`p-1 rounded-md transition-colors ${
                  alert.active ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                {alert.active ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
              <span className="text-gray-900 dark:text-white">
                Cuando el precio esté {alert.condition === 'above' ? 'por encima de' : 'por debajo de'} ${alert.price}
              </span>
            </div>
            <button
              onClick={() => handleDeleteAlert(alert.id)}
              className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}