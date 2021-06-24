import firebase from "firebase/app";
import 'firebase/database';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC5StcFBYWx0JvMoESRaZ2taHpwj45MLjc",
    authDomain: "project3-junoc.firebaseapp.com",
    databaseURL: "https://project3-junoc-default-rtdb.firebaseio.com",
    projectId: "project3-junoc",
    storageBucket: "project3-junoc.appspot.com",
    messagingSenderId: "53823547146",
    appId: "1:53823547146:web:36f9a87a525d4c354cfcf3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;

//firebase initialization content