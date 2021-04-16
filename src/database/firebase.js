//Importamos todos los servicios de firebase
/*
1.- firestore
2.- auth
3.- storage
4.- hosting
*/
import firebase from 'firebase';
import 'firebase/firestore';

/* const firebaseConfig = {
    apiKey: "AIzaSyC_6HFE2q4NQLhZQ98daaeeyF59UULo_dA",
    authDomain: "studyiq-2882a.firebaseapp.com",
    projectId: "studyiq-2882a",
    storageBucket: "studyiq-2882a.appspot.com",
    messagingSenderId: "216538651801",
    appId: "1:216538651801:web:ce0829cdffb00dbc6eac08"
}; */

var firebaseConfig = {
    apiKey: "AIzaSyCiXfiIj9fY0cjIIuuuPav8ODm3SI4RpTA",
    authDomain: "studyiq3-42bc2.firebaseapp.com",
    projectId: "studyiq3-42bc2",
    storageBucket: "studyiq3-42bc2.appspot.com",
    messagingSenderId: "565037381963",
    appId: "1:565037381963:web:6aad55c17a9189a57b50ce"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*
Retornar los servicios de firebase 
*/

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const xd = firebase.database();

/* 
Generamos una librería reutilizable
*/
export default {
    db,
    auth,
    storage,
    xd
};
