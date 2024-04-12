import { db, auth } from "./firebase.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { products } from "./data.js";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

window.handleSignOut = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    document.querySelector("#action-section").innerHTML = /*html*/ `
    <a href="./login.html" style="white-space: nowrap" class="btn btn-primary">Login</a>
    <a href="./register.html" style="white-space: nowrap" class="btn btn-primary">Register</a>
  `;
  } else {
    document.querySelector("#action-section").innerHTML = /*html*/ `
    <a href="./cart.html"><i class="fas fa-shopping-cart"></i></a>
    <img style="width: 30px; height: 30px; border-radius: 999px; display: inline" src="https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      user.displayName
    )}" />
    <a href="javascript:;" style="display: inline-block" class="btn btn-primary" onclick="window.handleSignOut()">Logout</a>
  `;
  }
});

window.addToCart = async (productId) => {
  if (!auth.currentUser) {
    alert("Please login");
    return;
  }

  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      quantity: increment(1),
    });
  } else {
    await setDoc(docRef, {
      ...products.find((item) => item.id === productId),
      quantity: 1,
    });
  }

  alert("Added to cart successfully");

  location.href = "./cart.html";
};

for (let product of products) {
  let card = /*html*/ `
  
  <div
  class="product-item d-flex flex-column align-items-center text-center bg-light rounded py-5 px-3"
>
  <div class="bg-primary mt-n5 py-3" style="width: 80px">
    <h4 class="font-weight-bold text-white mb-0">$${product.price}</h4>
  </div>
  <div
    class="position-relative bg-primary rounded-circle mt-n3 mb-4 p-3"
    style="width: 150px; height: 150px"
  >
    <img
      class="rounded-circle w-100 h-100"
      src="${product.image}"
      style="object-fit: cover"
    />
  </div>
  <h5 class="font-weight-bold mb-4">${product.title}</h5>
  <a href="javascript:;" onclick="window.addToCart(${product.id})" class="btn btn-sm btn-secondary">Order Now</a>
</div>
  `;

  document.querySelector(".product-carousel").innerHTML += card;
}
