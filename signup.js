import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqhzOxt7fwEJbt1wszFieJktpe4wb8PrQ",
  authDomain: "stopblocker-auth.firebaseapp.com",
  projectId: "stopblocker-auth",
  storageBucket: "stopblocker-auth.firebasestorage.app",
  messagingSenderId: "188479654614",
  appId: "1:188479654614:web:80b068c25691256375d777",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {

  const googleBtn = document.querySelector(".google-btn");
  const closeBtn = document.querySelector(".close-btn");
  const overlay = document.querySelector(".overlay");

  let isSigningIn = false;

  // GOOGLE LOGIN
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {

      if (isSigningIn) return;
      isSigningIn = true;

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        
// 🔥 Create user in Firestore if new
const userRef = doc(db, "users", user.uid);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
  await setDoc(userRef, {
    email: user.email,
    plan: "free",
    blockedSites: []
  });
  console.log("New user created in Firestore");
}

alert("Welcome " + user.displayName);
overlay.style.display = "none";
window.location.href = "welcome.html";

      } catch (error) {
        console.error(error);
        alert(error.message);
      }

      isSigningIn = false;
    });
  }

  // CLOSE MODAL
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

});

