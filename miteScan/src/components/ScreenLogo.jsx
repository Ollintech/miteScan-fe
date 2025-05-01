import Logo from '../assets/images/logo.png'

export default function LogoScreen({ showText = false }) {
    return (
        <div className="w-full space-y-30 flex flex-col items-center">
            <img src={Logo} alt="Logo" className="w-1/5" />
            {showText && <h2 className="mt-4 text-gray-600 text-xl">Aguarde, análise sendo feita...</h2>}
        </div>
    );
}