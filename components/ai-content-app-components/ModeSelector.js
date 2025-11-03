import { BookOpen, FileText, RefreshCw } from 'lucide-react';
import React from 'react'

const Modes = [
    {
        id: 'summarise',
        lable: 'Summarise',
        description: "Condense text to key points",
        icon: FileText,
        gradient: 'from-emerald-500 to-teal-600'
    },
    {
        id: 'rephrase',
        lable: 'Rephrase',
        description: "Rewrite with different words",
        icon: RefreshCw ,
        gradient: 'from-blue-500 to-cyan-400'
    },
    {
        id: 'explain_simply',
        lable: 'Explain Simply',
        description: "Use simple language",
        icon: BookOpen,
        gradient: 'from-orange-500 to-amber-400'
    },
]

const ModeSelector = ({ selectedMode, onSelectMode }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {
                Modes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id

                    return (
                        <button
                            key={mode.id}
                            onClick={()=>(onSelectMode(mode.id))}
                            className={`group relative p-6 rounded-xl transition-all duration-300 overflow-hidden ${isSelected ? 'scale-100 shadow-xl':'hover:scale-105 hover:shadow-lg'}`}
                            
                        >
                            {/* Bacckground gradien */}
                            <div 
                            className={`absolute inset-0 bg-linear-to-br group-hover:opacity-10 transition-all ${mode.gradient}
                             opacity-${isSelected ? '100':'0'} transition-all group-hover:opacity-10`}
                            ></div>
                            {/* Border and backgroun */}
                            <div className={`absolute inset-0 border-2 rounded-xl ${isSelected ? `border-transparent bg-gradient-to-br
                             ${mode.gradient}`: 'border-gray-700 bg-gray-800'}`}
                            ></div>
                            {/* Contene */}
                            <div className='relative z-10 flex flex-col items-center text-center gap-3'>
                                {/* icon */}
                                <div className={`p-3 rounded-lg ${isSelected ? 'bg-white/20' : 'text-gray-600'} transition-all`}>
                                {/* {mode.icon} */}
                                <Icon />
                                </div>
                                {/* Lable and description */}
                                <div>
                                    <div className={`font-bold text-lg ${isSelected ? 'text-white':'text-gray-100'}`}>
                                        {mode.lable}
                                    </div>
                                    <div className={`text-sm mt-1 ${isSelected ? 'text-white':'text-gray-100'}`}>{mode.description}</div>
                                </div>
                            </div>
                        </button>
                    )
                })
            }

        </div>
    )
}

export default ModeSelector
