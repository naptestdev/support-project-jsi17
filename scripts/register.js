import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { auth } from "./firebase.js";

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelector("button[type=submit]").innerText = "Sign Up...";

  document
    .querySelector("button[type=submit]")
    .setAttribute("disabled", "true");

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);

      await sendEmailVerification(user);

      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
          username
        )}.svg`,
      });

      await signOut(auth);

      alert("Please verify your email");

      location.href = "./login.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorCode);
    })
    .finally(() => {
      document.querySelector("button[type=submit]").innerText = "Sign Up";
      document.querySelector("button[type=submit]").removeAttribute("disabled");
    });
});
