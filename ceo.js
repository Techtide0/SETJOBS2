import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvHVc-TRxNXyyAwmlpPn7agRpqwGdASfc",
    authDomain: "setjob-23717.firebaseapp.com",
    projectId: "setjob-23717",
    storageBucket: "setjob-23717.firebasestorage.app",
    messagingSenderId: "307680673058",
    appId: "1:307680673058:web:a907324888bae733cfb97b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveOrUpdateCEOAndDomain(
  inputText,
  collectionName = "savedData"
) {
  try {
    showNotification(
      "Please wait while the data is saving. Only takes a few minutes.",
      "loading"
    );

    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""); // Trim and remove empty lines

    let ceoName = ""; // Initialize a variable to store the CEO name

    // Iterate through all lines
    for (const line of lines) {
      if (line.includes("@")) {
        // Current line contains an email
        const email = line.split(" ").find((word) => word.includes("@"));
        const domain = email.split("@")[1]; // Extract domain

        if (!ceoName) {
          ceoName = " "; // Default if no CEO name is found
        }

        // Save to Firestore
        const docRef = doc(db, collectionName, domain);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await setDoc(docRef, { ceoNames: ceoName, domain }, { merge: true });
        } else {
          await setDoc(docRef, { ceoNames: ceoName, domain });
        }

        // Reset ceoName for the next pair
        ceoName = "";
      } else {
        // Current line does not contain an email, so treat it as a CEO name
        ceoName = line;
      }
    }

    showNotification(
      "Data saved successfully! Thank you for updating me.",
      "success"
    );
    clearInputField();
  } catch (error) {
    showNotification(`Error: ${error.message}`, "error");
  }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");

  // Set the message content
  notification.textContent = message;

  // Reset classes before adding new ones
  notification.classList.remove("success", "error", "loading");
  notification.classList.add(type);

  // Make notification visible
  notification.classList.remove("hidden");

  if (type !== "loading") {
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);
  }
}

function clearInputField() {
  document.getElementById("domain").value = "";
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const inputText = document.getElementById("domain").value.trim();

  if (!inputText) {
    showNotification("Input cannot be empty!", "error");
    return;
  }

  saveOrUpdateCEOAndDomain(inputText);
});
