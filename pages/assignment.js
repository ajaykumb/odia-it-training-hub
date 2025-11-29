import { useEffect, useState } from "react";

export default function AssignmentPage() {
  const STORAGE_KEY = "assignmentSubmission";

  // ✅ SQL + PL/SQL Questions (20 Total)
  const questions = [
    "What is SQL? Explain its main components.",
    "What is the difference between DDL, DML, and TCL?",
    "What is a primary key? Give an example.",
    "What is a foreign key? How does it work?",
    "Explain the difference between WHERE and HAVING clauses.",
    "What is JOIN? Explain different types of joins in SQL.",
    "What is Normalization? Explain 1NF, 2NF, and 3NF.",
    "Write a SQL query to find the second highest salary.",
    "What is the difference between DELETE, TRUNCATE, and DROP?",
    "What is a view? Why is it used?",
    "What is PL/SQL? How is it different from SQL?",
    "Explain the structure of a PL/SQL block with an example.",
    "What is the %TYPE and %ROWTYPE attribute?",
    "What is an EXCEPTION in PL/SQL? Explain predefined exceptions.",
    "What is a CURSOR? Explain implicit and explicit cursors.",
    "Write a PL/SQL block to print numbers from 1 to 10.",
    "Write a PL/SQL program to check if a number is even or odd.",
    "What is a Stored Procedure? How is it different from a function?",
    "What is a Trigger? Explain different types of triggers.",
    "What is the use of the SELECT INTO clause in PL/SQL?"
  ];

  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Load saved submission when page loads
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setStudentName(data.name);
      setAnswers(data.answers);
      setSubmitted(true);
    } else {
      setAnswers(Array(questions.length).fill(""));
    }
  }, []);

  const startExam = () => {
    if (studentName.trim() === "") {
      alert("Please enter your name before starting the exam.");
      return;
    }
    setExamStarted(true);
  };

  const submitAssignment = () => {
    const data = {
      name: studentName,
      answers,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSubmitted(true);
    alert("Your answers have been submitted successfully!");
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>Student Assignment</h1>

      {/* NAME INPUT SECTION */}
      {!submitted && !examStarted && (
        <div style={{ marginBottom: "20px" }}>
          <label><b>Your Name:</b></label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{
              display: "block",
              marginTop: "10px",
              padding: "10px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #aaa",
            }}
            placeholder="Enter your full name"
          />
        </div>
      )}

      {/* SHOW STUDENT NAME IF ALREADY SUBMITTED */}
      {submitted && (
        <div style={{ marginBottom: "20px", background: "#eef", padding: "10px", borderRadius: "5px" }}>
          <b>Student Name:</b> {studentName}
        </div>
      )}

      {/* START EXAM BUTTON */}
      {!examStarted && !submitted && (
        <button
          onClick={startExam}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          Start Exam
        </button>
      )}

      {/* QUESTIONS DISPLAY */}
      {(examStarted || submitted) && (
        <div>
          {questions.map((question, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p><b>Q{index + 1}. {question}</b></p>
              <textarea
                value={answers[index]}
                disabled={submitted}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              />
            </div>
          ))}

          {/* SUBMIT BUTTON */}
          {!submitted && (
            <button
              onClick={submitAssignment}
              style={{
                padding: "10px 20px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Submit Answers
            </button>
          )}

          {/* AFTER SUBMISSION MESSAGE */}
          {submitted && (
            <div style={{ marginTop: "20px", padding: "10px", background: "#e3ffe3" }}>
              <h3>Your answers have been submitted ✔</h3>
              <p>You cannot edit them now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
