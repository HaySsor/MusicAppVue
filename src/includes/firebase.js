import { initializeApp } from "firebase/app"
import { getAuth, } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCtCgb3_dktwh61FV0pP6Nh3BXpXUPWhaI",
    authDomain: "muisc-892a5.firebaseapp.com",
    projectId: "muisc-892a5",
    storageBucket: "muisc-892a5.appspot.com",
    appId: "1:771021252100:web:875f6c3ce90ac962777751"
};

initializeApp(firebaseConfig)

const auth = getAuth()
const db = getFirestore()


const userCollection = collection(db, 'users')


export {
    auth,
    db,
    userCollection
}