import { useState, useEffect } from "react";
import "./App.css";
import categoryQuestions from "./categoryQuestions";

function App() {
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");

  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quizUsers")) || [];
    } catch {
      return [];
    }
  });

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quizCurrentUser")) || null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [authError, setAuthError] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("quizTheme") === "dark"
  );

  const [selectedCategory, setSelectedCategory] = useState("HTML");

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = Object.keys(categoryQuestions);

  const categoryDescriptions = {
    HTML: "Learn webpage structure",
    CSS: "Learn webpage styling",
    JavaScript: "Test programming knowledge",
    "React.js": "Test React concepts"
  };

  // Save registered users
  useEffect(() => {
    localStorage.setItem("quizUsers", JSON.stringify(users));
  }, [users]);

  // Save login session
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem(
        "quizCurrentUser",
        JSON.stringify(loggedInUser)
      );
    } else {
      localStorage.removeItem("quizCurrentUser");
    }
  }, [loggedInUser]);

  // Save theme
  useEffect(() => {
    localStorage.setItem(
      "quizTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Authentication form
  function handleFormChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  // Registration
  function handleRegister(e) {
    e.preventDefault();
    setAuthError("");

    const email = formData.email.trim().toLowerCase();

    if (!formData.name.trim() || !email || !formData.password) {
      setAuthError("Please fill in all fields.");
      return;
    }

    if (users.some((user) => user.email === email)) {
      setAuthError("This email is already registered.");
      return;
    }

    const newUser = {
      name: formData.name.trim(),
      email,
      password: formData.password
    };

    setUsers((prev) => [...prev, newUser]);

    setLoggedInUser({
      name: newUser.name,
      email: newUser.email
    });

    setFormData({
      name: "",
      email: "",
      password: ""
    });

    setPage("category");
  }

  // Login
  function handleLogin(e) {
    e.preventDefault();
    setAuthError("");

    const email = formData.email.trim().toLowerCase();

    const foundUser = users.find(
      (user) =>
        user.email === email &&
        user.password === formData.password
    );

    if (!foundUser) {
      setAuthError("Invalid email or password.");
      return;
    }

    setLoggedInUser({
      name: foundUser.name,
      email: foundUser.email
    });

    setFormData({
      name: "",
      email: "",
      password: ""
    });

    setPage("category");
  }

  // Logout
  function handleLogout() {
    setLoggedInUser(null);
    setPage("home");
    setAuthError("");
  }

  // Random shuffle
  function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [
        shuffled[j],
        shuffled[i]
      ];
    }

    return shuffled;
  }

  // Start Quiz - load all 5 questions
  function startQuiz() {
    const originalQuestions = categoryQuestions[selectedCategory] || [];

    if (originalQuestions.length < 5) {
      alert("This category does not have 5 questions yet.");
      return;
    }

    const randomizedQuestions = shuffleArray(
      originalQuestions.slice(0, 5)
    ).map((item) => ({
      ...item,
      options: shuffleArray(item.options)
    }));

    setQuizQuestions(randomizedQuestions);
    setCurrentQuestion(0);
    setUserAnswers({});
    setMarkedQuestions([]);
    setTimeLeft(60);
    setTimeTaken(0);
    setShowSummary(false);
    setShowConfirm(false);
    setStartTime(Date.now());
    setPage("quiz");
  }

  const totalQuestions = quizQuestions.length;
  const question = quizQuestions[currentQuestion];

  // Countdown Timer
  useEffect(() => {
    if (page !== "quiz") return;

    if (timeLeft <= 0) {
      setTimeTaken(
        Math.floor((Date.now() - startTime) / 1000)
      );
      setPage("result");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [page, timeLeft, startTime]);

  // Save Answer
  function handleAnswer(option) {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option
    }));
  }

  // Next Question
  function handleNext() {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  // Previous Question
  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  // Skip Question
  function handleSkip() {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: "Skipped"
    }));

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowConfirm(true);
    }
  }

  // Mark for Review
  function toggleMark() {
    setMarkedQuestions((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((item) => item !== currentQuestion)
        : [...prev, currentQuestion]
    );
  }

  // Show submission confirmation
  function handleSubmit() {
    setShowConfirm(true);
  }

  // Confirm submission
  function confirmSubmit() {
    setTimeTaken(
      Math.floor((Date.now() - startTime) / 1000)
    );

    setShowConfirm(false);
    setShowSummary(false);
    setPage("result");
  }

  // Cancel submission
  function cancelSubmit() {
    setShowConfirm(false);
  }

  // Calculate score
  const correctAnswers = quizQuestions.filter(
    (item, index) => userAnswers[index] === item.answer
  ).length;

  const incorrectAnswers = quizQuestions.filter(
    (item, index) =>
      userAnswers[index] &&
      userAnswers[index] !== "Skipped" &&
      userAnswers[index] !== item.answer
  ).length;

  const skippedAnswers = quizQuestions.filter(
    (item, index) =>
      !userAnswers[index] || userAnswers[index] === "Skipped"
  ).length;

  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  // Certificate requires 80% or above
  const certificateEligible = scorePercentage >= 80;

  // Answered count
  const answeredCount = Object.values(userAnswers).filter(
    (answer) => answer && answer !== "Skipped"
  ).length;

  // Progress: 20%, 40%, 60%, 80%, 100%
  const progressPercentage =
    totalQuestions > 0
      ? Math.round(
          ((currentQuestion + 1) / totalQuestions) * 100
        )
      : 0;

  // Restart Quiz
  function handleRestart() {
    setCurrentQuestion(0);
    setUserAnswers({});
    setMarkedQuestions([]);
    setTimeLeft(60);
    setTimeTaken(0);
    setShowSummary(false);
    setShowConfirm(false);
    setStartTime(null);
    setPage("category");
  }

  // Back to Home
  function handleHome() {
    setPage("home");
    setCurrentQuestion(0);
    setUserAnswers({});
    setMarkedQuestions([]);
    setShowSummary(false);
    setShowConfirm(false);
  }

  // Print Certificate
  function generateCertificate() {
    window.print();
  }

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>

      {/* HEADER */}
      <header className="top-header">
        <div className="brand">
          <span className="brand-icon">📝</span>
          <span>QuizMaster</span>
        </div>

        <div className="header-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {loggedInUser && (
            <>
              <span className="user-name">
                Hi, {loggedInUser.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">

        {/* HOME PAGE */}
        {page === "home" && (
          <section className="welcome-card">
            <div className="hero-icon">🎓</div>

            <p className="eyebrow">WELCOME TO QUIZMASTER</p>

            <h1>
              Test Your Knowledge.
              <span> Challenge Yourself.</span>
            </h1>

            <p className="hero-description">
              Improve your skills with interactive quizzes
              in HTML, CSS, JavaScript, and React.js.
            </p>

            <div className="feature-highlights">
              <div>
                <strong>4</strong>
                <span>Categories</span>
              </div>

              <div>
                <strong>5</strong>
                <span>Questions per Quiz</span>
              </div>

              <div>
                <strong>60s</strong>
                <span>Quiz Timer</span>
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                if (loggedInUser) {
                  setPage("category");
                } else {
                  setAuthMode("login");
                  setPage("auth");
                }
              }}
            >
              {loggedInUser ? "Continue to Quiz →" : "Get Started →"}
            </button>

            <p className="signup-text">
              New student?{" "}
              <button
                className="text-btn"
                onClick={() => {
                  setAuthMode("register");
                  setPage("auth");
                }}
              >
                Create an account
              </button>
            </p>
          </section>
        )}

        {/* LOGIN / REGISTER */}
        {page === "auth" && (
          <section className="auth-card">
            <div className="hero-icon">👤</div>

            <h1>
              {authMode === "login"
                ? "Welcome Back!"
                : "Create Account"}
            </h1>

            <p>
              {authMode === "login"
                ? "Login to continue your quiz journey."
                : "Register to start testing your knowledge."}
            </p>

            <form
              onSubmit={
                authMode === "login"
                  ? handleLogin
                  : handleRegister
              }
            >
              {authMode === "register" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleFormChange}
                required
              />

              {authError && (
                <p className="error-message">{authError}</p>
              )}

              <button className="primary-btn" type="submit">
                {authMode === "login" ? "Login" : "Register"}
              </button>
            </form>

            <p className="signup-text">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                className="text-btn"
                onClick={() => {
                  setAuthError("");
                  setAuthMode(
                    authMode === "login" ? "register" : "login"
                  );
                }}
              >
                {authMode === "login" ? " Register" : " Login"}
              </button>
            </p>

            <button
              className="back-btn"
              onClick={() => setPage("home")}
            >
              ← Back to Home
            </button>
          </section>
        )}

        {/* CATEGORY PAGE */}
        {page === "category" && (
          <section className="selection-card">
            <p className="eyebrow">PERSONALIZE YOUR QUIZ</p>

            <h1>Choose Your Challenge</h1>

            <p>Select a category to start your quiz.</p>

            <h3 className="section-heading">
              Select Category
            </h3>

            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-card selected-category"
                      : "category-card"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="category-icon">
                    {category === "HTML"
                      ? "🌐"
                      : category === "CSS"
                      ? "🎨"
                      : category === "JavaScript"
                      ? "⚡"
                      : "⚛️"}
                  </span>

                  <strong>{category}</strong>

                  <small>
                    {categoryDescriptions[category]}
                  </small>
                </button>
              ))}
            </div>

            <div className="selection-actions">
              <button
                className="secondary-btn"
                onClick={handleHome}
              >
                Back
              </button>

              <button
                className="primary-btn"
                onClick={startQuiz}
              >
                Start Quiz →
              </button>
            </div>
          </section>
        )}

        {/* QUIZ PAGE */}
        {page === "quiz" && question && (
          <section className="quiz-layout">

            {/* MAIN QUESTION CARD */}
            <div className="quiz-main-card">
              <div className="quiz-top">
                <div>
                  <span className="eyebrow">
                    {selectedCategory} QUIZ
                  </span>

                  <h2>All Questions</h2>
                </div>

                <div className="timer-box">
                  ⏱ {timeLeft}s
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="quiz-progress-info">
                <span>
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>

                <span>{progressPercentage}%</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressPercentage}%`
                  }}
                />
              </div>

              {/* QUESTION HEADING */}
              <div className="question-heading">
                <span>QUESTION {currentQuestion + 1}</span>

                <button
                  className={
                    markedQuestions.includes(currentQuestion)
                      ? "mark-btn marked"
                      : "mark-btn"
                  }
                  onClick={toggleMark}
                >
                  {markedQuestions.includes(currentQuestion)
                    ? "★ Marked"
                    : "☆ Mark for Review"}
                </button>
              </div>

              <h2 className="question-text">
                {question.question}
              </h2>

              {/* ANSWER OPTIONS */}
              <div className="answer-options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={
                      userAnswers[currentQuestion] === option
                        ? "answer-option selected-option"
                        : "answer-option"
                    }
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    {option}
                  </button>
                ))}
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="quiz-navigation">
                <button
                  className="secondary-btn"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  ← Previous
                </button>

                <button
                  className="skip-btn"
                  onClick={handleSkip}
                >
                  Skip
                </button>

                {currentQuestion < totalQuestions - 1 ? (
                  <button
                    className="primary-btn"
                    onClick={handleNext}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className="primary-btn"
                    onClick={handleSubmit}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>

              {/* SUBMISSION CONFIRMATION */}
              {showConfirm && (
                <div className="confirmation-overlay">
                  <div className="confirmation-box">
                    <h2>Submit Quiz?</h2>

                    <p>
                      Are you sure you want to submit your quiz?
                    </p>

                    <div className="selection-actions">
                      <button
                        className="secondary-btn"
                        onClick={cancelSubmit}
                      >
                        Continue Quiz
                      </button>

                      <button
                        className="primary-btn"
                        onClick={confirmSubmit}
                      >
                        Yes, Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* QUESTION NAVIGATION PANEL */}
            <aside className="question-panel">
              <h3>Question Navigator</h3>

              <p>
                Answered: {answeredCount} / {totalQuestions}
              </p>

              <div className="question-number-grid">
                {quizQuestions.map((item, index) => {
                  const isAnswered =
                    userAnswers[index] &&
                    userAnswers[index] !== "Skipped";

                  const isSkipped =
                    userAnswers[index] === "Skipped";

                  const isMarked =
                    markedQuestions.includes(index);

                  return (
                    <button
                      key={index}
                      className={[
                        "question-number",
                        isAnswered ? "number-answered" : "",
                        isSkipped ? "number-skipped" : "",
                        isMarked ? "number-marked" : "",
                        currentQuestion === index
                          ? "number-current"
                          : ""
                      ].join(" ")}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="navigator-legend">
                <span>
                  <i className="legend-answered" />
                  Answered
                </span>

                <span>
                  <i className="legend-unanswered" />
                  Unanswered
                </span>

                <span>
                  <i className="legend-marked" />
                  Review
                </span>
              </div>

              <div className="navigator-summary">
                <p>
                  Marked for review: {markedQuestions.length}
                </p>

                <p>
                  Skipped:{" "}
                  {quizQuestions.filter(
                    (item, index) =>
                      userAnswers[index] === "Skipped"
                  ).length}
                </p>
              </div>
            </aside>
          </section>
        )}

        {/* RESULT PAGE */}
        {page === "result" && (
          <section className="result-card">
            <div className="result-icon">
              {certificateEligible ? "🏆" : "📚"}
            </div>

            <p className="eyebrow">QUIZ COMPLETED</p>

            <h1>
              {certificateEligible
                ? "Congratulations!"
                : "Keep Practicing!"}
            </h1>

            <p>
              Well done, {loggedInUser?.name}!
              Here is your performance report.
            </p>

            <div className="score-circle">
              <strong>{scorePercentage}%</strong>
              <span>Your Score</span>
            </div>

            <div className="analytics-grid">
              <div className="analytics-box">
                <strong>{correctAnswers}</strong>
                <span>Correct</span>
              </div>

              <div className="analytics-box">
                <strong>{incorrectAnswers}</strong>
                <span>Incorrect</span>
              </div>

              <div className="analytics-box">
                <strong>{skippedAnswers}</strong>
                <span>Skipped / Unanswered</span>
              </div>

              <div className="analytics-box">
                <strong>{timeTaken}s</strong>
                <span>Time Taken</span>
              </div>
            </div>

            <h3 className="result-message">
              {certificateEligible
                ? "Excellent! You earned your certificate!"
                : "You need at least 80% to earn a certificate. Try again!"}
            </h3>

            <div className="result-actions">
              <button
                className="secondary-btn"
                onClick={() => setPage("summary")}
              >
                View Summary
              </button>

              {certificateEligible && (
                <button
                  className="secondary-btn"
                  onClick={() => setPage("certificate")}
                >
                  View Certificate
                </button>
              )}

              <button
                className="primary-btn"
                onClick={handleRestart}
              >
                Try Again
              </button>
            </div>

            <button
              className="back-btn"
              onClick={handleHome}
            >
              Back to Home
            </button>
          </section>
        )}

        {/* SEPARATE CERTIFICATE PAGE */}
        {page === "certificate" && certificateEligible && (
          <section className="result-card certificate-page">
            <p className="eyebrow">YOUR ACHIEVEMENT</p>
            <h1>🎓 Your Certificate</h1>
            <p>Congratulations! You scored 80% or above.</p>

            <div className="certificate">
              <div className="certificate-content">
                <span className="certificate-icon">
                  🏆
                </span>

                <h2>Certificate of Achievement</h2>

                <p>This certificate is proudly presented to</p>

                <h1>{loggedInUser?.name}</h1>

                <p>
                  For successfully completing the{" "}
                  {selectedCategory} Quiz.
                </p>

                <h2>{scorePercentage}%</h2>

                <p className="certificate-footer">
                  QuizMaster |{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="result-actions">
              <button
                className="primary-btn print-btn"
                onClick={generateCertificate}
              >
                🖨 Print / Save Certificate as PDF
              </button>

              <button
                className="secondary-btn"
                onClick={() => setPage("result")}
              >
                Back to Result
              </button>
            </div>

            <button className="back-btn" onClick={handleHome}>
              Back to Home
            </button>
          </section>
        )}

        {/* SEPARATE ANSWER SUMMARY PAGE */}
        {page === "summary" && (
          <section className="result-card">
            <p className="eyebrow">QUIZ REVIEW</p>
            <h1>Answer Summary</h1>
            <p>Review your answers and the correct answers below.</p>

            <div className="answer-summary">
              {quizQuestions.map((item, index) => {
                const answer = userAnswers[index];
                const isCorrect = answer === item.answer;

                return (
                  <div className="summary-item" key={index}>
                    <h4>Question {index + 1}</h4>
                    <p>{item.question}</p>
                    <p>
                      Your Answer: <strong>{answer || "Not answered"}</strong>
                    </p>
                    <p>
                      Correct Answer: <strong>{item.answer}</strong>
                    </p>
                    <span
                      className={
                        isCorrect
                          ? "correct-label"
                          : "incorrect-label"
                      }
                    >
                      {isCorrect
                        ? "Correct"
                        : answer === "Skipped"
                        ? "Skipped"
                        : "Incorrect"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="result-actions">
              <button
                className="secondary-btn"
                onClick={() => setPage("result")}
              >
                Back to Result
              </button>
              <button
                className="primary-btn"
                onClick={handleRestart}
              >
                Try Again
              </button>
            </div>

            <button className="back-btn" onClick={handleHome}>
              Back to Home
            </button>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          © 2026 QuizMaster | Online Quiz Application
        </p>
      </footer>
    </div>
  );
}

export default App;