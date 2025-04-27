import favIcon from "../assets/images/icon-hive-home.png"

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
    return(
        <div className="flex flex-wrap justify-between py-15 w-5xl">
        {/*cards*/}
        {dashboard.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-xl shadow-lg w-60 h-35 flex flex-col items-center justify-center p-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <img src={favIcon} className="w-8 h-7" />
              <span className="text-lg font-semibold text-gray-700 text-center">
                {item.label}
              </span>
            </div>
            <span className="text-4xl font-bold text-gray-800 mt-2">{item.value}</span>
          </div>
        ))}
      </div>
    )
}