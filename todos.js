import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";
  
  const firebaseConfig = {
    apiKey: "AIzaSyB2vFgfC09BAgtn4fpTRNQOrzyr9TURPFI",
    authDomain: "flutter-meetup-vicenza-demo.firebaseapp.com",
    projectId: "flutter-meetup-vicenza-demo",
    storageBucket: "flutter-meetup-vicenza-demo.appspot.com",
    messagingSenderId: "244263586271",
    appId: "1:244263586271:web:325b8026d819fe07505c6a",
    measurementId: "G-8QF1C4TJ1N",
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const collectionName = "unauth-todos";
  

  async function addTodo(text) {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, collectionName), {
        content: text,
        done: false,
        createdAt: now,
        updatedAt: now,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  export async function getTodos(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return todos;
  }

  async function setStateTodo(id, state) {
    const q = query(collection(db, collectionName), where("__name__", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        done: state,
      });
    });
  }
  
  async function filterTodos() {
    const todos = [];
    const q = query(collection(db, collectionName), where("done", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        data: JSON.stringify(doc.data()),
      });
    });
    return todos;
  }
  
  async function revertCompletedTodos() {
    const q = query(collection(db, collectionName), where("done", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        done: false,
      });
    });
  }

  async function deleteCompletedTodos() {
    const q = query(collection(db, collectionName), where("done", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }


  // Inserire qui le funzioni
  async function main() {
    try {
      // await addTodo("Mangiare la pasta");
      // await setStateTodo("rK4O5qfaDExy26Squydn", true);
      // await deleteCompletedTodos();
      console.log("Done")
    } catch (error) {
      console.log("Error:", error.message);
    }
  }


  main();
  