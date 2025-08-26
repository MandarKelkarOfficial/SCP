import React, { useState, useEffect } from 'react';

// Define careerPaths and tests data structures
const careerPaths = {
  engineering: { name: 'Computer Engineering', score: 0 },
  science: { name: 'Computer Sciences', score: 0 },
  arts: { name: 'AI', score: 0 },
  commerce: { name: 'Data Science', score: 0 },
  healthcare: { name: 'ML', score: 0 }
};

const tests = [
  {
    name: 'Problem Solving',
    questions: [
      {
        text: 'When faced with a complex problem, you...',
        options: [
          { text: 'Break it down into smaller parts', path: ['engineering'] },
          { text: 'Research similar problems', path: ['science'] },
          { text: 'Discuss with others for ideas', path: ['arts'] },
          { text: 'Create a step-by-step plan', path: ['commerce'] }
        ]
      },
      {
        text: 'You enjoy working with:',
        options: [
          { text: 'Numbers and equations', path: ['engineering', 'science'] },
          { text: 'Artistic materials', path: ['arts'] },
          { text: 'Financial statements', path: ['commerce'] },
          { text: 'Medical equipment', path: ['healthcare'] }
        ]
      },
      {
        text: 'Your ideal workspace would be:',
        options: [
          { text: 'Laboratory', path: ['science', 'healthcare'] },
          { text: 'Construction site', path: ['engineering'] },
          { text: 'Art studio', path: ['arts'] },
          { text: 'Corporate office', path: ['commerce'] }
        ]
      },
      {
        text: 'Which subject did you enjoy most in school?',
        options: [
          { text: 'Mathematics', path: ['engineering', 'science'] },
          { text: 'Biology', path: ['healthcare'] },
          { text: 'Literature', path: ['arts'] },
          { text: 'Economics', path: ['commerce'] }
        ]
      },
      {
        text: 'How do you approach deadlines?',
        options: [
          { text: 'Systematic planning', path: ['engineering', 'commerce'] },
          { text: 'Creative solutions', path: ['arts'] },
          { text: 'Detailed research', path: ['science'] },
          { text: 'Team collaboration', path: ['healthcare'] }
        ]
      }
    ]
  },
  {
    name: 'Analytical Thinking',
    questions: [
      {
        text: 'When analyzing data, you prefer:',
        options: [
          { text: 'Statistical models', path: ['science', 'engineering'] },
          { text: 'Financial trends', path: ['commerce'] },
          { text: 'Human behavior patterns', path: ['arts'] },
          { text: 'Medical research data', path: ['healthcare'] }
        ]
      },
      {
        text: 'Which puzzle type do you prefer?',
        options: [
          { text: 'Mechanical puzzles', path: ['engineering'] },
          { text: 'Cryptic crosswords', path: ['arts'] },
          { text: 'Sudoku', path: ['commerce'] },
          { text: 'Logic grids', path: ['science'] }
        ]
      },
      {
        text: 'When making decisions, you rely on:',
        options: [
          { text: 'Data analysis', path: ['science', 'commerce'] },
          { text: 'Technical specifications', path: ['engineering'] },
          { text: 'Emotional impact', path: ['arts'] },
          { text: 'Ethical considerations', path: ['healthcare'] }
        ]
      },
      {
        text: 'Which scientific field interests you most?',
        options: [
          { text: 'Robotics', path: ['engineering'] },
          { text: 'Quantum Physics', path: ['science'] },
          { text: 'Pharmacology', path: ['healthcare'] },
          { text: 'Economics', path: ['commerce'] }
        ]
      },
      {
        text: 'How do you evaluate arguments?',
        options: [
          { text: 'Logical consistency', path: ['engineering', 'science'] },
          { text: 'Financial viability', path: ['commerce'] },
          { text: 'Emotional resonance', path: ['arts'] },
          { text: 'Social impact', path: ['healthcare'] }
        ]
      }
    ]
  },
  {
    name: 'Creativity & Innovation',
    questions: [
      {
        text: 'Your creative process involves:',
        options: [
          { text: 'Technical sketching', path: ['engineering'] },
          { text: 'Scientific experimentation', path: ['science'] },
          { text: 'Storytelling', path: ['arts'] },
          { text: 'Business model innovation', path: ['commerce'] }
        ]
      },
      {
        text: 'Which activity appeals most?',
        options: [
          { text: 'Building prototypes', path: ['engineering'] },
          { text: 'Writing poetry', path: ['arts'] },
          { text: 'Market analysis', path: ['commerce'] },
          { text: 'Clinical trials', path: ['healthcare'] }
        ]
      },
      {
        text: 'You prefer to express ideas through:',
        options: [
          { text: 'Mathematical formulas', path: ['science'] },
          { text: 'Engineering designs', path: ['engineering'] },
          { text: 'Visual arts', path: ['arts'] },
          { text: 'Business plans', path: ['commerce'] }
        ]
      },
      {
        text: 'Which innovation excites you most?',
        options: [
          { text: 'AI algorithms', path: ['engineering', 'science'] },
          { text: 'New art mediums', path: ['arts'] },
          { text: 'Medical breakthroughs', path: ['healthcare'] },
          { text: 'Financial technologies', path: ['commerce'] }
        ]
      },
      {
        text: 'When brainstorming, you:',
        options: [
          { text: 'Focus on practicality', path: ['engineering'] },
          { text: 'Explore abstract concepts', path: ['science', 'arts'] },
          { text: 'Consider profitability', path: ['commerce'] },
          { text: 'Prioritize safety', path: ['healthcare'] }
        ]
      }
    ]
  },
  {
    name: 'Interpersonal Skills',
    questions: [
      {
        text: 'In team projects, you typically:',
        options: [
          { text: 'Handle technical aspects', path: ['engineering'] },
          { text: 'Lead discussions', path: ['arts', 'commerce'] },
          { text: 'Analyze data', path: ['science'] },
          { text: 'Ensure compliance', path: ['healthcare'] }
        ]
      },
      {
        text: 'Which social cause matters most?',
        options: [
          { text: 'Technological access', path: ['engineering'] },
          { text: 'Scientific literacy', path: ['science'] },
          { text: 'Arts funding', path: ['arts'] },
          { text: 'Healthcare equity', path: ['healthcare'] }
        ]
      },
      {
        text: 'Your communication style is:',
        options: [
          { text: 'Precise and technical', path: ['engineering', 'science'] },
          { text: 'Persuasive', path: ['commerce'] },
          { text: 'Expressive', path: ['arts'] },
          { text: 'Empathetic', path: ['healthcare'] }
        ]
      },
      {
        text: 'Which workshop would you attend?',
        options: [
          { text: '3D Printing', path: ['engineering'] },
          { text: 'Creative Writing', path: ['arts'] },
          { text: 'Stock Market Basics', path: ['commerce'] },
          { text: 'Public Health', path: ['healthcare'] }
        ]
      },
      {
        text: 'How do you resolve conflicts?',
        options: [
          { text: 'Technical solutions', path: ['engineering'] },
          { text: 'Data-driven approach', path: ['science', 'commerce'] },
          { text: 'Creative compromise', path: ['arts'] },
          { text: 'Emotional support', path: ['healthcare'] }
        ]
      }
    ]
  },
  {
    name: 'Career Preferences',
    questions: [
      {
        text: 'Which professional achievement matters most?',
        options: [
          { text: 'Technical patent', path: ['engineering'] },
          { text: 'Scientific discovery', path: ['science'] },
          { text: 'Art exhibition', path: ['arts'] },
          { text: 'Business success', path: ['commerce'] }
        ]
      },
      {
        text: 'Your ideal work environment:',
        options: [
          { text: 'Research facility', path: ['science', 'healthcare'] },
          { text: 'Construction site', path: ['engineering'] },
          { text: 'Art gallery', path: ['arts'] },
          { text: 'Stock exchange', path: ['commerce'] }
        ]
      },
      {
        text: 'Which professional inspires you?',
        options: [
          { text: 'Elon Musk', path: ['engineering'] },
          { text: 'Marie Curie', path: ['science', 'healthcare'] },
          { text: 'JK Rowling', path: ['arts'] },
          { text: 'Warren Buffet', path: ['commerce'] }
        ]
      },
      {
        text: 'Preferred work schedule:',
        options: [
          { text: 'Structured 9-5', path: ['commerce', 'healthcare'] },
          { text: 'Project-based deadlines', path: ['engineering'] },
          { text: 'Flexible creative hours', path: ['arts'] },
          { text: 'Research-intensive periods', path: ['science'] }
        ]
      },
      {
        text: 'Long-term career goal:',
        options: [
          { text: 'Solve technical challenges', path: ['engineering'] },
          { text: 'Advance human knowledge', path: ['science'] },
          { text: 'Creative masterpieces', path: ['arts'] },
          { text: 'Financial leadership', path: ['commerce'] }
        ]
      }
    ]
  }
];

