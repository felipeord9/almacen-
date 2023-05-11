import { useNavigate } from "react-router-dom";
function Card({nombre, redirect}) {
  const navigate = useNavigate()

  return (
    <div className="btn btn-primary col card" onClick={(e) => navigate(redirect)}>
      <div className="card-body">
        <p className="card-text">{nombre}</p>
      </div>
    </div>
  );
}

export default Card;
