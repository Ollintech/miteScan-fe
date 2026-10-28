import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Converte chave pública VAPID base64url para Uint8Array exigido pelo PushManager.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Verifica se o navegador suporta Web Push e Notificações de Desktop.
 */
export function isPushSupported() {
  return typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;
}

/**
 * Retorna o status atual de permissão de notificação.
 */
export function getNotificationPermission() {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Verifica se já existe uma assinatura ativa de push neste navegador.
 */
export async function checkIsSubscribed() {
  if (!isPushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!reg) return false;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch (err) {
    console.error('Erro ao verificar inscrição push:', err);
    return false;
  }
}

/**
 * Solicita permissão e inscreve o computador para receber alertas do MiteScan.
 */
export async function subscribeToNotifications() {
  if (!isPushSupported()) {
    throw new Error('Seu navegador não suporta notificações de computador.');
  }

  // 1. Pede permissão ao usuário no navegador
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permissão para notificações foi negada no navegador.');
  }

  // 2. Registra o Service Worker
  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  // 3. Obtém a chave pública VAPID do backend
  const keyResponse = await axios.get(`${BASE_URL}/notifications/vapid-public-key`);
  const publicKey = keyResponse.data.public_key;

  // 4. Cria a inscrição no serviço Push do navegador/Windows
  const convertedVapidKey = urlBase64ToUint8Array(publicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  // 5. Recupera dados do usuário logado se existirem
  let account = null;
  let userEmail = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      account = user.account || null;
      userEmail = user.email || null;
    }
  } catch (e) {
    console.warn('Não foi possível ler dados do usuário do localStorage:', e);
  }

  // 6. Envia a inscrição para o backend registrar no banco
  const subJson = subscription.toJSON();
  await axios.post(`${BASE_URL}/notifications/subscribe`, {
    endpoint: subJson.endpoint,
    keys: {
      p256dh: subJson.keys.p256dh,
      auth: subJson.keys.auth
    },
    account: account,
    user_email: userEmail
  });

  return subscription;
}

/**
 * Cancela a inscrição de notificações no computador.
 */
export async function unsubscribeFromNotifications() {
  if (!isPushSupported()) return true;

  try {
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!reg) return true;

    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      // Notifica o backend para deletar a inscrição
      try {
        await axios.post(`${BASE_URL}/notifications/unsubscribe`, { endpoint });
      } catch (err) {
        console.warn('Erro ao avisar backend sobre desinscrição:', err);
      }
    }
    return true;
  } catch (err) {
    console.error('Erro ao cancelar assinatura de notificações:', err);
    throw err;
  }
}

/**
 * Dispara uma notificação de teste diretamente no computador do usuário.
 */
export async function triggerTestNotification() {
  let account = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      account = user.account || null;
    }
  } catch (e) {
    // ignore
  }

  const response = await axios.post(`${BASE_URL}/notifications/test`, {
    title: '🐝 MiteScan: Teste Concluído!',
    body: 'As notificações de temperatura e umidade estão funcionando perfeitamente no seu computador.',
    account: account
  });

  return response.data;
}

/**
 * Obtém os limites de temperatura e umidade configurados no backend.
 */
export async function getAlertThresholds() {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/thresholds`);
    return response.data;
  } catch (err) {
    console.error('Erro ao buscar limiares de alerta:', err);
    return { temp_min: 20.0, temp_max: 29.0, humidity_min: 45.0, humidity_max: 80.0 };
  }
}
