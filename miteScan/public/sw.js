// Service Worker do MiteScan para Notificações Web Push no Computador

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: "⚠️ Alerta MiteScan",
        body: event.data.text()
      };
    }
  }

  const title = data.title || "⚠️ Alerta MiteScan";
  const options = {
    body: data.body || "Leitura de temperatura ou umidade fora da faixa ideal!",
    icon: data.icon || "/logo-mitescan.png",
    badge: data.badge || "/logo-mitescan.png",
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: data.tag || "mitescan-alert",
    renotify: true,
    requireInteraction: true // Mantém a notificação visível no Windows até clique
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se houver uma aba aberta, foca nela e redireciona
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Se nenhuma aba estiver aberta, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
