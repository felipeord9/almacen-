import { useContext, useState, useEffect } from "react";
import sweal from "sweetalert";
import Context from "../../context/userContext";
import Card from "../../components/Card";
import Graph from "../../components/Graph";
import { config } from "../../config";
import { useNavigate } from "react-router-dom";
import LogoLangostino from "../../assets/logo-gran-langostino.png";

function Home() {
  const { colaborator, setColaborator } = useContext(Context);
  const [cellers, setCellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `${config.apiUrl}/cellars/total`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setCellers(res.data);
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
          {/* <div >
            <div className="d-flex align-items-center">
              <img className="" src={LogoLangostino} alt="#" />
            </div>
          </div> */}
          {/*           <Card nombre="BODEGA 2" redirect="/modulos/?bodega=2" />
          <Card nombre="BODEGA 3" redirect="/modulos/?bodega=3" />
          <Card nombre="BODEGA 4" redirect="/modulos/?bodega=4" /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
