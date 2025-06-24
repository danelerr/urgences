import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserTypeColor = (tipo) => {
    switch (tipo) {
      case "bombero":
        return "#ff4757";
      case "policia":
        return "#2f3542";
      case "ambulancia":
        return "#2ed573";
      case "operador":
        return "#5352ed";
      default:
        return "#007bff";
    }
  };

  const getUserTypeIcon = (tipo) => {
    switch (tipo) {
      case "bombero":
        return "🚒";
      case "policia":
        return "👮";
      case "ambulancia":
        return "🚑";
      case "operador":
        return "📞";
      default:
        return "👤";
    }
  };

  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "15px 20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        borderBottom: "3px solid " + getUserTypeColor(user?.tipo_usuario),
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex" style={{ alignItems: "center", gap: "15px" }}>
          <h1
            style={{
              margin: 0,
              color: "#333",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            🚨 Urgences
          </h1>
          <div
            style={{
              background: getUserTypeColor(user?.tipo_usuario),
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{getUserTypeIcon(user?.tipo_usuario)}</span>
            {user?.tipo_usuario?.toUpperCase()}
          </div>
        </div>

        <nav className="flex" style={{ alignItems: "center", gap: "20px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            📊 Dashboard
          </button>

          {user?.tipo_usuario === "ciudadano" && (
            <button
              onClick={() => navigate("/emergency")}
              className="btn btn-danger"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              🆘 Emergencia
            </button>
          )}

          <button
            onClick={() => navigate("/emergencies")}
            className="btn btn-success"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            📋 Ver Emergencias
          </button>

          {user?.tipo_usuario === "operador" && (
            <button
              onClick={() => navigate("/users")}
              className="btn btn-warning"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              👥 Usuarios
            </button>
          )}

          <div className="flex" style={{ alignItems: "center", gap: "15px" }}>
            <span style={{ fontWeight: "600", color: "#333" }}>
              👋 {user?.nombre}
            </span>
            <button
              onClick={handleLogout}
              className="btn"
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                background: "#6c757d",
                color: "white",
              }}
            >
              🚪 Salir
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
