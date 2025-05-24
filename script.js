document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let userData = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        age: document.getElementById("age").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
    };

    try {
        let response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        let result = await response.json();
        if (response.ok) {
            localStorage.setItem("userEmail", userData.email); // Store email
            document.getElementById("message").textContent = "Registration Successful!";
            setTimeout(() => { window.location.href = "profile.html"; }, 2000);
        } else {
            alert(result.error);
        }
    } catch (error) {
        alert("Error registering user!");
    }
});
