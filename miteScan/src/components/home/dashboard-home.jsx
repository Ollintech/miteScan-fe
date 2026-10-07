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
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          if (isMounted) navigate('/login');
          return;
        }
        
        let account;
        try {
          const userObj = JSON.parse(userString);
          account = userObj?.account || localStorage.getItem('account');
        } catch {
          if (isMounted) navigate('/login');
          return;
        }

        if (!account) {
          if (isMounted) navigate('/login');
          return;
        }
        
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        // Requisições paralelas com timeout estrito para responder instantaneamente
        const [hivesRes, analysesRes] = await Promise.all([
          axios.get(`${base}/${account}/hives/all`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }).catch(() => ({ data: [] })),
          axios.get(`${base}/hive_analyses/all`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { account },
            timeout: 5000
          }).catch(() => ({ data: [] }))
        ]);

        if (!isMounted) return;

        const hives = hivesRes.data || [];
        const analyses = analysesRes.data || [];

        // Mapeamento rápido em memória usando Map
        const latestAnalysisMap = new Map();
        analyses.forEach((analysis) => {
          if (!latestAnalysisMap.has(analysis.hive_id)) {
            latestAnalysisMap.set(analysis.hive_id, analysis);
          }
        });

        let comVarroa = 0;
        hives.forEach((hive) => {
          const analysis = latestAnalysisMap.get(hive.id);
          if (analysis?.varroa_detected === true) {
            comVarroa++;
          }
        });

        const total = hives.length;
        const taxaVarroa = total > 0 ? `${((comVarroa / total) * 100).toFixed(0)}%` : "0%";

        setDashboard([
          { id: 1, label: "COLMEIAS", value: total },
          { id: 2, label: "TAXA DE VARROA", value: taxaVarroa },
          { id: 3, label: "COLMEIAS + VARROA", value: comVarroa },
        ]);
      } catch (error) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          if (isMounted) navigate('/login');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
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