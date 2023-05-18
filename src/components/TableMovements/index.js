import { useContext } from "react";
import sweal from "sweetalert";
import { updateMovement } from "../../services/movementService";
import Context from "../../context/userContext";
import LogoEliminar from "../../assets/eliminar.png";
import "./styles.css";

function TableMovements({ filterMovements, option }) {
  const { colaborator } = useContext(Context);

  const handleClick = (e) => {
    const { id } = e.target;
    
    const changes = {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: colaborator.nombre,
    };

    sweal({
      title: "¡CUIDADO!",
      text: "Esta seguro que desea eliminar este movimiento?",
      icon: "warning",
      buttons: ["Cancelar", "Si, eliminar"],
      dangerMode: true,
    }).then((deleted) => {
      if (deleted) {
        updateMovement(id, changes).then((res) => {
          sweal({
            text: "¡El movimiento se ha eliminado exitosamente!",
            icon: "success",
            timer: 3000,
          });
        });
      }
    });
  };

  return (
    <table className="table table-dark table-striped align-middle m-0">
      <thead>
        <tr>
          <th>Ref.</th>
          <th>Descripcion</th>
          <th>U.M</th>
          <th>Cantidad</th>
          <th>Colaborador</th>
          <th>Band</th>
          <th>Fecha</th>
          <th>Opcion</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(filterMovements).length > 0
          ? filterMovements
              .filter((elem) => elem.movementType === option && !elem.deleted)
              .map((elem, index) => (
                <tr key={index}>
                  <td>{elem.product.id}</td>
                  <td>{elem.product.description}</td>
                  <td>{elem.product.um}</td>
                  <td>{elem.amount}</td>
                  <td>{elem.colaborator.nombre}</td>
                  <td>{elem.flag}</td>
                  <td>{new Date(elem.createdAt).toLocaleString("en-US")}</td>
                  <td className="fs-6">
                    <button
                      className="btn btn-danger btn-options"
                      onClick={handleClick}
                    >
                      <img
                        id={elem.id}
                        src={LogoEliminar}
                        className="img-options"
                        alt="eliminar"
                      />
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
