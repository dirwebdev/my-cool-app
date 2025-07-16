const db = firebase.firestore();
const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");
const nameList = document.getElementById("nameList");

// Save name to Firebase
nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  db.collection("names").add({ name: name });
  nameInput.value = ""; // Clear the input
});

// Show names from Firebase
db.collection("names").onSnapshot((snapshot) => {
  nameList.innerHTML = "";
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().name;
    nameList.appendChild(li);
  });
});
