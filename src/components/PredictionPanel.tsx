import React from 'react';
import { Brain, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';
import type { MarketPrediction } from '../services/predictions';

interface PredictionPanelProps {
  prediction: MarketPrediction;
  currentPrice: number;
}

export function PredictionPanel({ prediction, currentPrice }: PredictionPanelProps) {
  const getDirectionIcon = () => {
    switch (prediction.direction) {
      case 'up':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <MinusCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getDirectionColor = () => {
    switch (prediction.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getSignalColor = (interpretation: string) => {
    if (interpretation.includes('Alcista') || interpretation === 'Sobrevendido') {
      return 'text-green-500';
    }
    if (interpretation.includes('Bajista') || interpretation === 'Sobrecomprado') {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-6 h-6 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Análisis de IA
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Dirección</span>
            {getDirectionIcon()}
          </div>
          <p className={`text-lg font-semibold ${getDirectionColor()}`}>
            {prediction.direction === 'up' ? 'Alcista' : 
             prediction.direction === 'down' ? 'Bajista' : 'Lateral'}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Confianza</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {(prediction.confidence * 100).toFixed(1)}%
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Precio Objetivo</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${prediction.targetPrice.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Señales Técnicas
        </h4>
        {prediction.signals.map((signal, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{signal.name}</p>
              <p className={`text-sm ${getSignalColor(signal.interpretation)}`}>
                {signal.interpretation}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                {typeof signal.value === 'number' ? signal.value.toFixed(2) : signal.value}
              </p>
              <p className="text-sm text-gray-500">
                {signal.strength === 'strong' ? 'Fuerte' : 
                 signal.strength === 'moderate' ? 'Moderado' : 'Débil'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}