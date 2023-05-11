import { useState, useEffect } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel-3";
import { config } from "../../config";

function Existencias() {
  const [movements, setMovements] = useState();

  useEffect(() => {
    const url = `${config.apiUrl}/movimientos`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setMovements(res.data);
      });
  }, []);

  const calculateExistence = () => {
    let result = [];
    let currentRef = null;
    const { entradas, salidas } = movements;
    entradas.sort((a, b) => a.product.Referencia - b.product.Referencia);
    salidas.sort();

    for (const entrada of entradas) {
      const ref = entrada.product.Referencia;

      if (ref === currentRef) {
        result[result.length - 1].movements.entradas.push(entrada);
      } else {
        result.push({
          ref,
          description: entrada.product["Desc. item"],
          movements: {
            entradas: [entrada],
            salidas: [],
          },
        });
        currentRef = ref;
      }
    }

    for (const salida of salidas) {
      for (let i = 0; i < result.length; i++) {
        currentRef = result[i].ref;
        const ref = salida.product.Referencia;

        if (ref === currentRef) {
          result[i].movements.salidas.push(salida);
        } else {
          continue;
        }
      }
    }
    console.log(result);
    return result;
  };

  return (
    <div className="container text-light pt-4">
      <div className="d-flex flex-row align-items-center justify-content-between mb-3">
        <button
          className="btn btn-secondary"
          onClick={(e) => window.history.back()}
        >
          {"volver atras"}
        </button>
        <ReactHTMLTableToExcel
          id="existence-xls-button"
          className="btn btn-success"
          table="table-existence"
          filename="Existencias"
          filetype="xls"
          sheet="existencias"
        >
          Descargar
        </ReactHTMLTableToExcel>
      </div>
      <div className="fs-6 text-center">
        <h2>EXISTENCIA EN BODEGA</h2>
      </div>
      <div className="table-resposive">
        <table
          id="table-existence"
          className="table table-dark table-middle text-center table-bordered"
          style={{ fontSize: 11 }}
        >
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Descripcion</th>
              <th>Existencia</th>
            </tr>
          </thead>
          <tbody>
            {movements
              ? calculateExistence().map((elemt) => (
                  <tr>
                    <td>{elemt.ref}</td>
                    <td>{elemt.description}</td>
                    <td>
                      {elemt.movements.entradas.reduce(
                        (a, b) => a + b.amount,
                        0
                      ) -
                        elemt.movements.salidas.reduce(
                          (a, b) => a + b.amount,
                          0
                        )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Existencias;
