document.addEventListener("DOMContentLoaded", async function () {
    const email = localStorage.getItem("userEmail"); // Get logged-in user's email

    if (!email) {
        alert("❌ No user logged in. Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    // Fetch available challenges from the database
    try {
        const response = await fetch("http://localhost:5000/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");

        const challenges = await response.json();
        const challengeList = document.getElementById("challengeList");
        challengeList.innerHTML = ""; // Clear previous data

        challenges.forEach(challenge => {
            const challengeItem = document.createElement("li");
            challengeItem.innerHTML = `
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <p>🏅 Points: ${challenge.points}</p>
                <button class="btn accept-btn" onclick="acceptChallenge(${challenge.id})">Accept Challenge</button>
            `;
            challengeList.appendChild(challengeItem);
        });
    } catch (error) {
        console.error("❌ Error loading challenges:", error);
        alert("❌ Failed to load challenges.");
    }
});

// Function to accept a challenge
async function acceptChallenge(challengeId) {
    const email = localStorage.getItem("userEmail");

    try {
        const response = await fetch("http://localhost:5000/accept-challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, challengeId })
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Challenge Accepted!");
            window.location.reload();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Error accepting challenge:", error);
        alert("❌ Failed to accept challenge.");
    }
}
