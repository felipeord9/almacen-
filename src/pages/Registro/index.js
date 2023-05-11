import { useState, useContext } from "react";
import sweal from 'sweetalert'
import { config } from "../../config";
import Context from "../../context/userContext";
import BD from "../../BD.json";
import "./styles.css";

function Registro() {
  /* const [searchRef, setSearchRef] = useState();
  const [searchDesc, setSearchDesc] = useState(""); */
  const [suggestions, setSuggestions] = useState([...BD.productos]);
  //const [amount, setAmount] = useState();
  const [product, setProduct] = useState(null);
  const [search, setSearch] = useState({
    searchRef: "",
    searchDesc: "",
    amount: "",
  });
  const { colaborator } = useContext(Context);

  const handleFindRef = (e) => {
    let { value } = e.target;
    let result = 0;
    value = parseInt(value);
    result = BD.productos.find(({ Referencia }) => Referencia === value);
    if (result) {
      setSearch({
        ...search,
        searchDesc: result["Desc. item"],
      });
      setSuggestions([result]);
      setProduct(result);
    } else {
      setProduct(null);
    }
  };

  const handleFindDesc = (e) => {
    let select = document.getElementById("select-products");
    select.value = select.options[0].value;
    let result = BD.productos.filter((product) =>
      product["Desc. item"]
        .toLowerCase()
        .includes(search.searchDesc.toLowerCase())
    );
    setSuggestions(result);
    setProduct(null);
  };

  const handleChange = (e) => {
    let { value, name } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    const ref = value.split(" ")[0];
    const result = BD.productos.find(
      ({ Referencia }) => Referencia === parseInt(ref)
    );
    setProduct(result);
    setSearch({
      ...search,
      searchRef: parseInt(ref),
      searchDesc: result["Desc. item"],
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (product && search.amount) {
      let url = `${config.apiUrl}/movimientos/${e.target.name}`;
      const body = {
        product,
        colaborator,
        amount: parseInt(search.amount),
        date: new Date().toLocaleString("en-US"),
      };

      if (e.target.name === "salida") {
        const auxUrl = `${config.apiUrl}/movimientos`;

        const movements = await fetch(auxUrl)
          .then((res) => res.json())
          .then((res) => res.data);

        const filterEntradas = movements.entradas.filter(
          (elem) => elem.product.Referencia === product.Referencia
        );
        const filterSalidas = movements.salidas.filter(
          (elem) => elem.product.Referencia === product.Referencia
        );

        const amountEntradas = filterEntradas.reduce((a, b) => a + b.amount, 0);
        const amountSalidas = filterSalidas.reduce((a, b) => a + b.amount, 0);

        if (amountEntradas - amountSalidas >= search.amount) {
          sweal({
            title: "ESTAS SEGURO?",
            text: `Retiraras ${search.amount}${product["U.M."]} de ${product["Desc. item"]}`,
            buttons: ["Cancelar", "Continuar"],
            dangerMode: true
          })
          .then((deleted) => {
            if(deleted) {
              fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              }).then((res) => res.json());
              sweal({
                text: "Se ha registrado la salida exitosamente!",
                icon: 'success'
              })
            }
          })
        } else {
          sweal({
            title: "¡ATENCION!",
            text: "No hay la cantidad suficiente para hacer el movimiento",
            icon: 'warning',
            button: 'Cerrar',
            timer: 3000
          })
        }
      } else {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }).then((res) => res.json());

        alert("Completado");
        setProduct(null)
        setSearch({
          searchDesc: '',
          searchRef: ''
        })
      }
    } else {
      sweal({
        title: "ATENCION",
        text: "Te hace falta llenar algunos campos",
        icon: "warning",
        button: "cerrar",
        timer: 3000

      })
      .then(() => console.log('Hello'))
      .catch((err) => sweal(err.message, 'Error', 'error'))
    }
  };

  return (
    <div className="pt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={(e) => window.history.back()}
      >
        {"volver atras"}
      </button>
      <div className="fs-6 w-100">
        <h2 className="text-light text-center fs-5">REGISTRO DE MOVIMIENTO</h2>
        <form className="d-flex flex-column gap-2 fs-6">
          <div className="d-flex align-items-start card bg-light p-4">
            <p>
              <strong>DATOS DEL PRODUCTO</strong>
            </p>
            <div className="d-flex flex-column justify-content-between gap-3 w-100 text-start">
              <div className="d-flex flex-column justify-content-start w-100">
                <label>Codigo de producto</label>
                <input
                  id="Referencia"
                  name="searchRef"
                  type="number"
                  value={search.searchRef}
                  onChange={(e) => {
                    handleFindRef(e);
                    handleChange(e);
                  }}
                />
              </div>
              <div className="d-flex flex-column justify-content-start w-100">
                <label>Nombre de producto</label>
                <div
                  /* className="d-flex align-items-center w-100" */ className="combobox-container"
                >
                  <input
                    name="searchDesc"
                    type="text"
                    className="container-input"
                    value={product ? product["Desc. item"] : search.searchDesc}
                    onChange={(e) => {
                      handleFindDesc(e);
                      handleChange(e);
                    }}
                  />
                  <select
                    id="select-products"
                    className="w-100 h-100 container-select"
                    defaultValue={0}
                    onChange={(e) => {
                      handleSelect(e);
                    }}
                  >
                    <option id={0} name="product" disabled selected>
                      -- SELECCIONE UN PRODUCTO --
                    </option>
                    {suggestions.map((product, index) => (
                      <option id={product.Referencia} name="product">
                        {product.Referencia + " - " + product["Desc. item"]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-start w-100">
                <label>U.M.</label>
                <input
                  type="text"
                  value={product ? product["U.M."] : ""}
                  disabled
                />
              </div>
              <div className="d-flex flex-column justify-content-startt w-100">
                <label>Cantidad</label>
                <input
                  name="amount"
                  type="number"
                  value={search.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-evenly">
            <button
              name="entrada"
              className="btn btn-success"
              onClick={handleClick}
            >
              REGISTRAR ENTRADA
            </button>
            <button
              name="salida"
              className="btn btn-danger"
              onClick={handleClick}
            >
              REGISTRAR SALIDA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
