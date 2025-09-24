function QuizApp() {
  const [selectedParts, setSelectedParts] = React.useState([]);
  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [submittedTime, setSubmittedTime] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showCorrect, setShowCorrect] = React.useState(false);
  const [showWrong, setShowWrong] = React.useState(false);
  const [showUnanswered, setShowUnanswered] = React.useState(false);

  const filteredQuestions = selectedParts.length === 0
    ? []
    : quizData.filter(q => selectedParts.includes(q.part));

  const handlePartToggle = (part) => {
    setSelectedParts(prev =>
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  const handleChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = () => {
    if (filteredQuestions.length === 0) {
      alert("Please choose the part(s) that you want to practice！");
      return;
    }

    let newScore = 0;
    filteredQuestions.forEach(q => {
      const selected = answers[q.id];
      if (selected && selected[1] === q.answer) newScore++;
    });

    setScore(newScore);
    setSubmittedTime(new Date().toLocaleString());
    setSubmitted(true);
    setShowModal(true);
  };

  const correctQuestions = filteredQuestions.filter(q => answers[q.id] && answers[q.id][1] === q.answer);
  const wrongQuestions = filteredQuestions.filter(q => answers[q.id] && answers[q.id][1] !== q.answer);
  const unansweredQuestions = filteredQuestions.filter(q => !answers[q.id]);

  return (
    <div className="quiz-container">
      <h1>MOCK 5 Reading</h1>

      {!submitted && (
        <div className="part-selection">
          <p> Choose the part(s) that you want to practice：</p>
          {[1, 2, 3, 4, 5].map(part => (
            <label key={part} style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                checked={selectedParts.includes(part)}
                onChange={() => handlePartToggle(part)}
              />
              Part {part}
            </label>
          ))}
        </div>
      )}

      {!submitted && filteredQuestions.map(q => (
        <div key={q.id} className="question" style={{ marginBottom: "20px" }}>
          <p>{q.id}. {q.question}</p>
          {q.image && <img src={q.image} alt="question" style={{ maxWidth: "100%" }} />}
          <div className="options">
            {q.options.map(opt => (
              <label key={opt} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted && filteredQuestions.length > 0 && (
        <button onClick={handleSubmit} style={{ marginTop: "10px" }}>Submit</button>
      )}

      {showModal && (
        <div className="modal" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div className="modal-content" style={{ background: "white", padding: "20px", borderRadius: "10px", maxWidth: "600px", width: "90%", maxHeight: "80%", overflowY: "auto" }}>
            <h2>Results</h2>
            <p>Scores：{score} / {filteredQuestions.length}</p>
            <p>Submission time：{submittedTime}</p>

            <button onClick={() => { setShowCorrect(!showCorrect); setShowWrong(false); setShowUnanswered(false); }} className="modal-btn">Correct</button>
            <button onClick={() => { setShowWrong(!showWrong); setShowCorrect(false); setShowUnanswered(false); }} className="modal-btn">Wrong</button>
            <button onClick={() => { setShowUnanswered(!showUnanswered); setShowCorrect(false); setShowWrong(false); }} className="modal-btn">Unanswered</button>

            {showCorrect && (
              <div style={{ marginTop: "10px" }}>
                {correctQuestions.length === 0 ? <p>No correct answer</p> : correctQuestions.map(q => (
                  <div key={q.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "5px" }}>
                    <p>{q.id}. {q.question} ✅</p>
                    <p style={{ color: "green" }}>{q.remark}</p>
                  </div>
                ))}
              </div>
            )}

            {showWrong && (
              <div style={{ marginTop: "10px" }}>
                {wrongQuestions.length === 0 ? <p>No wrong answer</p> : wrongQuestions.map(q => (
                  <div key={q.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "5px" }}>
                    <p>{q.id}. {q.question} ❌ Correct: {q.answer}</p>
                    <p style={{ color: "red" }}>{q.remark}</p>
                  </div>
                ))}
              </div>
            )}

            {showUnanswered && (
              <div style={{ marginTop: "10px" }}>
                {unansweredQuestions.length === 0 ? <p>All questions answered</p> : unansweredQuestions.map(q => (
                  <div key={q.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "5px" }}>
                    <p>{q.id}. {q.question} ⚠️ Unanswered</p>
                    <p style={{ color: "orange" }}>{q.remark}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              style={{ marginTop: "10px" }}
              onClick={() => {
                setShowModal(false);
                if (window.confirm("Wanna retake the test？")) {
                  window.location.reload();
                } else {
                  window.location.href = "index.html";
                }
              }} className="modal-btn" 
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<QuizApp />);
