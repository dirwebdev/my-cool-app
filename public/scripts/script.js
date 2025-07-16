const db = firebase.firestore();
const infoForm = document.getElementById("infoForm");
const addAddressBtn = document.getElementById("addAddressBtn");
const addressContainer = document.getElementById("addressContainer");
let addressCount = 1;

addAddressBtn.addEventListener("click", () => {
  if (addressCount < 5) {
    addressCount++;
    const addressDiv = document.createElement("div");
    addressDiv.className = "form-group full-width";
    addressDiv.innerHTML = `
      <h3>Address ${addressCount}</h3>
      <label for="streetInput${addressCount}">Street *</label>
      <input type="text" id="streetInput${addressCount}" placeholder="Street" required maxlength="100">
      <label for="cityInput${addressCount}">City *</label>
      <input type="text" id="cityInput${addressCount}" placeholder="City" required maxlength="50">
      <label for="countryInput${addressCount}">Country *</label>
      <input type="text" id="countryInput${addressCount}" placeholder="Country" required>
      <label for="zipInput${addressCount}">Zip *</label>
      <input type="text" id="zipInput${addressCount}" placeholder="Zip" required pattern="[0-9A-Z-]{3,10}">
    `;
    addressContainer.insertBefore(addressDiv, addAddressBtn);
  }
});

infoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const addresses = [];
  for (let i = 1; i <= addressCount; i++) {
    addresses.push({
      street: document.getElementById(`streetInput${i}`).value,
      city: document.getElementById(`cityInput${i}`).value,
      country: document.getElementById(`countryInput${i}`).value,
      zip: document.getElementById(`zipInput${i}`).value,
    });
  }
  const info = {
    firstName: document.getElementById("firstNameInput").value,
    lastName: document.getElementById("lastNameInput").value,
    email: document.getElementById("emailInput").value,
    age: parseInt(document.getElementById("ageInput").value),
    phone: document.getElementById("phoneInput").value,
    birthday: document.getElementById("birthdayInput").value
      ? new Date(document.getElementById("birthdayInput").value)
      : null,
    newsletter: document.getElementById("newsletterInput").checked,
    rating: parseInt(document.getElementById("ratingInput").value),
    codeSample: document.getElementById("codeSampleInput").value || null,
    gender: document.querySelector('input[name="gender"]:checked').value,
    addresses,
    skills: document.getElementById("skillsInput").value
      ? document
          .getElementById("skillsInput")
          .value.split(",")
          .map((s) => s.trim())
      : [],
  };
  try {
    await db.collection("users").add(info);
    infoForm.reset();
    addressContainer.innerHTML = `
      <h3>Address 1</h3>
      <label for="streetInput1">Street *</label>
      <input type="text" id="streetInput1" placeholder="Street" required maxlength="100">
      <label for="cityInput1">City *</label>
      <input type="text" id="cityInput1" placeholder="City" required maxlength="50">
      <label for="countryInput1">Country *</label>
      <input type="text" id="countryInput1" placeholder="Country" required>
      <label for="zipInput1">Zip *</label>
      <input type="text" id="zipInput1" placeholder="Zip" required pattern="[0-9A-Z-]{3,10}">
    `;
    addressCount = 1;
  } catch (error) {
    console.error("Error adding info: ", error);
  }
});

db.collection("users").onSnapshot((snapshot) => {
  const infoList = document.getElementById("infoList");
  infoList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.firstName} ${data.lastName}, ${data.email}, Age: ${
      data.age
    }, Phone: ${data.phone}, Birthday: ${
      data.birthday ? data.birthday.toDateString() : "N/A"
    }, Newsletter: ${data.newsletter}, Rating: ${data.rating}, Gender: ${
      data.gender
    }, Code: ${
      data.codeSample ? data.codeSample.substring(0, 50) + "..." : "N/A"
    }, Addresses: ${data.addresses
      .map((a) => `${a.street}, ${a.city}, ${a.country}`)
      .join("; ")}, Skills: ${
      data.skills.length ? data.skills.join(", ") : "None"
    }`;
    infoList.appendChild(li);
  });
});
