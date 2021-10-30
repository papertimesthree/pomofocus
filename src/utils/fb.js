import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXAE-It00BVpsZtwcvxIRIjJcwpFUEK5s",
  authDomain: "wk-4d041.firebaseapp.com",
  projectId: "wk-4d041",
  storageBucket: "wk-4d041.appspot.com",
  messagingSenderId: "867480058756",
  appId: "1:867480058756:web:fc65d668bfa358fb19bbd1"
};

let fapp = firebase.initializeApp(firebaseConfig);
let googleP = new firebase.auth.GoogleAuthProvider();
let increment = firebase.firestore.FieldValue.increment;

export { fapp, googleP, firebase, increment };
