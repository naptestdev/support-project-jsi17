import { db, auth } from "./firebase.js";
import { products } from "./data.js";
import {
  onSnapshot,
  collection,
  deleteDoc,
  increment,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "./index.html";
  } else {
    onSnapshot(collection(db, `cart-${auth.currentUser.uid}`), (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id });
      });
      displayCart(products);
    });
  }
});

const displayCart = (products) => {
  console.log(products);
  if (products.length === 0) {
    document.getElementById("cart-container").innerHTML = /* html */ `
    <h4 class="empty-warning">Your cart is empty</h4>
  `;
  } else {
    document.getElementById("cart-container").innerHTML = /* html */ `
    <table style="background: white">
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Subtotal</th>
      </tr>
      ${products
        .map(
          (product) => /*html*/ `
          <tr>
            <td>
              <div class="product-cell">
                <img src="${product.image}" alt="" />
                <p>${product.title}</p>
              </div>
            </td>
            <td class="quantity-cell">
              <button onclick="removeFromCart(${product.id});">
                -
              </button>
              <span>${product.quantity}</span>
              <button onclick="addToCart(${product.id});">
                +
              </button>
            </td>
            <td>$${
              Math.round(product.price * product.quantity * 100) / 100
            }</td>
          </tr>
        `
        )
        .join("")}
    </table>
    <div class="total">
      <h2>Total: $${
        Math.round(
          products.reduce((acc, product) => {
            acc += product.price * product.quantity;
            return acc;
          }, 0) * 100
        ) / 100
      }</h2>
      <button class="btn btn-success" onclick="alert('Purchased Successfully')">Purchase Now</button>
    </div>
  `;
  }
};

window.addToCart = async (productId) => {
  if (!auth.currentUser) {
    alert("Please login");
    return;
  }

  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    updateDoc(docRef, {
      quantity: increment(1),
    });
  } else {
    setDoc(docRef, {
      ...products.find((item) => item.id === productId),
      quantity: 1,
    });
  }
};

window.removeFromCart = async (productId) => {
  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.data().quantity === 1) {
    deleteDoc(docRef);
  } else {
    updateDoc(docRef, {
      quantity: increment(-1),
    });
  }
};
