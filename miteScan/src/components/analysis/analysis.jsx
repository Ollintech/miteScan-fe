import { useState } from 'react'
import colmeia1 from '../../assets/images/colmeia1.png'
import colmeia2 from '../../assets/images/colmeia2.jpg'

export default function AnalysisCard() {
    const [selectedHive, setSelectedHive] = useState('colmeia1')

    const hiveImages = {
        colmeia1: colmeia1,
        colmeia2: colmeia2
    }

    return (
        <>
            <div className="flex items-center gap-3 mb-3 mx-auto w-full">
                <label className="font-bold" htmlFor="hive-select">SELECIONE A COLMEIA:</label>
                <select
                    id="hive-select"
                    value={selectedHive}
                    onChange={(e) => setSelectedHive(e.target.value)}
                    className='bg-gray-200 py-2 px-6 rounded-lg'
                >
                    <option value="colmeia1">Colmeia 1</option>
                    <option value="colmeia2">Colmeia 2</option>
                </select>
            </div>

            <div className="bg-gray-100 rounded-xl shadow-2xl">
                <img src={hiveImages[selectedHive]} alt={selectedHive} className="w-full h-80" />
                <button className="rounded-xl shadow-lg bg-yellow-400 my-4 w-1/3 p-3">🔍 Analisar</button>
            </div>
        </>
    )
}