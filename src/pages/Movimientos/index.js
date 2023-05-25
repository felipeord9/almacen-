import { useState, useEffect, useContext } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel-3";
import sweal from "sweetalert";
import TableMovements from "../../components/TableMovements";
import Context from "../../context/cellarContext";
import LogoExcel from "../../assets/logo-xls.png";
import "./styles.css";

function Movimientos() {
  const { cellar } = useContext(Context);
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState({});
  const [filterMovements, setFilterMovements] = useState([]);
  
  useEffect(() => {
    setFilterMovements(cellar.movements);
  }, [cellar.movements]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const filMov = cellar.movements.filter(
      (elem) => parseInt(search) === elem.product.id && !elem.deleted
    );

    if (filMov.length > 0) {
      const amountEntradas = filMov
        .filter((elem) => elem.movementType === "entrada")
        .reduce((a, b) => a + b.amount, 0);
      const amountSalidas = filMov
        .filter((elem) => elem.movementType === "salida")
        .reduce((a, b) => a + b.amount, 0);
      setAmount({
        amountEntradas,
        amountSalidas,
      });
      setFilterMovements(filMov);
    } else {
      sweal({
        text: "No se encontraron entradas ni salidas del producto",
        icon: "warning",
        timer: 3000
      })
      setFilterMovements(cellar.movements);
      setAmount({});
      setSearch("");
    }
  };

  return (
    <div className="container pt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={(e) => window.history.back()}
      >
        {"volver atras"}
      </button>

      <form class="d-flex" role="search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Ingrese la referencia del producto"
          aria-label="Search"
          value={search}
          onChange={handleChange}
        />
        <button
          class="btn btn-outline-success"
          type="submit"
          onClick={handleClick}
        >
          Buscar
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-end">
        <ReactHTMLTableToExcel
          id="movements-xls-button"
          className="d-flex flex-row align-items-center btn btn-success mt-2 mb-2 p-2"
          table="table-downloaded"
          filename="Movimientos"
          filetype="xls"
          sheet="movimientos"
          format="xls"
        >
          <img src={LogoExcel} className="img-download" alt="" />
          <strong>Descargar</strong>
        </ReactHTMLTableToExcel>
      </div>

      <div className="table-responsive">
        <table
          id="table-movements"
          className="table table-dark table-bordered text-center"
          style={{ fontSize: 11 }}
        >
          <thead>
            <tr>
              <th>ENTRADAS</th>
              <th>SALIDAS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0">
                <TableMovements
                  filterMovements={filterMovements}
                  option="entrada"
                />
              </td>
              <td className="p-0">
                <TableMovements
                  filterMovements={filterMovements}
                  option="salida"
                />
              </td>
            </tr>
            {Object.entries(amount).length > 0 ? (
              <>
                <tr>
                  <td>{amount.amountEntradas}</td>
                  <td>{amount.amountSalidas}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>DIFERENCIA: </strong>
                    {amount.amountEntradas - amount.amountSalidas}
                  </td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
        <table
          id="table-downloaded"
          className="d-none table table-dark table-bordered text-center"
          style={{ fontSize: 11 }}
        >
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Descripcion</th>
              <th>U.M</th>
              <th>Cantidad</th>
              <th>Colaborador</th>
              <th>Movimiento</th>
              <th>Bandera</th>
              <th>Fecha Creacion</th>
              <th>Estado</th>
              <th>Eliminado Por</th>
              <th>Fecha Eliminacion</th>
              <th>Motivo de Eliminacion</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filterMovements).length > 0
              ? filterMovements.map((elem) => (
                  <tr>
                    <td>{elem.product.id}</td>
                    <td>{elem.product.description}</td>
                    <td>{elem.product.um}</td>
                    <td>{elem.amount}</td>
                    <td>{elem.colaborator.nombre}</td>
                    <td>{elem.movementType}</td>
                    <td>{elem.flag}</td>
                    <td>{new Date(elem.createdAt).toLocaleString("en-US")}</td>
                    <td>{elem.deleted ? "ELIMINADO" : "ACTIVO"}</td>
                    <td>{elem.deletedBy}</td>
                    <td>{elem.deletedAt ? new Date(elem.deletedAt).toLocaleString("en-US") : ""}</td>
                    <td>{elem.removalReason}</td>
                  </tr>
                ))
              : null}
            {filterMovements.amount ? (
              <>
                <tr>
                  <td colSpan={2}>{filterMovements.amount.amountEntradas}</td>
                  <td colSpan={2}>{filterMovements.amount.amountSalidas}</td>
                  <td colSpan={3}>
                    <strong>DIFERENCIA: </strong>
                    {filterMovements.amount.amountEntradas -
                      filterMovements.amount.amountSalidas}
                  </td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;
