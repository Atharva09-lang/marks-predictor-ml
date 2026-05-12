const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/check", (req, res) => {
  const {
    study_hours,
    attendance,
    previous_marks,
    sleep_hours
  } = req.body;

  const python = spawn("python", [
    "check.py",
    study_hours,
    attendance,
    previous_marks,
    sleep_hours
  ]);

  let data = "";
  let error = "";

  // Python output
  python.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  // Python error
  python.stderr.on("data", (chunk) => {
    error += chunk.toString();
  });

  python.on("close", (code) => {
    console.log("Python output:", data);
    //console.log("Python error:", error);

    if (error) {
      return res.status(500).json({
        error: error
      });
    }

    try {
      const result = JSON.parse(data);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Invalid JSON from Python"
      });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});