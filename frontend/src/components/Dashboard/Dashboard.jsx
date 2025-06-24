import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [emergenciasRecientes, setEmergenciasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas para operadores
      if (user?.tipo_usuario === "operador") {
        const [emergencyStats, userStats] = await Promise.all([
          axios.get("/emergencies/stats/dashboard"),
          axios.get("/users/stats/usuarios"),
        ]);
        setStats({
          emergencies: emergencyStats.data,
          users: userStats.data,
        });
      }

      // Cargar emergencias recientes
      const emergenciasResponse = await axios.get("/emergencies?limit=5");
      setEmergenciasRecientes(emergenciasResponse.data.emergencias);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getUserRoleDescription = (tipo) => {
    switch (tipo) {
      case "ciudadano":
        return "Puedes reportar emergencias de manera rápida y sencilla";
      case "operador":
        return "Coordinas y asignas emergencias a las unidades correspondientes";
      case "bombero":
        return "Respondes a emergencias de incendios y rescates";
      case "policia":
        return "Atiendes emergencias de seguridad y orden público";
      case "ambulancia":
        return "Brindas atención médica de emergencia";
      default:
        return "Bienvenido al sistema de emergencias";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header de bienvenida */}
      <div className="card mb-20">
        <h1 className="card-title">
          {getGreeting()}, {user?.nombre}! 👋
        </h1>
        <p className="card-subtitle">
          {getUserRoleDescription(user?.tipo_usuario)}
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="card mb-20">
        <h2 className="card-subtitle mb-20">🚀 Acciones Rápidas</h2>
        <div className="grid grid-3">
          {user?.tipo_usuario === "ciudadano" && (
            <button
              onClick={() => navigate("/emergency")}
              className="btn btn-emergency bomberos"
            >
              🆘 <br />
              Reportar Emergencia
            </button>
          )}

          <button
            onClick={() => navigate("/emergencies")}
            className="btn btn-emergency policia"
          >
            📋 <br />
            Ver Emergencias
          </button>

          {user?.tipo_usuario === "operador" && (
            <button
              onClick={() => navigate("/users")}
              className="btn btn-emergency ambulancia"
            >
              👥 <br />
              Gestionar Usuarios
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas para operadores */}
      {user?.tipo_usuario === "operador" && stats && (
        <div className="grid grid-2 mb-20">
          <div className="card">
            <h3 className="card-subtitle">📊 Estadísticas de Emergencias</h3>
            <div className="grid grid-2 gap-10">
              {stats.emergencies.por_estado?.map((item) => (
                <div
                  key={item.estado}
                  className="p-20"
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div className={`estado-badge estado-${item.estado}`}>
                    {item.estado}
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="card-subtitle">👥 Estadísticas de Usuarios</h3>
            <div className="grid grid-2 gap-10">
              {stats.users.por_tipo?.map((item) => (
                <div
                  key={item.tipo_usuario}
                  className="p-20"
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: "#007bff",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.tipo_usuario}
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergencias recientes */}
      <div className="card">
        <h3 className="card-subtitle mb-20">🕒 Emergencias Recientes</h3>
        {emergenciasRecientes.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {emergenciasRecientes.map((emergencia) => (
                  <tr key={emergencia.id}>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          background:
                            emergencia.tipo_emergencia === "bomberos"
                              ? "#ff4757"
                              : emergencia.tipo_emergencia === "policia"
                              ? "#2f3542"
                              : "#2ed573",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {emergencia.tipo_emergencia}
                      </span>
                    </td>
                    <td>{emergencia.usuario_nombre}</td>
                    <td>
                      <span
                        className={`estado-badge estado-${emergencia.estado}`}
                      >
                        {emergencia.estado}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`prioridad-badge prioridad-${emergencia.prioridad}`}
                      >
                        {emergencia.prioridad}
                      </span>
                    </td>
                    <td>
                      {new Date(emergencia.fecha_creacion).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-20">
            <p>No hay emergencias recientes</p>
          </div>
        )}
      </div>

      {/* Información de contacto */}
      <div className="card mt-20">
        <h3 className="card-subtitle mb-20">📞 Números de Emergencia</h3>
        <div className="grid grid-3">
          <div
            className="text-center p-20"
            style={{
              background: "linear-gradient(45deg, #ff4757, #ff3838)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>🚒</div>
            <h4>Bomberos</h4>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>119</p>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "linear-gradient(45deg, #2f3542, #57606f)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>👮</div>
            <h4>Policía</h4>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>110</p>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "linear-gradient(45deg, #2ed573, #20bf6b)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>🚑</div>
            <h4>Ambulancia</h4>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>118</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
