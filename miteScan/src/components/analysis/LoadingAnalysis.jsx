import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import BackgroundImage from '../../assets/images/LoadingBackground.png';

export default function LoadingAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hiveAnalysisId } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/result-analysis', { state: { hiveAnalysisId } });
    }, 3000); // aguarda 3 segundos
    return () => clearTimeout(timer);
  }, [navigate, hiveAnalysisId]);

  return (
    <div
      className="relative flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay escurecendo o fundo */}
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      {/* Conteúdo acima do overlay */}
      <div className="z-10 flex flex-col items-center justify-center text-center bg-white bg-opacity-80 p-6 rounded-xl shadow-lg">
        
        {/* Logo do topo */}
        <img src={Logo} alt="Logo" className="w-2/5 mb-4" />  {/* Ajuste o tamanho com w-1/5, ou 1/4, 1/6, conforme necessário */}

        <div className="text-xl font-bold text-gray-700 mb-4">
          Analisando Colmeia, aguarde...
        </div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-opacity-50"></div>
      </div>
    </div>
  );
}
