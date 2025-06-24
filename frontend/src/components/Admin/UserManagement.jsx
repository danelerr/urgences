import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const UserManagement = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo_usuario: "",
    estado: "",
  });

  useEffect(() => {
    loadUsuarios();
  }, [filters]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/users?${params.toString()}`);
      setUsuarios(response.data.usuarios);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, nuevoEstado) => {
    try {
      await axios.put(`/users/${userId}/estado`, {
        estado: nuevoEstado,
      });

      loadUsuarios();
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert(
        "Error al actualizar el estado: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      case "ciudadano":
        return "👤";
      default:
        return "❓";
    }
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
      case "ciudadano":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "activo":
        return "#28a745";
      case "en_servicio":
        return "#007bff";
      case "fuera_servicio":
        return "#ffc107";
      case "inactivo":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  // Solo operadores pueden acceder
  if (user?.tipo_usuario !== "operador") {
    return (
      <div className="card text-center">
        <h2>❌ Acceso Denegado</h2>
        <p>Solo los operadores pueden gestionar usuarios</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card mb-20">
        <div className="flex-between mb-20">
          <h1 className="card-title">👥 Gestión de Usuarios</h1>
          <button onClick={loadUsuarios} className="btn btn-primary">
            🔄 Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-2 gap-20 mb-20">
          <div className="form-group">
            <label>Tipo de Usuario</label>
            <select
              className="form-select"
              value={filters.tipo_usuario}
              onChange={(e) =>
                handleFilterChange("tipo_usuario", e.target.value)
              }
            >
              <option value="">Todos los tipos</option>
              <option value="ciudadano">Ciudadano</option>
              <option value="operador">Operador</option>
              <option value="bombero">Bombero</option>
              <option value="policia">Policía</option>
              <option value="ambulancia">Paramédico</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              className="form-select"
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="en_servicio">En Servicio</option>
              <option value="fuera_servicio">Fuera de Servicio</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-4 gap-10 mb-20">
          <div
            className="text-center p-20"
            style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "2px solid #e9ecef",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}
            >
              {usuarios.length}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Total Usuarios
            </div>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "2px solid #e9ecef",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}
            >
              {usuarios.filter((u) => u.estado === "en_servicio").length}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>En Servicio</div>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "2px solid #e9ecef",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ff4757" }}
            >
              {
                usuarios.filter((u) =>
                  ["bombero", "policia", "ambulancia"].includes(u.tipo_usuario)
                ).length
              }
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Unidades</div>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "2px solid #e9ecef",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#5352ed" }}
            >
              {usuarios.filter((u) => u.tipo_usuario === "ciudadano").length}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Ciudadanos</div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      {usuarios.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Contacto</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div
                      className="flex"
                      style={{ alignItems: "center", gap: "10px" }}
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          padding: "8px",
                          borderRadius: "50%",
                          background: getUserTypeColor(usuario.tipo_usuario),
                          color: "white",
                        }}
                      >
                        {getUserTypeIcon(usuario.tipo_usuario)}
                      </div>
                      <div>
                        <strong>{usuario.nombre}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          ID: {usuario.id}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div>
                      <div>📧 {usuario.email}</div>
                      <div>📞 {usuario.telefono}</div>
                    </div>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: getUserTypeColor(usuario.tipo_usuario),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {usuario.tipo_usuario}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: getStatusColor(usuario.estado),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {usuario.estado}
                    </span>
                  </td>

                  <td>
                    {usuario.ubicacion_lat && usuario.ubicacion_lng ? (
                      <div style={{ fontSize: "12px" }}>
                        <div>📍 {usuario.ubicacion_lat.toFixed(4)}</div>
                        <div>📍 {usuario.ubicacion_lng.toFixed(4)}</div>
                      </div>
                    ) : (
                      <span style={{ color: "#999" }}>Sin ubicación</span>
                    )}
                  </td>

                  <td>
                    <small>
                      {new Date(usuario.fecha_creacion).toLocaleDateString()}
                    </small>
                  </td>

                  <td>
                    <div
                      className="flex"
                      style={{ gap: "5px", flexWrap: "wrap" }}
                    >
                      {usuario.estado === "activo" &&
                        ["bombero", "policia", "ambulancia"].includes(
                          usuario.tipo_usuario
                        ) && (
                          <button
                            onClick={() =>
                              updateUserStatus(usuario.id, "en_servicio")
                            }
                            className="btn btn-success"
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                          >
                            ✅ Activar
                          </button>
                        )}

                      {usuario.estado === "en_servicio" && (
                        <button
                          onClick={() =>
                            updateUserStatus(usuario.id, "fuera_servicio")
                          }
                          className="btn btn-warning"
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          ⏸️ Pausar
                        </button>
                      )}

                      {usuario.estado === "fuera_servicio" && (
                        <button
                          onClick={() =>
                            updateUserStatus(usuario.id, "en_servicio")
                          }
                          className="btn btn-success"
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          ▶️ Reactivar
                        </button>
                      )}

                      {usuario.estado !== "inactivo" && (
                        <button
                          onClick={() =>
                            updateUserStatus(usuario.id, "inactivo")
                          }
                          className="btn btn-danger"
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          ❌ Desactivar
                        </button>
                      )}

                      {usuario.estado === "inactivo" && (
                        <button
                          onClick={() => updateUserStatus(usuario.id, "activo")}
                          className="btn btn-primary"
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          🔄 Reactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>👥</div>
          <h2>No hay usuarios</h2>
          <p>No se encontraron usuarios con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
