import { useContext } from "react";
import sweal from "sweetalert";
import { updateMovement } from "../../services/movementService";
import Context from "../../context/userContext";
import LogoEliminar from "../../assets/eliminar.png";
import "./styles.css";

function TableMovements({ filterMovements, option }) {
  const { colaborator } = useContext(Context);

  const getTotalAmount = (productId, movement, movementType) => {
    return filterMovements
    .filter((item) => 
      item.product.id === parseInt(productId) &&
      !item.deleted &&
      item.movementType === movementType &&
      item.flag === movement.flag
    )
    .reduce((total, item) => total + item.amount, 0);
  }

  const handleClick = (e) => {
    const { id } = e.target;
    const [movementId, productId] = id.split("-");

    const movement = filterMovements.find(
      (item) => item.id === parseInt(movementId)
    );
    const totalEntradas = getTotalAmount(productId, movement, 'entrada')
    const totalSalidas = getTotalAmount(productId, movement, 'salida')

    if (totalEntradas - movement.amount < totalSalidas) {
      sweal({
        title: "¡UPSS!",
        text: "Ya hay movimientos de salida de este producto que superan la cantidad e impiden eliminar este registro",
        icon: "error",
        timer: 5000,
      });
    } else {
      sweal({
        text: "Ingrese la contraseña",
        content: "input",
        button: {
          text: "Continuar",
          closeModal: false,
        },
      }).then((password) => {
        if (password !== "123") {
          return sweal({
            text: "Contrasena Incorrecta",
            icon: "error",
            button: "OK",
            dangerMode: true,
          });
        }
        sweal({
          title: "¡CUIDADO!",
          text: "ESTÁ SEGURO QUE DESEA ELIMINAR ESTE MOVIMIENTO?",
          icon: "warning",
          content: {
            element: "input",
            attributes: {
              placeholder:
                "Ingrese aquí la razon para eliminar el movimiento (OBLIGATORIO)",
            },
          },
          buttons: ["Cancelar", "Si, eliminar"],
          dangerMode: true,
        }).then((comment) => {
          if (comment) {
            const changes = {
              deleted: true,
              deletedAt: new Date(),
              deletedBy: colaborator.nombre,
              removalReason: comment
            };
            updateMovement(movementId, changes).then((res) => {
              sweal({
                text: "¡El movimiento se ha eliminado exitosamente!",
                icon: "success",
                timer: 3000,
              });
            });
            sweal.close();
            window.history.back()
          } else {
            sweal({
              title: "CAMPOS REQUERIDOS",
              text: "La razón de la eliminación es obligatoria",
              icon: "error",
              timer: 3000,
            });
          }
        });
      });
    }
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
                      id={`${elem.id}-${elem.product.id}`}
                      className="btn btn-danger btn-options"
                      onClick={handleClick}
                    >
                      <img
                        id={`${elem.id}-${elem.product.id}`}
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
