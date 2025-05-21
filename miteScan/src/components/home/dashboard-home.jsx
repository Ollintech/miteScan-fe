import { useEffect, useState } from "react";
import { MdHexagon } from "react-icons/md";
import axios from "axios";

export default function InfoHome() {
  const [dashboard, setDashboard] = useState([
    { id: 1, label: "COLMEIAS", value: 0 },
    { id: 2, label: "TAXA DE VARROA", value: "0%" },
    { id: 3, label: "COLMEIAS + VARROA", value: 0 },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const hivesResponse = await axios.get("http://localhost:8000/hives/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hives = hivesResponse.data;

        const hivesWithAnalysis = await Promise.all(
          hives.map(async (hive) => {
            try {
              const analysisResponse = await axios.get(
                `http://localhost:8000/hive_analyses/hive/${hive.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return { ...hive, analysis: analysisResponse.data };
            } catch (err) {
              console.warn(`Colmeia ${hive.id} sem análise.`);
              return { ...hive, analysis: null };
            }
          })
        );

        console.log("🔍 Análises recebidas:", hivesWithAnalysis.map(h => ({
          id: h.id,
          varroa: h.analysis?.varroa_detected,
        })));

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
        console.error("❌ Erro ao carregar dados do dashboard:", error);
        setDashboard([
          { id: 1, label: "COLMEIAS", value: 0 },
          { id: 2, label: "TAXA DE VARROA", value: "0%" },
          { id: 3, label: "COLMEIAS + VARROA", value: 0 },
        ]);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-8 py-6 w-full">
      {dashboard.map((item) => (
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
      ))}
    </div>
  );
}
