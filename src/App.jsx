// src/App.js
import React, { useState } from 'react';
import { quizData } from './assets/quizData';
import './App.css';

const App = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
  };

  const handleAnswerSelect = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData[selectedSubject].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === quizData[selectedSubject][index].answer ? score + 1 : score;
    }, 0);
  };

  const showCorrectAnswers = () => {
    return quizData[selectedSubject].map((question, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = question.answer;
      return (
        <div key={index} className={`question ${userAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
          <h3>{question.question}</h3>
          <p>Your answer: {userAnswer}</p>
          <p>Correct answer: {correctAnswer}</p>
        </div>
      );
    });
  };

  return (
    <div className="quiz-container">
      <h1>Ultimate Subject Quiz for CSE Students</h1>

      {!selectedSubject ? (
        <div className="subject-selection">
          <h2>Select a Subject</h2>
          <button onClick={() => handleSubjectSelect('networking')}>Computer Networking</button>
          <button onClick={() => handleSubjectSelect('operatingSystems')}>Operating Systems</button>
          <button onClick={() => handleSubjectSelect('java')}>Java</button>
          <button onClick={() => handleSubjectSelect('machineLearning')}>Machine Learning</button>
          <button onClick={() => handleSubjectSelect('ai')}>Artificial Intelligence</button>
          <button onClick={() => handleSubjectSelect('bigDataAnalytics')}>Big Data Analytics</button>
        </div>
      ) : (
        <div className="quiz">
          <div className="question">
            <h2>{quizData[selectedSubject][currentQuestionIndex].question}</h2>
            <div className="options">
              {quizData[selectedSubject][currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="navigation">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevQuestion}>Previous</button>
            )}
            {currentQuestionIndex < quizData[selectedSubject].length - 1 && (
              <button onClick={handleNextQuestion}>Next</button>
            )}
            {currentQuestionIndex === quizData[selectedSubject].length - 1 && (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>

          {isSubmitted && (
            <div className="results">
              <h2>Your Score: {calculateScore()} / {quizData[selectedSubject].length}</h2>
              {showCorrectAnswers()}
              <button onClick={() => handleSubjectSelect(null)}>Back to Subjects</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
