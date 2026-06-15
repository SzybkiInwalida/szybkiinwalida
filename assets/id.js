import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1rgHsmaeZ8TnZso9zykjDMCVzGuI3y58",
  authDomain: "szybkiinwalida-a85c6.firebaseapp.com",
  projectId: "szybkiinwalida-a85c6",
  storageBucket: "szybkiinwalida-a85c6.firebasestorage.app",
  messagingSenderId: "129001669260",
  appId: "1:129001669260:web:45b322e121f46ae206b1a9",
  databaseURL: "https://szybkiinwalida-a85c6-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
var params = new URLSearchParams(window.location.search);
var date = new Date();

document.querySelector(".welcome").innerHTML = date.getHours() >= 18 ? "Dobry wieczór!" : "Dzień dobry!";
document.querySelector(".login").addEventListener("click", login);
document.querySelector(".password_input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") login();
});

async function login() {
  var password = document.querySelector(".password_input").value.trim();
  if (!password) {
    alert("Wpisz hasło!");
    return;
  }
  if (password.length < 6) {
    alert("Hasło musi mieć co najmniej 6 znaków!");
    return;
  }

  var email = password + "@gmail.com";
  var userCredential;

  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (signInError) {
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (createError) {
      console.error("login:", signInError.code, "| create:", createError.code);
      alert("Błędne hasło!");
      return;
    }
  }
  try {
    var uid = userCredential.user.uid;
    var snapshot = await get(ref(db, "users/" + uid));
    if (!snapshot.exists() && params.toString().length > 0) {
      var data = Object.fromEntries(params);
      await set(ref(db, "users/" + uid), data);
    }
    snapshot = await get(ref(db, "users/" + uid));
    if (snapshot.exists()) {
      var newParams = new URLSearchParams(snapshot.val());
      location.href = "/szybkiinwalida/home.html?" + newParams;
    } else {
      alert("Brak danych użytkownika!");
    }
  } catch (e) {
    console.error(e.code, e.message);
    alert("Wystąpił błąd przy zapisie/odczycie danych. Spróbuj ponownie.");
  }
}
