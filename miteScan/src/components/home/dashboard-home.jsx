import { useEffect, useState } from "react";
import { MdHexagon } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InfoHome() {
  const [dashboard, setDashboard] = useState([
    { id: 1, label: "COLMEIAS", value: 0 },
    { id: 2, label: "TAXA DE VARROA", value: "0%" },
    { id: 3, label: "COLMEIAS + VARROA", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          setError("Sessão inválida. Faça login novamente.");
          setLoading(false);
          navigate('/login');
          return;
        }
        
        let account;
        try {
          const userObj = JSON.parse(userString);
          account = userObj?.account || localStorage.getItem('account');
        } catch (e) {
          console.error("Erro ao parsear dados do usuário:", e);
          setError("Erro ao ler sessão. Faça login novamente.");
          setLoading(false);
          navigate('/login');
          return;
        }

        if (!account) {
          console.error("Erro: account não encontrado.");
          setError("Account não encontrado. Faça login novamente.");
          setLoading(false);
          navigate('/login');
          return;
        }
        
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        // 1. Busca as colmeias e todas as análises em paralelo (muito mais rápido)
        const [hivesResponse, analysesResponse] = await Promise.all([
          axios.get(`${base}/${account}/hives/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${base}/hive_analyses/all`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { account },
          }).catch(() => ({ data: [] }))
        ]);

        const hives = hivesResponse.data || [];
        const analyses = analysesResponse.data || [];

        // 2. Mapeia a análise mais recente de cada colmeia em memória
        const latestAnalysisMap = new Map();
        analyses.forEach((analysis) => {
          if (!latestAnalysisMap.has(analysis.hive_id)) {
            latestAnalysisMap.set(analysis.hive_id, analysis);
          }
        });

        const hivesWithAnalysis = hives.map((hive) => ({
          ...hive,
          analysis: latestAnalysisMap.get(hive.id) || null,
        }));

        // 3. Calcula os dados do dashboard
        const total = hivesWithAnalysis.length;
        const comVarroa = hivesWithAnalysis.filter(
          (h) => h.analysis?.varroa_detected === true
        ).length;

        const taxaVarroa = total > 0 ? `${((comVarroa / total) * 100).toFixed(0)}%` : "0%";

        setDashboard([
          { id: 1, label: "COLMEIAS", value: total },
          { id: 2, label: "TAXA DE VARROA", value: taxaVarroa },
          { id: 3, label: "COLMEIAS + VARROA", value: comVarroa },
        ]);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error.message);
        
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            setError("Sessão expirada. Faça login novamente.");
            navigate('/login');
          } else if (error.response.status === 404) {
            setError("Nenhuma colmeia encontrada.");
            setDashboard([
              { id: 1, label: "COLMEIAS", value: 0 },
              { id: 2, label: "TAXA DE VARROA", value: "0%" },
              { id: 3, label: "COLMEIAS + VARROA", value: 0 },
            ]);
          } else {
            setError("Erro ao carregar dados do dashboard.");
          }
        } else {
            setError("Erro de rede. Verifique sua conexão.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="flex flex-wrap justify-center gap-8 py-6 w-full">
      {loading ? (
        <div className="text-center py-8">
          <div className="text-lg font-semibold text-gray-600">Carregando dados...</div>
        </div>
      ) : (
        dashboard.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-xl shadow-lg w-full sm:w-1/2 md:w-[30%] h-32 flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-1 mb-1">
              <MdHexagon size={23} className="text-yellow-400" />
              <span className="text-md font-semibold text-gray-700 text-center">
                {item.label}
              </span>
            </div>
            <span className="text-4xl font-bold text-gray-800 mt-2">{item.value}</span>
          </div>
        ))
      )}
    </div>
  );
}