import { useEffect, useState } from 'react';
import colmeia1 from '../../assets/images/colmeia1.png';
import colmeia2 from '../../assets/images/colmeia2.jpg';
import { useNavigate } from 'react-router-dom';

export default function AnalysisCard() {
  const [hives, setHives] = useState([]);
  const [selectedHiveId, setSelectedHiveId] = useState('');

  const navigate = useNavigate();

  const hiveImages = {
    1: colmeia1,
    2: colmeia2
  };

  useEffect(() => {
    // Mock de colmeias (simulando dados do back-end)
    const mockHives = [
      { id: 1, nome: 'Colmeia 1' },
      { id: 2, nome: 'Colmeia 2' },
    ];
    setHives(mockHives);
    setSelectedHiveId(mockHives[0].id); // Define a primeira como padrão

    // conectar o back:
    /*
    fetch('url-back')
      .then(res => res.json())
      .then(data => {
        setHives(data);
        setSelectedHiveId(data[0]?.id || '');
      })
      .catch(err => console.error('Erro ao buscar colmeias:', err));
    */
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 mb-3 mx-auto w-full">
        <label className="font-bold" htmlFor="hive-select">SELECIONE A COLMEIA:</label>
        <select
          id="hive-select"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(Number(e.target.value))}
          className='bg-gray-200 py-1 px-6 rounded-lg'
        >
          {hives.map(hive => (
            <option key={hive.id} value={hive.id}>
              {hive.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 rounded-2xl shadow-2xl">
        <img
          src={hiveImages[selectedHiveId]}
          alt={`Colmeia ${selectedHiveId}`}
          className="w-full h-75 object-cover rounded-xl"
        />
        <button
          className="rounded-xl shadow-lg bg-yellow-400 hover:bg-yellow-300 font-bold my-4 w-1/3 p-2"
          onClick={() => navigate('/result-analysis')}
        >
          🔍 Analisar
        </button>
      </div>
    </>
  );
}
