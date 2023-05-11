import { useState, useEffect } from "react";
import TableMovements from "../../components/TableMovements";
import ReactHTMLTableToExcel from "react-html-table-to-excel-3";
import LogoExcel from "../../assets/logo-xls.png";
import { config } from "../../config";
import "./styles.css";

function Movimientos() {
  const [search, setSearch] = useState("");
  const [movements, setMovements] = useState({});
  const [filterMovements, setFilterMovements] = useState(movements);

  useEffect(() => {
    const url = `${config.apiUrl}/movimientos`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setMovements(res.data);
        setFilterMovements(res.data);
      });
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleClick = (e) => {
    e.preventDefault()
    const entradas = movements.entradas.filter(
      (elem) => parseInt(search) === elem.product.Referencia
    );
    const salidas = movements.salidas.filter(
      (elem) => parseInt(search) === elem.product.Referencia
    );

    if (entradas.length > 0 || salidas.length > 0) {
      const amountEntradas = entradas.reduce((a, b) => a + b.amount, 0);
      const amountSalidas = salidas.reduce((a, b) => a + b.amount, 0);

      const object = {
        entradas,
        salidas,
        amount: {
          amountEntradas,
          amountSalidas,
        },
      };
      setFilterMovements(object);
    } else {
      alert("No se encontraron entradas ni salidas del producto");
      setFilterMovements(movements);
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
        <button class="btn btn-outline-success" type="submit" onClick={handleClick}>
          Buscar
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-end">
        <ReactHTMLTableToExcel
          id="movements-xls-button"
          className="d-flex flex-row align-items-center btn btn-success mt-2 mb-2 p-2"
          table="table-movements"
          filename="Movimientos"
          filetype="xls"
          sheet="movimientos"
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
                  option="entradas"
                />
              </td>
              <td className="p-0">
                <TableMovements
                  filterMovements={filterMovements}
                  option="salidas"
                />
              </td>
            </tr>
            {filterMovements.amount ? (
              <>
                <tr>
                  <td>{filterMovements.amount.amountEntradas}</td>
                  <td>{filterMovements.amount.amountSalidas}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
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
