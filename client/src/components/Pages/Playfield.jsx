import React, { useState } from 'react';

const careerPaths = {
  engineering: { name: 'Engineering', score: 0 },
  science: { name: 'Pure Sciences', score: 0 },
  arts: { name: 'Liberal Arts', score: 0 },
  commerce: { name: 'Commerce', score: 0 },
  healthcare: { name: 'Healthcare', score: 0 }
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

  const handleAnswer = (selectedPaths) => {
    const newScores = { ...scores };
    selectedPaths.forEach(path => {
      newScores[path].score += 1;
    });
    setScores(newScores);

    if (currentQuestion + 1 < tests[currentTest].questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentTest + 1 < tests.length) {
      setCurrentTest(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      setCompleted(true);
    }
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
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          Career Aptitude Test
        </h2>

        {!completed ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between mb-6">
              <span className="text-purple-700 font-medium">
                Test {currentTest + 1} of {tests.length}
              </span>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of 5
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">
              Your Career Analysis
            </h3>

            <div className="space-y-4 mb-8">
              {calculateResults().sort((a, b) => b.percentage - a.percentage).map((result, index) => (
                <div key={index} className={`p-4 rounded-lg ${index === 0 ? 
                  'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{result.name}</span>
                    <span className="text-purple-700 font-semibold">{result.percentage}%</span>
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

            <button
              onClick={restartTest}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white 
                rounded-lg transition-colors duration-200 font-medium"
            >
              Take Test Again
            </button>
          </div>
        )}

        <div className="text-center mt-6 text-gray-600 text-sm">
          Career guidance test developed by career experts
        </div>
      </div>
    </div>
  );
};

export default Playfield;