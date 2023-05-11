import "./styles.css";

function TableMovements({ filterMovements, option }) {
  return (
    <table className="table table-dark table-striped align-middle m-0">
      <thead>
        <tr>
          <th>Ref.</th>
          <th>Descripcion</th>
          <th>U.M</th>
          <th>Cantidad</th>
          <th>Colaborador</th>
          <th>Fecha</th>
          <th>Opcion</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(filterMovements).length > 0
          ? filterMovements[option].map((elem) => (
              <tr>
                <td>{elem.product.Referencia}</td>
                <td>{elem.product["Desc. item"]}</td>
                <td>{elem.product["U.M."]}</td>
                <td>{elem.amount}</td>
                <td>{elem.colaborator.NOMBRE}</td>
                <td>{elem.date}</td>
                <td className="fs-6">
                  {/* <button className="btn btn-success btn-options mb-1">
                    Editar
                    {/* <img
                      src={LogoEditar}
                      className="img-options"
                      alt="editar"
                    />
                  </button> */}
                  <button className="btn btn-danger btn-options">
                    {/* <img
                      src={LogoEliminar}
                      className="img-options"
                      alt="eliminar"
                    /> */}
                    X
                  </button>
                </td>
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
}

export default TableMovements;
