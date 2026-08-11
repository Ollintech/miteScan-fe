import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import { MdHexagon } from 'react-icons/md';

export default function LoadingAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hiveAnalysisId } = location.state || {};

  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    "Carregando foto da colmeia...",
    "Identificando presença de Varroa...",
    "Verificando umidade e temperatura...",
    "Finalizando laudo da colmeia..."
  ];

  useEffect(() => {
    if (!hiveAnalysisId) {
      navigate('/analysis');
      return;
    }

    const intervalTime = 50;
    const totalSteps = 3000 / intervalTime;
    let stepCount = 0;

    const progressInterval = setInterval(() => {
      stepCount++;
      const currentProgress = Math.min(Math.round((stepCount / totalSteps) * 100), 100);
      setProgress(currentProgress);

      const stepIdx = Math.min(
        Math.floor((currentProgress / 100) * steps.length),
        steps.length - 1
      );
      setCurrentStepIndex(stepIdx);

      if (stepCount >= totalSteps) {
        clearInterval(progressInterval);
      }
    }, intervalTime);

    const timer = setTimeout(() => {
      navigate('/result-analysis', { state: { hiveAnalysisId } });
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigate, hiveAnalysisId]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen px-4 bg-slate-50 select-none">
      {/* Soft Decorative Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
        
        {/* Logo Container */}
        <div className="mb-6 flex items-center justify-center">
          <img src={Logo} alt="miteScan Logo" className="w-28 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Analisando Colmeia
        </h2>
        
        {/* Step Indicator */}
        <p className="text-sm font-medium text-gray-500 h-8 flex items-center justify-center">
          {steps[currentStepIndex]}
        </p>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-1.5 px-1">
            <span>Progresso</span>
            <span className="text-amber-600 font-bold">{progress}%</span>
          </div>
          
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/60">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 rounded-full transition-all duration-100 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}



