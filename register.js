document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;

    // Ensure all fields are filled
    if (!name || !mobile || !email || !age || !gender || !password) {
        alert("❌ Please fill all fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mobile, email, age, gender, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Registration Error:", error);
        alert("❌ Registration failed. Try again!");
    }
});
