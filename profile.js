document.addEventListener("DOMContentLoaded", async function () {
    const email = localStorage.getItem("userEmail"); // Get logged-in user's email

    if (!email) {
        alert("❌ No user logged in. Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/profile/${encodeURIComponent(email)}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById("fullName").value = data.name;
            document.getElementById("mobileNumber").value = data.mobile;
            document.getElementById("email").value = data.email;
            document.getElementById("age").value = data.age;
            document.getElementById("gender").value = data.gender;
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Error loading profile:", error);
        alert("❌ Failed to load profile.");
    }
});


// Enable editing profile
function enableEdit() {
    document.getElementById("fullName").disabled = false;
    document.getElementById("mobileNumber").disabled = false;
    document.getElementById("age").disabled = false;
    document.getElementById("gender").disabled = false;
    
    document.querySelector(".edit-btn").style.display = "none";
    document.querySelector(".save-btn").style.display = "block";
}

// Save updated profile data
async function saveProfile() {
    const email = localStorage.getItem("userEmail");
    const updatedData = {
        name: document.getElementById("fullName").value,
        mobile: document.getElementById("mobileNumber").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value
    };

    try {
        const response = await fetch(`http://localhost:5000/update-profile/${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Profile updated successfully!");
            location.reload();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        alert("❌ Failed to update profile.");
    }
}
