import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQ5KeBM62ANt5D9Ef-QVrznSdwKpgoBF8",
  authDomain: "reddit-clone-5d58f.firebaseapp.com",
  projectId: "reddit-clone-5d58f",
  storageBucket: "reddit-clone-5d58f.appspot.com",
  messagingSenderId: "50970467023",
  appId: "1:50970467023:web:deb6a6afa9666ac015b5ba",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
