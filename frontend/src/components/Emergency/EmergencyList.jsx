import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const EmergencyList = () => {
  const { user } = useAuth();
  const [emergencias, setEmergencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: "",
    tipo_emergencia: "",
    prioridad: "",
  });
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    loadEmergencias();
  }, [filters]);

  const loadEmergencias = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/emergencies?${params.toString()}`);
      setEmergencias(response.data.emergencias);
    } catch (error) {
      console.error("Error al cargar emergencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnidades = async (tipo) => {
    try {
      const response = await axios.get(`/users/unidades/${tipo}`);
      setUnidades(response.data);
    } catch (error) {
      console.error("Error al cargar unidades:", error);
    }
  };

  const updateEstado = async (emergencyId, nuevoEstado, comentario = "") => {
    try {
      await axios.put(`/emergencies/${emergencyId}/estado`, {
        estado: nuevoEstado,
        comentario,
      });

      loadEmergencias();
      setSelectedEmergency(null);
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert(
        "Error al actualizar el estado: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const asignarEmergencia = async (
    emergencyId,
    unidadId,
    observaciones = ""
  ) => {
    try {
      await axios.post(`/emergencies/${emergencyId}/asignar`, {
        unidad_asignada_id: unidadId,
        observaciones,
      });

      loadEmergencias();
      setSelectedEmergency(null);
      alert("Emergencia asignada correctamente");
    } catch (error) {
      console.error("Error al asignar emergencia:", error);
      alert(
        "Error al asignar la emergencia: " +
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

  const getEmergencyIcon = (tipo) => {
    switch (tipo) {
      case "bomberos":
        return "🚒";
      case "policia":
        return "👮";
      case "ambulancia":
        return "🚑";
      default:
        return "🚨";
    }
  };

  const getEmergencyColor = (tipo) => {
    switch (tipo) {
      case "bomberos":
        return "#ff4757";
      case "policia":
        return "#2f3542";
      case "ambulancia":
        return "#2ed573";
      default:
        return "#007bff";
    }
  };

  const canManageEmergency = () => {
    return ["operador", "bombero", "policia", "ambulancia"].includes(
      user?.tipo_usuario
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando emergencias...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card mb-20">
        <div className="flex-between mb-20">
          <h1 className="card-title">📋 Lista de Emergencias</h1>
          <button onClick={loadEmergencias} className="btn btn-primary">
            🔄 Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-3 gap-20 mb-20">
          <div className="form-group">
            <label>Estado</label>
            <select
              className="form-select"
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="atendida">Atendida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              className="form-select"
              value={filters.tipo_emergencia}
              onChange={(e) =>
                handleFilterChange("tipo_emergencia", e.target.value)
              }
            >
              <option value="">Todos los tipos</option>
              <option value="bomberos">Bomberos</option>
              <option value="policia">Policía</option>
              <option value="ambulancia">Ambulancia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prioridad</label>
            <select
              className="form-select"
              value={filters.prioridad}
              onChange={(e) => handleFilterChange("prioridad", e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de emergencias */}
      {emergencias.length > 0 ? (
        <div className="grid grid-1 gap-20">
          {emergencias.map((emergencia) => (
            <div key={emergencia.id} className="card">
              <div className="flex-between mb-15">
                <div
                  className="flex"
                  style={{ alignItems: "center", gap: "15px" }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                      padding: "10px",
                      borderRadius: "50%",
                      background: getEmergencyColor(emergencia.tipo_emergencia),
                      color: "white",
                    }}
                  >
                    {getEmergencyIcon(emergencia.tipo_emergencia)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, textTransform: "capitalize" }}>
                      Emergencia #{emergencia.id} - {emergencia.tipo_emergencia}
                    </h3>
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      Por: {emergencia.usuario_nombre} |{" "}
                      {emergencia.usuario_telefono}
                    </p>
                  </div>
                </div>
                <div className="flex" style={{ gap: "10px" }}>
                  <span className={`estado-badge estado-${emergencia.estado}`}>
                    {emergencia.estado}
                  </span>
                  <span
                    className={`prioridad-badge prioridad-${emergencia.prioridad}`}
                  >
                    {emergencia.prioridad}
                  </span>
                </div>
              </div>

              <div className="grid grid-2 gap-20 mb-15">
                <div>
                  <p>
                    <strong>📝 Descripción:</strong>
                  </p>
                  <p>{emergencia.descripcion || "Sin descripción"}</p>
                </div>
                <div>
                  <p>
                    <strong>📍 Ubicación:</strong>
                  </p>
                  <p>{emergencia.direccion || "Ubicación automática"}</p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Lat: {emergencia.ubicacion_lat?.toFixed(6)}, Lng:{" "}
                    {emergencia.ubicacion_lng?.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="grid grid-2 gap-20 mb-15">
                <div>
                  <p>
                    <strong>🕒 Fecha de creación:</strong>
                  </p>
                  <p>{new Date(emergencia.fecha_creacion).toLocaleString()}</p>
                </div>
                <div>
                  {emergencia.fecha_atencion && (
                    <>
                      <p>
                        <strong>✅ Fecha de atención:</strong>
                      </p>
                      <p>
                        {new Date(emergencia.fecha_atencion).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Acciones para operadores y unidades */}
              {canManageEmergency() && (
                <div className="flex gap-10 mt-15">
                  {user?.tipo_usuario === "operador" &&
                    emergencia.estado === "pendiente" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedEmergency(emergencia);
                            loadUnidades(
                              emergencia.tipo_emergencia === "policia"
                                ? "policia"
                                : emergencia.tipo_emergencia === "ambulancia"
                                ? "ambulancia"
                                : "bombero"
                            );
                          }}
                          className="btn btn-success"
                        >
                          👥 Asignar
                        </button>
                      </>
                    )}

                  {emergencia.estado === "pendiente" && (
                    <button
                      onClick={() =>
                        updateEstado(
                          emergencia.id,
                          "en_proceso",
                          "Emergencia tomada"
                        )
                      }
                      className="btn btn-warning"
                    >
                      ⏳ Tomar
                    </button>
                  )}

                  {emergencia.estado === "en_proceso" && (
                    <button
                      onClick={() =>
                        updateEstado(
                          emergencia.id,
                          "atendida",
                          "Emergencia resuelta"
                        )
                      }
                      className="btn btn-success"
                    >
                      ✅ Completar
                    </button>
                  )}

                  {emergencia.estado !== "cancelada" && (
                    <button
                      onClick={() =>
                        updateEstado(
                          emergencia.id,
                          "cancelada",
                          "Emergencia cancelada"
                        )
                      }
                      className="btn btn-danger"
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>📋</div>
          <h2>No hay emergencias</h2>
          <p>No se encontraron emergencias con los filtros seleccionados</p>
        </div>
      )}

      {/* Modal para asignar emergencia */}
      {selectedEmergency && user?.tipo_usuario === "operador" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: "500px", maxWidth: "90vw" }}>
            <h3 className="card-subtitle mb-20">
              👥 Asignar Emergencia #{selectedEmergency.id}
            </h3>

            <div className="form-group">
              <label>Unidad Disponible</label>
              <select
                className="form-select"
                onChange={(e) => {
                  if (e.target.value) {
                    asignarEmergencia(selectedEmergency.id, e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="">Seleccionar unidad...</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre} - {unidad.estado}
                    {unidad.ubicacion_lat &&
                      ` (${unidad.ubicacion_lat.toFixed(
                        3
                      )}, ${unidad.ubicacion_lng.toFixed(3)})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-10 mt-20">
              <button
                onClick={() => setSelectedEmergency(null)}
                className="btn"
                style={{ background: "#6c757d", color: "white" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyList;
