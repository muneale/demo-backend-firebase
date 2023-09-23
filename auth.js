import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  initializeApp as initializeAdminApp,
  cert
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import serviceAccount from "./firebase.json" assert { type: "json" };

import { getTodos } from "./todos.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2vFgfC09BAgtn4fpTRNQOrzyr9TURPFI",
  authDomain: "flutter-meetup-vicenza-demo.firebaseapp.com",
  projectId: "flutter-meetup-vicenza-demo",
  storageBucket: "flutter-meetup-vicenza-demo.appspot.com",
  messagingSenderId: "244263586271",
  appId: "1:244263586271:web:325b8026d819fe07505c6a",
  measurementId: "G-8QF1C4TJ1N",
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firebase Admin SDK
const adminApp = initializeAdminApp({
    credential: cert(serviceAccount)
  }, 
  "admin"
);


async function addUser(id, data) {
  const db = getFirestore(adminApp);
  try {
    const now = new Date().toISOString();
    await db.doc(`users/${id}`).set({
      name: data.name,
      surname: data.surname,
      createdAt: now,
      updatedAt: now,
    });
    console.log("User data registered with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}






async function createUserWithAdmin(user) {
  const auth = getAdminAuth(adminApp);
  try {
    const fbUser = await auth.createUser({
      email: user.email,
      password: user.password,
    });
    console.log("Firebase User:", fbUser);
    await addUser(fbUser.uid, user);
  } catch (error) {
    console.log("Error while creating user:", error.code, error.message);
  }
}

async function createUser(user) {
  const auth = getAuth(app);
  try {
    await createUserWithEmailAndPassword(auth, user.email, user.password);
  } catch (error) {
    console.log("Error while creating user:", error.code, error.message);
  }
}

async function loginUser(user) {
  const auth = getAuth(app);
  return signInWithEmailAndPassword(auth, user.email, user.password);
}

async function main() {
  try {
    const user = {
      email: "munerato.ale2@gmail.com",
      password: "qwerty12345",
      name: "Alessio",
      surname: "Munerato"
    };
    // await loginUser(user);
    const todos = await getTodos("unauth-todos");
    console.log("Todos:", todos);
    await signOut();
  } catch (error) {
    console.log("Error:", error.message);
  }
}

main();
