import { useEffect, useState } from "react";
import favIcon from "../../assets/images/icon-hive-home.png";
import { MdHexagon } from "react-icons/md";

export default function InfoHome() {
  const [dashboard, setDashboard] = useState([
    { id: 1, label: "COLMEIAS", value: 0 },
    { id: 2, label: "TAXA DE VARROA", value: "0%" },
    { id: 3, label: "COLMEIAS + VARROA", value: 0 },
  ]);

  useEffect(() => {
    // 🐝 MOCKADOS — os mesmos do componente HomeHives
    const mockData = [
      { id: 1, temperature: 23, humidity: 42, latest_analysis: { varroa_detected: false } },
      { id: 2, temperature: 30, humidity: 20, latest_analysis: { varroa_detected: false } },
      { id: 3, temperature: 23, humidity: 42, latest_analysis: { varroa_detected: false } },
      { id: 4, temperature: 40, humidity: 10, latest_analysis: { varroa_detected: true } },
      { id: 5, temperature: 23, humidity: 42, latest_analysis: { varroa_detected: true } },
    ];

    const total = mockData.length;
    const comVarroa = mockData.filter(h => h.latest_analysis?.varroa_detected).length;
    const taxaVarroa = total > 0 ? `${((comVarroa / total) * 100).toFixed(0)}%` : "0%";

    setDashboard([
      { id: 1, label: "COLMEIAS", value: total },
      { id: 2, label: "TAXA DE VARROA", value: taxaVarroa },
      { id: 3, label: "COLMEIAS + VARROA", value: comVarroa },
    ]);

    // Quando for usar dados reais:
    /*
    fetch("/api/hives")
      .then((res) => res.json())
      .then((data) => {
        const total = data.length;
        const comVarroa = data.filter(h => h.latest_analysis?.varroa_detected).length;
        const taxaVarroa = total > 0 ? `${((comVarroa / total) * 100).toFixed(0)}%` : "0%";

        setDashboard([
          { id: 1, label: "COLMEIAS", value: total },
          { id: 2, label: "TAXA DE VARROA", value: taxaVarroa },
          { id: 3, label: "COLMEIAS + VARROA", value: comVarroa },
        ]);
      });
    */
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
