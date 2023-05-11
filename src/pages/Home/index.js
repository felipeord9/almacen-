import { useContext } from "react";
import Context from "../../context/userContext";
import Card from "../../components/Card";

function Home() {
  const { colaborator, setColaborator } = useContext(Context);

  const handlerClick = (e) => {
    setColaborator(null)
  }

  return (
    <div className="container d-flex flex-column vh-100 w-100 pt-4">
      <div className="d-flex flex-row justify-content-between align-items-center text-light">
        <div>
          <div>Bienvenid@!</div>
          <div className="d-flex">
            <div>{colaborator["NOMBRE"]}</div>
            <div>
              <strong>({colaborator["CARGO"]})</strong>
            </div>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handlerClick}>Salir</button>
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <div className="row gap-3">
          <Card nombre="HACER MOVIMIENTO" redirect="/registro" />
          <Card nombre="VER REGISTROS" redirect="/movimientos" />
          <Card nombre="VER EXISTENCIAS" redirect="/existencias" />
        </div>
      </div>
    </div>
  );
}

export default Home;
