import { auth } from "./firebase.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

window.handleSignOut = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    document.querySelector("#action-section").innerHTML = /*html*/ `
    <a href="./login.html" class="btn btn-primary">Đăng nhập</a>
  `;
  } else {
    document.querySelector("#action-section").innerHTML = /*html*/ `
    <img style="width: 30px; height: 30px; border-radius: 999px; display: inline" src="https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      user.displayName
    )}" />
    <button style="display: inline-block" class="btn btn-primary" onclick="window.handleSignOut()">Đăng xuất</button>
  `;
  }
});

window.bookTour = async () => {
  if (!auth.currentUser) {
    Swal.fire({
      title: "Hãy đăng nhập để đặt tour",
      icon: "error",
    });
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: "Đặt Tour",
    html: `
    <p>Chúng tôi sẽ liên lạc với bạn</p>
    <input type="text" class="swal2-input" required placeholder="Họ và Tên">
    <input type="tel" class="swal2-input" required placeholder="Số điện thoại">
    <input type="email" class="swal2-input" required placeholder="Email">
  `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
      ];
    },
  });
  if (formValues.every((item) => item.trim())) {
    Swal.fire(
      "Đặt Tour thành công. Chúng tôi sẽ liên lạc với bạn sớm nhất có thể"
    );
  }
};
