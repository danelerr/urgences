import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const EmergencyButton = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emergencyCreated, setEmergencyCreated] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const createEmergency = async (tipo_emergencia) => {
    try {
      setLoading(true);
      setSelectedType(tipo_emergencia);

      // Obtener ubicación actual
      let currentLocation;
      try {
        currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
      } catch (locationError) {
        console.warn("No se pudo obtener la ubicación:", locationError);
        // Usar ubicación por defecto (Santa Cruz, Bolivia)
        currentLocation = {
          lat: -17.783327,
          lng: -63.18214,
        };
      }

      const emergencyData = {
        tipo_emergencia,
        descripcion:
          description ||
          `Emergencia de ${tipo_emergencia} reportada desde la aplicación`,
        ubicacion_lat: currentLocation.lat,
        ubicacion_lng: currentLocation.lng,
        direccion: "Ubicación obtenida automáticamente",
        prioridad: "alta",
      };

      const response = await axios.post("/emergencies", emergencyData);
      setEmergencyCreated(response.data.emergencia);
    } catch (error) {
      console.error("Error al crear emergencia:", error);
      alert(
        "Error al crear la emergencia: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmergencyCreated(null);
    setSelectedType("");
    setDescription("");
    setLocation(null);
  };

  if (emergencyCreated) {
    return (
      <div className="card text-center">
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
        <h1 className="card-title">¡Emergencia Reportada!</h1>
        <p className="card-subtitle">
          Tu solicitud de ayuda ha sido enviada exitosamente
        </p>

        <div
          className="mt-20 p-20"
          style={{
            background: "#d4edda",
            borderRadius: "12px",
            border: "1px solid #c3e6cb",
          }}
        >
          <h3>Detalles de la Emergencia</h3>
          <p>
            <strong>ID:</strong> #{emergencyCreated.id}
          </p>
          <p>
            <strong>Tipo:</strong> {emergencyCreated.tipo_emergencia}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className="estado-badge estado-pendiente">Pendiente</span>
          </p>
          <p>
            <strong>Hora:</strong>{" "}
            {new Date(emergencyCreated.fecha_creacion).toLocaleString()}
          </p>
          {location && (
            <p>
              <strong>Ubicación:</strong> {location.lat.toFixed(6)},{" "}
              {location.lng.toFixed(6)}
            </p>
          )}
        </div>

        <div className="alert alert-info mt-20">
          <h4>🚨 ¿Qué sigue?</h4>
          <p>• Los operadores han recibido tu solicitud</p>
          <p>• Se asignará una unidad de respuesta</p>
          <p>• Mantén tu teléfono disponible</p>
          <p>• Si es una emergencia crítica, también llama directamente</p>
        </div>

        <div className="grid grid-3 mt-20">
          <div
            className="text-center p-20"
            style={{
              background: "#ff4757",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px" }}>🚒</div>
            <p>
              <strong>Bomberos: 119</strong>
            </p>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "#2f3542",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px" }}>👮</div>
            <p>
              <strong>Policía: 110</strong>
            </p>
          </div>

          <div
            className="text-center p-20"
            style={{
              background: "#2ed573",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "30px" }}>🚑</div>
            <p>
              <strong>Ambulancia: 118</strong>
            </p>
          </div>
        </div>

        <button onClick={resetForm} className="btn btn-primary mt-20">
          Reportar Nueva Emergencia
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card text-center mb-20">
        <h1 className="card-title">🆘 Reportar Emergencia</h1>
        <p className="card-subtitle">
          Selecciona el tipo de emergencia que necesitas reportar
        </p>
        {user && (
          <p>
            Reportando como: <strong>{user.nombre}</strong>
          </p>
        )}
      </div>

      {/* Descripción opcional */}
      <div className="card mb-20">
        <h3 className="card-subtitle">📝 Descripción (Opcional)</h3>
        <textarea
          className="form-control"
          placeholder="Describe brevemente la situación..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ resize: "vertical" }}
        />
      </div>

      {/* Botones de emergencia */}
      <div className="card">
        <h3 className="card-subtitle mb-20">
          Selecciona el tipo de emergencia:
        </h3>

        <div className="grid grid-3">
          <button
            onClick={() => createEmergency("bomberos")}
            className="btn btn-emergency bomberos"
            disabled={loading && selectedType === "bomberos"}
          >
            {loading && selectedType === "bomberos" ? (
              <div
                className="loading-spinner"
                style={{ width: "30px", height: "30px" }}
              ></div>
            ) : (
              <>
                🚒
                <br />
                <strong>BOMBEROS</strong>
                <br />
                <span style={{ fontSize: "14px" }}>
                  Incendios, rescates, emergencias técnicas
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => createEmergency("policia")}
            className="btn btn-emergency policia"
            disabled={loading && selectedType === "policia"}
          >
            {loading && selectedType === "policia" ? (
              <div
                className="loading-spinner"
                style={{ width: "30px", height: "30px" }}
              ></div>
            ) : (
              <>
                👮
                <br />
                <strong>POLICÍA</strong>
                <br />
                <span style={{ fontSize: "14px" }}>
                  Seguridad, delitos, orden público
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => createEmergency("ambulancia")}
            className="btn btn-emergency ambulancia"
            disabled={loading && selectedType === "ambulancia"}
          >
            {loading && selectedType === "ambulancia" ? (
              <div
                className="loading-spinner"
                style={{ width: "30px", height: "30px" }}
              ></div>
            ) : (
              <>
                🚑
                <br />
                <strong>AMBULANCIA</strong>
                <br />
                <span style={{ fontSize: "14px" }}>
                  Emergencias médicas, accidentes
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Información importante */}
      <div className="card mt-20">
        <h3 className="card-subtitle">ℹ️ Información Importante</h3>
        <div className="alert alert-warning">
          <ul style={{ textAlign: "left", margin: 0, paddingLeft: "20px" }}>
            <li>Tu ubicación será enviada automáticamente</li>
            <li>Un operador recibirá tu solicitud inmediatamente</li>
            <li>Mantén tu teléfono disponible para contacto</li>
            <li>
              En emergencias críticas, también llama directamente a los números
              de emergencia
            </li>
            <li>No uses esta función para falsas alarmas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyButton;
