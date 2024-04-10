import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

export const signInWithGoogle = () => {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then(() => {
      location.hash = "/";
    })
    .catch((error) => {
      alert(error.code);
    });
};
