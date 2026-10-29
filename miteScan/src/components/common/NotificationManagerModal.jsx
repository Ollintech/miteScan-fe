import React, { useState, useEffect } from 'react';
import {
  isPushSupported,
  checkIsSubscribed,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  getNotificationPermission,
  getAlertThresholds
} from '../../services/notificationService';
import {
  FaBell,
  FaBellSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaThermometerHalf,
  FaTint
} from 'react-icons/fa';

export default function NotificationManagerModal({ isOpen, onClose }) {
  const [supported, setSupported] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
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
        setMessage({
          type: 'info',
          text: 'Notificações desativadas.'
        });
      } else {
        await subscribeToNotifications();
        setIsSubscribed(true);
        setPermission('granted');
        setMessage({
          type: 'success',
          text: 'Notificações ativadas com sucesso.'
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text:
          err.message ||
          'Não foi possível ativar. Verifique se o navegador tem permissão para emitir notificações.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white text-gray-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 transition-all">
        {/* Cabeçalho */}
        <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black/10 p-2 rounded-xl">
              <FaBell className="text-black text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-base text-black leading-tight">
                Notificações no computador
              </h3>
              <p className="text-xs text-black/80 font-medium">
                Acompanhe o estado das colmeias em tempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-black/70 hover:text-black hover:bg-black/10 p-1.5 rounded-lg transition-colors"
            title="Fechar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-5">
          {!supported ? (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm flex gap-3 items-start">
              <FaExclamationTriangle className="text-base shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold text-xs text-gray-900">Navegador não suportado</p>
                <p className="text-xs mt-1 text-gray-600 leading-relaxed">
                  Este navegador não possui suporte a notificações push. Para utilizar este recurso, utilize o Google Chrome ou o Microsoft Edge.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Controle Principal */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      isSubscribed
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isSubscribed ? <FaBell size={18} /> : <FaBellSlash size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      Alertas no sistema
                    </p>
                    <p className="text-xs text-gray-500">
                      {isSubscribed
                        ? 'Ativo — notificações habilitadas'
                        : 'Desativado'}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isSubscribed ? 'bg-black' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isSubscribed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Informações dos Parâmetros */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                  Condições de disparo
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Você receberá um aviso na tela se as medições ficarem fora dos limites seguros:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="border border-gray-200 p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <FaThermometerHalf size={12} />
                      <span className="text-[11px] font-medium">Temperatura</span>
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      {thresholds.temp_min}°C a {thresholds.temp_max}°C
                    </span>
                  </div>

                  <div className="border border-gray-200 p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <FaTint size={12} />
                      <span className="text-[11px] font-medium">Umidade</span>
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      {thresholds.humidity_min}% a {thresholds.humidity_max}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 pt-1">
                  Os avisos continuam funcionando mesmo com a janela do sistema fechada.
                </p>
              </div>

              {/* Mensagem de Feedback */}
              {message && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : message.type === 'info'
                      ? 'bg-gray-100 text-gray-700 border border-gray-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FaCheckCircle className="shrink-0 text-green-600 text-xs" />
                  ) : message.type === 'info' ? (
                    <FaBell className="shrink-0 text-gray-500 text-xs" />
                  ) : (
                    <FaExclamationTriangle className="shrink-0 text-red-600 text-xs" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
