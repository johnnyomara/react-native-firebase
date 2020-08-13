import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAxiruK5rVtbKwXxn4NUJR9GgeU6E5tPbo',
  authDomain: 'pokedex-60a90.firebaseapp.com',
  databaseURL: 'https://pokedex-60a90.firebaseio.com',
  projectId: 'pokedex-60a90',
  storageBucket: 'pokedex-60a90.appspot.com',
  messagingSenderId: '982899041647',
  appId: '1:982899041647:web:d21a1932874e52db59b49a',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
