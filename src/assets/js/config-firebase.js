var config = {
    apiKey: "AIzaSyDLAq1cs8FX3uAL8yBrkBU8tn4_AzcyjqA",
    authDomain: "m-commerce-cloud-service.firebaseapp.com",
    databaseURL: "https://m-commerce-cloud-service.firebaseio.com",
    projectId: "m-commerce-cloud-service",
    storageBucket: "m-commerce-cloud-service.appspot.com",
    messagingSenderId: "316049655679"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}