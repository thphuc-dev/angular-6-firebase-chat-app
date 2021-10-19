// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

  firebase.initializeApp({
    apiKey: "AIzaSyC0YvrcPLF9ST9LGAn0Q41vutRydPjEK_I",
    authDomain: "quanly-ktx.firebaseapp.com",
    databaseURL: "https://quanly-ktx.firebaseio.com",
    projectId: "quanly-ktx",
    storageBucket: "quanly-ktx.appspot.com",
    messagingSenderId: "316049655679"
  });
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received message ', payload);
  // Customize notification here
  let notificationTitle = payload.data.notification_title;
  
  try {
    payload.data.notification_options = JSON.parse(payload.data.notification_options);
  }catch(err){
    payload.data.notification_options = null
  }
  let notificationOptions = payload.data.notification_options
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      windowClient.postMessage(payload);
    }
  })
  .then(() => {
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  return promiseChain;
});