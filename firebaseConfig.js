import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgbOFh53CfHQfPJtYyaszDdmrCMbSL6cA",
  authDomain: "cl-react-native-firebase.firebaseapp.com",
  projectId: "cl-react-native-firebase",
  storageBucket: "cl-react-native-firebase.appspot.com",
  messagingSenderId: "55240858963",
  appId: "1:55240858963:web:273630ecdfb746c91d15a6",
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
