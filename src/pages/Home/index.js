import { useContext, useState, useEffect } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel-3";
import { useNavigate } from "react-router-dom";
import sweal from "sweetalert";
import Context from "../../context/userContext";
import Card from "../../components/Card";
import Graph from "../../components/Graph";
import { config } from "../../config";
import LogoExcel from "../../assets/logo-xls.png";

function Home() {
  const { colaborator, setColaborator } = useContext(Context);
  const [cellers, setCellers] = useState([]);
  const [infoTable, setInfoTable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `${config.apiUrl}/cellars`;

    fetch(`${url}/total`)
      .then((res) => res.json())
      .then((res) => {
        setCellers(res.data);
      });

    fetch(`${url}/existence`)
      .then((res) => res.json())
      .then((res) => {
        setInfoTable(res.data);
      });
  }, []);

  const handlerClick = (e) => {
    setColaborator(null);
  };

  return (
    <div className="container d-flex flex-column h-100 w-100 pt-4 pb-4">
      <div className="d-flex flex-row justify-content-between align-items-center text-light">
        <div>
          <div>Bienvenid@!</div>
          <div className="d-flex">
            <div>{colaborator.nombre}</div>
            <div>
              <strong>({colaborator.cargo})</strong>
            </div>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handlerClick}>
          Salir
        </button>
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {cellers
            ? cellers.map((elemt, index) => (
                <div className="">
                  <div className="d-flex flex-column justify-content-evenly">
                    <Graph
                      capMax={elemt.warehouseCapacity}
                      capOcup={elemt.total}
                    />

                    <Card
                      nombre={elemt.nombre}
                      redirect={``}
                      onClick={(e) => {
                        sweal({
                          text: "Ingrese la contraseña de la bodega",
                          content: "input",
                          button: {
                            text: "Ingresar",
                            closeModal: false,
                          },
                        }).then((password) => {
                          if (password !== cellers[index].password)
                            return sweal({
                              text: "Contrasena Incorrecta",
                              icon: "error",
                              button: "OK",
                              dangerMode: true,
                            });

                          navigate(`/modulos/?bodega=${elemt.id}`);
                          sweal.close();
                        });
                      }}
                    />
                  </div>
                </div>
              ))
            : null}
          <div className="d-flex align-items-end justify-content-center">
            <ReactHTMLTableToExcel
              id="movements-xls-button"
              className="d-flex flex-row align-items-center btn btn-success p-2 w-100 gap-2"
              table="table-existence"
              filename="Existencia-Bodegas"
              filetype="xls"
              sheet="existencias"
              format="xls"
            >
              <img src={LogoExcel} className="img-download" alt="" />
              <strong>Descargar Existencias de Bodegas</strong>
            </ReactHTMLTableToExcel>
          </div>
        </div>
      </div>
      <table
        id="table-existence"
        className="d-none"
        style={{ fontSize: 11 }}
      >
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Description</th>
            <th>Existencia</th>
            <th>U.M.</th>
          </tr>
        </thead>
        <tbody>
          {
            infoTable.map(item => (
              <tr>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.total}</td>
                <td>{item.um}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Home;
