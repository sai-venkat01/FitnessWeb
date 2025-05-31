const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",      
    password: "your_mysql_password",  
    database: "fitnessApp"
});

// Check MySQL Connection
db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
    } else {
        console.log("✅ MySQL Connected!");
    }
});

// Create Tables if Not Exists
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        mobile VARCHAR(15),
        age INT,
        email VARCHAR(100) UNIQUE,
        gender VARCHAR(10),
        password VARCHAR(255)
    )
`, (err) => {
    if (err) console.log("❌ Error creating users table:", err);
});

db.query(`
    CREATE TABLE IF NOT EXISTS challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        points INT DEFAULT 50
    )
`, (err) => {
    if (err) console.log("❌ Error creating challenges table:", err);
});

db.query(`
    CREATE TABLE IF NOT EXISTS user_challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(100),
        challenge_id INT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (challenge_id) REFERENCES challenges(id)
    )
`, (err) => {
    if (err) console.log("❌ Error creating user_challenges table:", err);
});

// API to Register User
app.post("/register", async (req, res) => {
    const { name, mobile, age, email, gender, password } = req.body;

    if (!name || !mobile || !age || !email || !gender || !password) {
        return res.status(400).send({ error: "❌ All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            "INSERT INTO users (name, mobile, age, email, gender, password) VALUES (?, ?, ?, ?, ?, ?)",
            [name, mobile, age, email, gender, hashedPassword],
            (err) => {
                if (err) {
                    console.error("❌ Database Insert Error:", err);
                    return res.status(500).send({ error: "❌ Error saving data" });
                }
                res.status(201).send({ message: "✅ User Registered Successfully!" });
            }
        );
    } catch (error) {
        console.error("❌ Error Hashing Password:", error);
        res.status(500).send({ error: "❌ Server Error" });
    }
});

// API to Login User
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: "❌ Email and password are required!" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).send({ error: "❌ Database error!" });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: "❌ User not found!" });
        }

        const user = results[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).send({ error: "❌ Incorrect password!" });
        }

        res.status(200).send({ message: "✅ Login successful!", user });
    });
});

// API to Fetch User Profile
app.get("/profile/:email", (req, res) => {
    const email = decodeURIComponent(req.params.email);

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("❌ Error fetching profile:", err);
            return res.status(500).send({ error: "❌ Error loading profile" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send({ error: "❌ User not found" });
        }
    });
});

// API to Update Profile
app.put("/update-profile/:email", (req, res) => {
    const email = req.params.email;
    const { name, mobile, age, gender } = req.body;

    db.query(
        "UPDATE users SET name = ?, mobile = ?, age = ?, gender = ? WHERE email = ?",
        [name, mobile, age, gender, email],
        (err) => {
            if (err) {
                console.error("❌ Error updating profile:", err);
                return res.status(500).send({ error: "❌ Error updating profile" });
            }
            res.send({ message: "✅ Profile updated successfully!" });
        }
    );
});

// API to Fetch All Challenges
app.get("/challenges", (req, res) => {
    db.query("SELECT * FROM challenges", (err, results) => {
        if (err) {
            console.error("❌ Error fetching challenges:", err);
            return res.status(500).send({ error: "❌ Error loading challenges" });
        }
        res.json(results);
    });
});

// API to Accept a Challenge
app.post("/accept-challenge", (req, res) => {
    const { email, challengeId } = req.body;

    if (!email || !challengeId) {
        return res.status(400).send({ error: "❌ Email and challenge ID are required!" });
    }

    db.query(
        "INSERT INTO user_challenges (user_email, challenge_id) VALUES (?, ?)",
        [email, challengeId],
        (err) => {
            if (err) {
                console.error("❌ Error accepting challenge:", err);
                return res.status(500).send({ error: "❌ Error accepting challenge" });
            }
            res.send({ message: "✅ Challenge Accepted!" });
        }
    );
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
