import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Context from "../../context/cellarContext";
import { config } from '../../config'
import Card from "../../components/Card";

function Modules() {
  const { getCellar } = useContext(Context)
  const query = new URLSearchParams(useLocation().search)
  
  useEffect(() => {
    fetch(`${config.apiUrl}/cellars/${query.get('bodega')}`)
      .then(res => res.json())
      .then(res => getCellar(res.data))
  }, [])

  return (
    <div className="container d-flex flex-column vh-100 w-100 pt-4">
      <div className="d-flex flex-row justify-content-between align-items-center text-light">
        <button className="btn btn-secondary" onClick={(e) => window.history.back()}>
          volver atras
        </button>
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <div className="row gap-3">
          <Card nombre="Hacer Movimiento" redirect="/registro" />
          <Card nombre="Ver Movimientos" redirect="/movimientos" />
          <Card nombre="Ver Existencias" redirect="/existencias" />
        </div>
      </div>
    </div>
  );
}

export default Modules;
