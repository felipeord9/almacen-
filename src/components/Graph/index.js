import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Graph({ capMax, capOcup }) {
  const data = {
    labels: ["Cap. Ocupada", "Cap. Libre"],
    datasets: [
      {
        data: [capOcup, capMax - capOcup],
        backgroundColor: ["#d34240", "#5dc460"],
        hoverBackgroundColor: ["#FF6294", "#36A2EB"],
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    width: 10,
    height: 10
  }

  /* const options = {
    maintainAspectRatio: true,
    responsive: false,
    width: 20, // Ancho deseado del gráfico en píxeles
    height: 50, // Alto deseado del gráfico en píxeles
  } */

  return (
    <div className="h-100 pt-2">
        <Doughnut data={data} options={options}/>
        <p className="text-end m-0">Ocupacion: {((capOcup / capMax) * 100).toFixed(2)}%</p>
    </div>
  )
}

export default Graph;
