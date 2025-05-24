document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("❌ Please enter both email and password!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.setItem("userEmail", email); // Store user session
            window.location.href = "dashboard.html"; // Redirect to Dashboard
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert("❌ Login failed. Try again!");
    }
});
