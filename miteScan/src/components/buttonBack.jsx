import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ButtonBack({ title, redirect }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 text-2xl font-bold uppercase">
        <button
          className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
          onClick={() => navigate(redirect)}
        >
          <FaArrowLeft size={25} />
        </button>
        {title}
      </div>
    </div>
  );
}
