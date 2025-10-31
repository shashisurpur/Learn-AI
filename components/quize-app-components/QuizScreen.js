import React, { useState } from 'react'
import QuestionCard from './QuestionCard';
import ReactConfetti from 'react-confetti';
// import { questions } from '@/data/questions';

const QuizScreen = ({ questions, quizData, goBackToMain, }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState([]);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [checkedAns, setCheckedAns] = useState(null)

    const handleChange = (e) => {
        setCheckedAns(e.target.value);
    }

    console.log(selectedAnswer, 'selecte')
    const handleAnswer = (option) => {
        // if (showFeedback) return;

        // setSelectedAnswer(option);

        setSelectedAnswer((prev) => [...prev, option])
        // setShowFeedback(true);

        if (option === quizData.questions[currentQuestion].correct_answer) {
            setScore(score + 1);
        }
    };

    const goToNext = () => {
        if (currentQuestion + 1 <= quizData.questions.length) {
            if (currentQuestion + 1 === quizData.questions.length) {
                setSelectedAnswer((prev) => [...prev, checkedAns])
                console.log(checkedAns === quizData.questions[currentQuestion].correct_answer, currentQuestion, quizData.questions.length, 'checkedans')
                if (checkedAns === quizData.questions[currentQuestion].correct_answer) {
                    setScore(score + 1);
                }
                setCheckedAns(null)
                setShowFeedback(false);
                setIsFinished(true);

            } else {
                setCurrentQuestion(currentQuestion + 1);
                // setSelectedAnswer(null);
                setSelectedAnswer((prev) => [...prev, checkedAns])
                console.log(checkedAns === quizData.questions[currentQuestion].correct_answer, currentQuestion, quizData.questions.length, 'checkedans')
                if (checkedAns === quizData.questions[currentQuestion].correct_answer) {
                    setScore(score + 1);
                }
                setCheckedAns(null)
                setShowFeedback(false);
            }

        } else {
            setIsFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer([]);
        setShowFeedback(false);
        setIsFinished(false);
    };

    const calculateProgress = () => {
        if (isFinished) return 100;
        const baseProgress = (currentQuestion / quizData.questions.length) * 100;
        // const questionProgress = selectedAnswer.length > 0 ? (1 / questions.length) * 100 : 0;
        // return baseProgress + questionProgress;
        return baseProgress
    };

    const percentage = (score / quizData.questions.length) * 100;
      const showConfetti = isFinished && percentage > 50;

    return (
        <div className="min-h-screen p-4 overflow-auto mt-6">
            {showConfetti && <ReactConfetti />}
            {/* <div className='w-[80%]'>
                <div className='flex'>
                    <button className='p-2 bg-black text-[16px] rounded-lg'>Back</button>

                </div>
            </div> */}
            <div className='flex flex-row items-center justify-between'>
                <div className='flex'>
                    {/* <button className='p-4 bg-black text-[16px] rounded-lg'
                        onClick={goBackToMain}
                    >
                        Back
                    </button> */}
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-purple-600 mb-2">
                        {quizData.quiz_topic}
                    </h1>
                    <p className="text-gray-400">Test your knowledge</p>
                </div>
                <div></div>
            </div>
            {/* <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-purple-600 mb-2">
                    {quizData.quiz_topic}
                </h1>
                <p className="text-gray-400">Test your knowledge</p>
            </div> */}
            <div className='flex flex-col items-center justify-center'>
                <div className="w-full max-w-xl mb-6 ">
                    <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 duration-500 ease-out transition-all"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {!isFinished ? (
                <>
                    <div className='flex flex-col items-center justify-center' >
                        <QuestionCard
                            showFeedback={showFeedback}
                            setShowFeedback={setShowFeedback}
                            checkedAns={checkedAns}
                            handleChange={handleChange}
                            onAnswer={handleAnswer}
                            data={quizData.questions[currentQuestion]}
                            current={currentQuestion}
                            total={quizData.questions.length}
                            selected={selectedAnswer}
                        />
                    </div>
                    {showFeedback && (
                        <div className='flex flex-col items-center justify-center' >
                            <div className="mt-6 min-h-[60px]">
                                <button
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-lg cursor-pointer"
                                    onClick={goToNext}
                                >
                                    {currentQuestion + 1 < quizData.questions.length
                                        ? "Continue"
                                        : "See Results"}
                                </button>
                            </div>
                        </div>
                    )}

                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                    <p className="text-xl mb-6">
                        You scored <span>{score}</span> out of{" "}
                        <span className="font-bold">{quizData.questions.length}</span> and it is{" "}
                        {Math.round((score / quizData.questions.length) * 100)}%
                    </p>
                    <button
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-lg cursor-pointer"
                        onClick={restartQuiz}
                    >
                        Restart Quiz
                    </button>
                </div>
            )}

        </div>
    );
}

export default QuizScreen
