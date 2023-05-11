import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Context from "../../context/userContext";
import BD from "../../BD.json";
import Logo from "../../assets/logo-gran-langostino.png";

function Login() {
  const [numId, setNumId] = useState("");
  const { colaborator, getColaborator } = useContext(Context)
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { value } = e.target;
    value = parseInt(value);
    setNumId(value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const colaborator = BD.colaboradores.find(
      (elem) => elem["CEDULA"] === numId
    );
    if (colaborator) {
      getColaborator(colaborator);
      navigate("/home");
    } else {
      alert("No hay no existe");
    }
  };

  return (
    !colaborator ? (
    <div className="d-flex align-items-center justify-content-center vh-100 p-2">
      <Navigate to='/login'/>
      <div
        className="d-flex align-items-center flex-row card"
        style={{ minHeight: 250, minWidth: 300 }}
      >
        <div className="d-flex flex-column align-items-center p-4 h-100 w-100">
          <img src={Logo} className="mb-4" alt="logo" style={{ width: 200 }} />
          <form className="d-flex flex-column text-center gap-0 w-100">
            <p className="fs-6 w-100 m-0">NUMERO DE IDENTIFICACION</p>
            <input
              className="w-100 mb-3"
              type="number"
              value={numId}
              style={{
                textAlign: "center",
              }}
              onChange={handleChange}
            />
            <button
              className="btn btn-primary w-100"
              type="submit"
              onClick={handleClick}
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    </div>
    ) : (<Navigate to='/home' />)
  );
}

export default Login;
