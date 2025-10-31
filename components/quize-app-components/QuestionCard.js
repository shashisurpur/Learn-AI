import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";


const QuestionCard = ({
    data,
    onAnswer,
    showFeedback,
    setShowFeedback,
    selected,
    current,
    total,
    checkedAns,
    handleChange
}) => {
    const { question, options, answer } = data;


    const getButtonStyle = (option) => {
        if (!showFeedback) {
            return "bg-indigo-700 hover:bg-indigo-600 hover:scale-[1.01]";
        }
        if (option === answer) return "bg-emerald-600";
        if (option === selected) return "bg-rose-600";
        return "bg-gray-600";
    };

    useEffect(() => {
        checkedAns && setShowFeedback(true)
    }, [checkedAns, selected])

    useEffect(() => {
        // console.log("Message content:", content);
        Prism.highlightAll();
    }, [question]);

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                    Question {current + 1} of {total}
                </h2>
                <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                    {/* {selected.length > 1
                        ? Math.round(((current + 1) / total) * 100) + "% complete"
                        : Math.round((current / total) * 100) + "% complete"} */}
                    {Math.round((current / total) * 100) + "% complete"}
                </span>
            </div>
            {/* <p className="text-xl font-medium mb-6"> */}
                <Markdown>{question}</Markdown>
            {/* </p> */}
            <div className="grid gap-3 mt-4">

                <div className="flex flex-col space-y-2">
                    {
                        options.map((option, index) => (
                            <label className="flex items-center space-x-2
                            bg-indigo-700 hover:bg-indigo-600 hover:scale-[1.01] p-2 rounded-lg
                            " key={index}>
                                <input
                                    type="radio"
                                    name="example"
                                    value={option}
                                    checked={checkedAns === option}
                                    onChange={handleChange}
                                    className="text-blue-600 focus:ring-blue-500 "
                                />
                                <span>{option}</span>
                            </label>
                        ))
                    }
                </div>
                {/* {options.map((option, index) => (
          <button
            className={`${getButtonStyle(
              option
            )} text-left px-4 py-3 cursor-pointer rounded-lg text-white `}
            key={index}
            onClick={() => onAnswer(option)}
            disabled={showFeedback}
          >
            {option}
          </button>
        ))} */}
            </div>
        </div>
    );
};

export default QuestionCard;