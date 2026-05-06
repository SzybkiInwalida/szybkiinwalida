import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
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

var welcome = "Dzień dobry!";
var date = new Date();
if (date.getHours() >= 18) {
  welcome = "Dobry wieczór!";
}
document.querySelector(".welcome").innerHTML = welcome;

var input = document.querySelector(".password_input");
var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

document.querySelector(".login").addEventListener("click", () => {
  login();
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.activeElement.blur();
    login();
  }
});

async function login() {
  var password = original || input.value;
  var email = password + "@gmail.com";

  try {
    var userCredential = await signInWithEmailAndPassword(auth, email, password);
    var uid = userCredential.user.uid;

    var snapshot = await get(ref(db, "users/" + uid));
if (!snapshot.exists() && params.toString().length > 0) {
  var data = Object.fromEntries(params);
  await set(ref(db, "users/" + uid), data);
}

    var snapshot = await get(ref(db, "users/" + uid));
    if (snapshot.exists()) {
      var userData = snapshot.val();
      var newParams = new URLSearchParams(userData);
      location.href = "/szybkiinwalida/home.html?" + newParams;
    } else {
      alert("Brak danych użytkownika!");
    }
  } catch (e) {
    alert("Błędne hasło!");
  }
}

input.addEventListener("input", () => {
  var value = input.value.toString();
  var char = value.substring(value.length - 1);
  if (value.length < original.length) {
    original = original.substring(0, original.length - 1);
  } else {
    original = original + char;
  }

  if (!eye.classList.contains("eye_close")) {
    var dots = "";
    for (var i = 0; i < value.length - 1; i++) {
      dots = dots + dot;
    }
    input.value = dots + char;
    delay(3000).then(() => {
      value = input.value;
      if (value.length != 0) {
        input.value = value.substring(0, value.length - 1) + dot;
      }
    });
  }
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

eye.addEventListener("click", () => {
  var classlist = eye.classList;
  if (classlist.contains("eye_close")) {
    classlist.remove("eye_close");
    var dots = "";
    for (var i = 0; i < input.value.length - 1; i++) {
      dots = dots + dot;
    }
    input.value = dots;
  } else {
    classlist.add("eye_close");
    input.value = original;
  }
});