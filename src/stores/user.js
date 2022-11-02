import { defineStore } from "pinia";
import { auth } from '../includes/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';


const db = getFirestore()

export default defineStore("user", {
    state: () => ({
        userLoggedIn: false
    }),
    actions: {
        async register(values) {

            const userCred = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const x = doc(db, 'users', userCred.user.uid)
            await setDoc(x, {
                name: values.name,
                email: values.email,
                age: values.age,
                country: values.country,
            });
            updateProfile(userCred.user, {
                displayName: values.name
            })

            this.userLoggedIn = true
        },
        async login(values) {
            await signInWithEmailAndPassword(auth,
                values.email,
                values.password)
            this.userLoggedIn = true
        },
        async singOutUser() {
            await signOut(auth)
            this.userLoggedIn = false
        }
    }
})