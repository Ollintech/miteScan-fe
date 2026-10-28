import React, { useState, useEffect } from 'react';
import {
  isPushSupported,
  checkIsSubscribed,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  triggerTestNotification,
  getNotificationPermission,
  getAlertThresholds
} from '../../services/notificationService';
import { FaBell, FaBellSlash, FaCheckCircle, FaExclamationTriangle, FaTimes, FaVial } from 'react-icons/fa';

export default function NotificationManagerModal({ isOpen, onClose }) {
  const [supported, setSupported] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [thresholds, setThresholds] = useState({
    temp_min: 20.0,
    temp_max: 29.0,
    humidity_min: 45.0,
    humidity_max: 80.0
  });

  useEffect(() => {
    if (isOpen) {
      const isSupp = isPushSupported();
      setSupported(isSupp);
      setPermission(getNotificationPermission());
      setMessage(null);

      if (isSupp) {
        checkIsSubscribed().then((subbed) => setIsSubscribed(subbed));
        getAlertThresholds().then((data) => {
          if (data) setThresholds(data);
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (isSubscribed) {
        await unsubscribeFromNotifications();
        setIsSubscribed(false);
        setMessage({ type: 'success', text: 'Notificações no computador desativadas.' });
      } else {
        await subscribeToNotifications();
        setIsSubscribed(true);
        setPermission('granted');
        setMessage({
          type: 'success',
          text: '✅ Notificações ativadas! Seu computador agora receberá alertas de temperatura e umidade.'
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.message || 'Erro ao configurar notificações no computador.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTestLoading(true);
    setMessage(null);
    try {
      await triggerTestNotification();
      setMessage({
        type: 'success',
        text: '🔔 Notificação enviada! Verifique o canto inferior direito da sua tela (Windows/Mac).'
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: 'Erro ao disparar notificação de teste. Verifique se as notificações estão ativadas.'
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transition-all">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black/10 p-2.5 rounded-xl">
              <FaBell className="text-black text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black leading-tight">
                Notificações no Computador
              </h3>
              <p className="text-xs text-black/80 font-medium">
                Alertas nativos de temperatura e umidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-black/70 hover:text-black hover:bg-black/10 p-2 rounded-full transition-colors"
            title="Fechar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-5">
          {!supported ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 items-start">
              <FaExclamationTriangle className="text-lg shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Navegador não suportado</p>
                <p className="text-xs mt-1">
                  Este navegador não possui suporte para Web Push. Recomendamos utilizar Google Chrome ou Microsoft Edge no computador.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Card de Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                    {isSubscribed ? <FaBell size={18} /> : <FaBellSlash size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      Status no Computador
                    </p>
                    <p className="text-xs text-gray-500">
                      {isSubscribed ? 'Alertas ativos no sistema' : 'Alertas desativados'}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={loading}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isSubscribed ? 'bg-green-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isSubscribed ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Informações dos Limiares */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <span>🐝 Faixas de monitoramento ativas:</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 pl-1">
                  <li>Alerta de temperatura: <strong>acima de {thresholds.temp_max}°C</strong> (ou abaixo de {thresholds.temp_min}°C)</li>
                  <li>Alerta de umidade: <strong>acima de {thresholds.humidity_max}%</strong> (ou abaixo de {thresholds.humidity_min}%)</li>
                </ul>
                <p className="text-[11px] text-amber-700 mt-1 italic">
                  * As notificações surgem no canto da tela do Windows mesmo se o site não estiver aberto.
                </p>
              </div>

              {/* Mensagem de Feedback */}
              {message && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FaCheckCircle className="shrink-0 text-green-600" />
                  ) : (
                    <FaExclamationTriangle className="shrink-0 text-red-600" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Botão de Teste */}
              {isSubscribed && (
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <FaVial />
                  {testLoading ? 'Disparando teste...' : 'Testar Notificação no Computador Agora'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
