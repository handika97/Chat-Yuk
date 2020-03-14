import firebase from 'firebase/app';
// import 'firebase/auth';

// import 'firebase/database';
const firebaseConfig = {
  apiKey: 'AIzaSyCAFcS4U9Pldt2LFpjXNwVKRoOGpBzbIoA',
  authDomain:
    '740732876051-1qse5ru0qr6c5i7pb7nla4in82l38lon.apps.googleusercontent.com',
  databaseURL: 'https://western-figure-270302.firebaseio.com',
  projectId: 'western-figure-270302',
  storage_bucket: 'western-figure-270302.appspot.com',
  messagingSenderId: '740732876051',
  appId: '1:740732876051:android:0df3b9922fc4d502d3d6e6',
  measurementId: '',
};
// firebase.initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
// export {firebase};
export default app;
