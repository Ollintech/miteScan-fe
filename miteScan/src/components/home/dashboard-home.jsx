import favIcon from "../../assets/images/icon-hive-home.png"

const dashboard = [
  {
    id: 1,
    label: 'COLMEIAS',
    value: 5,
  },
  {
    id: 2,
    label: 'TAXA DE VARROA',
    value: '40%',
  },
  {
    id: 3,
    label: 'COLMEIAS + VARROA',
    value: 2,
  },
];

export default function InfoHome() {
  return (
<div className="flex flex-wrap justify-center gap-8 py-6 w-full">
  {dashboard.map((item) => (
    <div
      key={item.id}
      className="bg-gray-100 rounded-xl shadow-lg w-full sm:w-1/2 md:w-[30%]
       h-32 flex flex-col items-center justify-center"
    >
      <div className="flex items-center gap-2 mb-1">
        <img src={favIcon} className="w-7 h-6" />
        <span className="text-md font-semibold text-gray-700 text-center">
          {item.label}
        </span>
      </div>
      <span className="text-4xl font-bold text-gray-800 mt-2">{item.value}</span>
    </div>
  ))}
</div>

  )
}