const Playfield = () => {
  const [currentTest, setCurrentTest] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ ...careerPaths });
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per test
  const [testStarted, setTestStarted] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Timer effect
  useEffect(() => {
    if (!testStarted || completed) return;

    if (timeLeft === 0) {
      // Time's up for this test, move to next
      if (currentTest + 1 < tests.length) {
        handleNextTest();
      } else {
        setCompleted(true);
      }
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, testStarted, completed, currentTest]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (selectedPaths) => {
    const newScores = { ...scores };
    selectedPaths.forEach(path => {
      newScores[path].score += 1;
    });
    setScores(newScores);

    if (currentQuestion + 1 < tests[currentTest].questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentTest + 1 < tests.length) {
      handleNextTest();
    } else {
      setCompleted(true);
    }
  };

  const handleNextTest = () => {
    // Save current test results
    const result = {
      testName: tests[currentTest].name,
      scores: { ...scores }
    };
    setTestResults([...testResults, result]);
    
    // Reset for next test
    setCurrentTest(prev => prev + 1);
    setCurrentQuestion(0);
    setTimeLeft(300); // Reset timer to 5 minutes
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const calculateResults = () => {
    const totalQuestions = tests.length * 5;
    return Object.keys(scores).map(path => ({
      name: scores[path].name,
      percentage: ((scores[path].score / totalQuestions) * 100).toFixed(1)
    }));
  };

  const restartTest = () => {
    setCurrentTest(0);
    setCurrentQuestion(0);
    setScores({ ...careerPaths });
    setCompleted(false);
    setTimeLeft(300);
    setTestStarted(false);
    setTestResults([]);
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">Career Aptitude Assessment</h1>
            <p className="text-blue-600 mb-6">
              Discover which tech career path best matches your skills and interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Time Limit</h3>
                  <p className="text-blue-600 text-sm">5 minutes per test section</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">5 Test Sections</h3>
                  <p className="text-purple-600 text-sm">25 questions total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Test Sections</h3>
            <ol className="list-decimal list-inside space-y-2">
              {tests.map((test, index) => (
                <li key={index} className="text-blue-700">
                  {test.name}
                  <span className="text-blue-500 text-sm ml-2">(5 questions)</span>
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {!completed ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-bold text-blue-800">Career Aptitude Test</h2>
                <p className="text-purple-600 text-sm">
                  Section {currentTest + 1} of {tests.length}: {tests[currentTest].name}
                </p>
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">
                Time: {formatTime(timeLeft)}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / tests[currentTest].questions.length) * 100}%` }}
              />
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-purple-700 font-medium">
                Question {currentQuestion + 1} of {tests[currentTest].questions.length}
              </span>
              <span className="text-gray-600 text-sm">
                Section Progress: {currentQuestion + 1}/{tests[currentTest].questions.length}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {tests[currentTest].questions[currentQuestion].text}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {tests[currentTest].questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.path)}
                  className="p-4 text-left rounded-lg border-2 border-purple-100 hover:border-purple-300 
                    hover:bg-purple-50 transition-colors duration-200 text-gray-700"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Assessment Complete!
              </h3>
              <p className="text-blue-600">
                Your career aptitude results are ready
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">Your Career Matches</h4>
              <div className="space-y-4">
                {calculateResults().sort((a, b) => b.percentage - a.percentage).map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg ${index === 0 ? 
                    'bg-purple-100 border-2 border-purple-300' : 'bg-white border border-blue-100'}`}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{result.name}</span>
                      <span className="text-purple-700 font-semibold">{result.percentage}% match</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 rounded-full h-2"
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restartTest}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Retake Assessment
              </button>
              <button className="flex-1 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 font-medium">
                Save Results
              </button>
            </div>
          </div>
        )}

        {!completed && (
          <div className="text-center mt-6 text-gray-600 text-sm">
            Complete all sections to see your full career analysis
          </div>
        )}
      </div>
    </div>
  );
};

export default Playfield;