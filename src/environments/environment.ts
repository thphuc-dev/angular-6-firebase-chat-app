// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  innoway: {
    host: 'http://dmt.css.vnu.edu.vn:8500',
    version: 'v1',
    firebase: {
      apiKey: 'AIzaSyAVk2001nxmhR3GZnVeB0fxEDlbVob68s4',
      authDomain: 'dmt-css-product.firebaseapp.com',
      databaseURL: 'https://dmt-css-product.firebaseio.com',
      projectId: 'dmt-css-product',
      storageBucket: 'dmt-css-product.appspot.com',
      messagingSenderId: '512596067099'
    },
    legacyServerKey: 'key=AIzaSyBzbrdzqzNdwpqep1Q5RkknB1AJLiz2Ouo',
    uiHost: 'https://localhost:4203',
    fcmServiceWorkerPath: '/assets/firebase-messaging-sw.js'
  }
};
