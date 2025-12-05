import React, { useState, useEffect } from 'react';
import { ModuleType, QuizQuestion, SimulationState } from '../types';
import { generateSimulationContent } from '../services/geminiService';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight, Loader2, Award } from 'lucide-react';

interface SimulationProps {
  module: ModuleType;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Simulation: React.FC<SimulationProps> = ({ module, onComplete, onExit }) => {
  const [state, setState] = useState<SimulationState>({
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    loading: true,
    completed: false
  });

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadContent = async () => {
      try {
        const questions = await generateSimulationContent(module);
        if (mounted) {
          setState(prev => ({ ...prev, questions, loading: false }));
        }
      } catch (err) {
        console.error(err);
        if (mounted) setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadContent();
    return () => { mounted = false; };
  }, [module]);

  const handleAnswer = (isCorrect: boolean, optionId: string) => {
    if (showFeedback || isProcessing) return;
    
    setSelectedOption(optionId);
    setIsProcessing(true);

    // Animasi "berpikir" atau suspense sebelum feedback muncul
    setTimeout(() => {
      setIsProcessing(false);
      setShowFeedback(true);

      if (isCorrect) {
        setState(prev => ({ ...prev, score: prev.score + 20 })); // 20 pts per question
      }
    }, 800); // Delay 800ms untuk efek visual
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex >= state.questions.length - 1) {
      setState(prev => ({ ...prev, completed: true }));
      // Wait a moment before triggering completion to show final state
      setTimeout(() => onComplete(state.score + (selectedOption && state.questions[state.currentQuestionIndex].options.find(o => o.id === selectedOption)?.isCorrect ? 20 : 0)), 500);
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      setSelectedOption(null);
      setShowFeedback(false);
      setIsProcessing(false);
    }
  };

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-8 text-center space-y-4">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Sedang Loading...</h2>
        <p className="text-slate-500 dark:text-slate-400">AI lagi nyiapin tantangan seru buat kamu!</p>
      </div>
    );
  }

  const currentQ = state.questions[state.currentQuestionIndex];

  if (!currentQ) return <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl shadow"> <p className="text-red-500 mb-4">Gagal memuat pertanyaan.</p> <button onClick={onExit} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">Kembali</button></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-slate-100 dark:border-slate-700 animate-pop">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">{module}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Tantangan {state.currentQuestionIndex + 1} / {state.questions.length}</p>
        </div>
        <div className="flex items-center space-x-2 bg-orange-50 dark:bg-slate-700 px-4 py-2 rounded-full border border-orange-100 dark:border-slate-600">
          <Award className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-slate-700 dark:text-white text-sm">{state.score} XP</span>
        </div>
      </div>

      {/* Scenario / Context */}
      <div className="mb-8 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border-l-8 border-orange-500 relative overflow-hidden transition-all duration-500 hover:shadow-md">
        <div className="absolute -right-6 -top-6 opacity-10">
          <AlertTriangle className="w-24 h-24 text-orange-600" />
        </div>
        <div className="flex items-start space-x-4 relative z-10">
          <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg">
             <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-300 flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Situasi</h3>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{currentQ.scenario}</p>
          </div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">{currentQ.question}</h3>

      {/* Options */}
      <div className="space-y-4">
        {currentQ.options.map((option) => {
          const isSelected = option.id === selectedOption;
          let optionClass = "w-full p-5 rounded-xl border-2 text-left transition-all duration-300 flex items-center justify-between group relative overflow-hidden ";
          
          if (isProcessing) {
             if (isSelected) {
                // State: Dipilih (Sedang "Berpikir") - Membesar & Berdenyut
                optionClass += "border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-105 shadow-xl ring-2 ring-orange-400 z-10 animate-pulse ";
             } else {
                // State: Tidak Dipilih (Blur focus)
                optionClass += "border-slate-100 dark:border-slate-800 opacity-40 blur-[1px] scale-95 ";
             }
          } else if (showFeedback) {
             // State: Feedback Muncul
             if (isSelected) {
                optionClass += option.isCorrect
                   ? "border-green-500 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100 ring-2 ring-green-400 "
                   : "border-red-500 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-100 ring-2 ring-red-400 ";
                // Tambahkan animasi Pop saat hasil muncul
                optionClass += "animate-pop "; 
             } else if (option.isCorrect) {
                // Tampilkan jawaban benar jika user salah
                optionClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 opacity-80 ";
             } else {
                optionClass += "border-slate-100 dark:border-slate-800 text-slate-400 opacity-40 ";
             }
          } else {
             // State: Normal
             optionClass += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-slate-700 shadow-sm hover:scale-[1.02] ";
          }

          return (
            <button
              key={option.id}
              disabled={showFeedback || isProcessing}
              onClick={() => handleAnswer(option.isCorrect, option.id)}
              className={optionClass}
            >
              <span className="font-semibold text-lg">{option.text}</span>
              
              {/* Icon Logic */}
              <div className="flex items-center">
                 {isProcessing && isSelected && (
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                 )}
                 {showFeedback && isSelected && (
                    option.isCorrect 
                    ? <CheckCircle className="w-6 h-6 animate-pop text-green-600 dark:text-green-400" /> 
                    : <XCircle className="w-6 h-6 animate-pop text-red-600 dark:text-red-400" />
                 )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback & Next */}
      {showFeedback && (
        <div className="mt-8 animate-pop">
          <div className={`p-6 rounded-2xl mb-6 shadow-sm border ${
            currentQ.options.find(o => o.id === selectedOption)?.isCorrect 
            ? "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100" 
            : "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100"
          }`}>
            <p className="font-bold text-lg mb-2 flex items-center">
              {currentQ.options.find(o => o.id === selectedOption)?.isCorrect ? "✨ Luar Biasa!" : "🤔 Hmm, kurang tepat..."}
            </p>
            <p className="text-base leading-relaxed opacity-90">{currentQ.explanation}</p>
          </div>
          
          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-xl flex items-center justify-center space-x-2 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <span>{state.currentQuestionIndex >= state.questions.length - 1 ? "🎉 Selesaikan Misi" : "Lanjut Pertanyaan Berikutnya"}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {!showFeedback && !isProcessing && (
         <div className="mt-8 text-center">
            <button onClick={onExit} className="text-slate-400 hover:text-red-500 text-sm font-semibold transition-colors">Batalkan Simulasi</button>
         </div>
      )}
    </div>
  );
};