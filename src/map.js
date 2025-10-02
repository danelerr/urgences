window.map = null;
window.selectedLocation = null;
window.currentLocationMarker = null;
window.selectingLocation = false;
window.mapReady = false;

function initMap() {
    window.map = new maplibregl.Map({
        container: 'mapContainer',
        style: {
            "version": 8,
            "sources": {
                "osm": {
                    "type": "raster",
                    "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    "tileSize": 256,
                    "attribution": "© OpenStreetMap contributors"
                }
            },
            "layers": [{
                "id": "osm",
                "type": "raster",
                "source": "osm"
            }]
        },
        center: [-74.006, 40.7128],
        zoom: 13
    });

    window.map.on('load', () => {
        addEmergencyMarkers();
        window.map.on('click', handleMapClick);
        window.mapReady = true;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const center = [position.coords.longitude, position.coords.latitude];
                window.map.setCenter(center);
            });
        }
    });
}

function addEmergencyMarkers() {
    let emergenciesToShow = window.emergencies;
    
    if (window.currentUser) {
        if (window.currentUser.tipo === 'operador') {
            emergenciesToShow = window.emergencies.filter(e => e.estado !== 'resuelto');
        } else if (['bombero', 'policia', 'ambulancia'].includes(window.currentUser.tipo)) {
            const tipoMap = {
                'bombero': 'bomberos',
                'policia': 'policia', 
                'ambulancia': 'ambulancia'
            };
            emergenciesToShow = window.emergencies.filter(e => 
                e.tipo === tipoMap[window.currentUser.tipo] && e.estado !== 'resuelto'
            );
        } else if (window.currentUser.tipo === 'ciudadano') {
            emergenciesToShow = window.emergencies.filter(e => e.estado !== 'resuelto');
        }
    }

    emergenciesToShow.forEach(emergency => {
        const el = document.createElement('div');
        el.className = 'emergency-marker';
        el.innerHTML = window.getEmergencyEmoji(emergency.tipo);
        el.style.cssText = `
            width: 30px;
            height: 30px;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${window.getEmergencyColor(emergency.tipo)};
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        
        const marker = new maplibregl.Marker(el)
            .setLngLat([emergency.lng, emergency.lat])
            .setPopup(new maplibregl.Popup({ offset: 25 })
                .setHTML(`<strong>${window.getEmergencyEmoji(emergency.tipo)} ${emergency.descripcion}</strong><br>Estado: ${emergency.estado}`))
            .addTo(window.map);
    });
}

function handleMapClick(e) {
    if (window.selectingLocation) {
        const lat = e.lngLat.lat;
        const lng = e.lngLat.lng;
        
        window.selectedLocation = { lat, lng };
        
        addLocationMarker(lat, lng, false);
        window.updateLocationDisplay();
        updateLocationInfo(lat, lng);
        
        window.selectingLocation = false;
        window.hideClickIndicator();
        
        if (window.map) {
            const mapElement = window.map.getContainer();
            mapElement.style.cursor = '';
            mapElement.classList.remove('selecting-location');
        }
        
        showLocationSelectedNotification();
    }
}

function showLocationSelectedNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 1001;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        border: 3px solid rgba(255,255,255,0.2);
        text-align: center;
        font-size: 16px;
        animation: slideInDown 0.5s ease-out;
    `;
    notification.innerHTML = `
        ✅ ¡Ubicación seleccionada!<br>
        <small style="opacity: 0.9;">Coordenadas guardadas correctamente</small>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 2500);
}

window.updateMapMarkers = function() {
    if (!window.mapReady || !window.map) return;
    
    const existingMarkers = document.querySelectorAll('.emergency-marker');
    existingMarkers.forEach(marker => {
        const parent = marker.closest('.maplibregl-marker');
        if (parent) {
            parent.remove();
        }
    });
    
    addEmergencyMarkers();
}

window.getEmergencyColor = function(tipo) {
    const colors = {
        bomberos: '#ff4444',
        policia: '#28a745',
        ambulancia: '#44ff44'
    };
    return colors[tipo] || '#666666';
}

window.openGoogleMaps = function(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

window.getCurrentLocation = function() {
    if (!navigator.geolocation) {
        alert('Geolocalización no soportada en este navegador');
        return;
    }

    if (!window.mapReady || !window.map) {
        alert('El mapa se está cargando. Por favor, espera unos segundos e intenta de nuevo.');
        return;
    }

    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.innerHTML = '🔄 Obteniendo ubicación...';
        locationInfo.style.display = 'block';
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            window.selectedLocation = { lat, lng };
            
            try {
                window.map.flyTo({
                    center: [lng, lat],
                    zoom: 17,
                    duration: 2000
                });
                
                setTimeout(() => {
                    addLocationMarker(lat, lng, true);
                }, 1000);
                
            } catch (mapError) {
                alert('Error al centrar el mapa en tu ubicación');
            }
            
            updateLocationInfo(lat, lng);
        },
        error => {
            let errorMessage = 'Error desconocido';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Permiso denegado para acceder a la ubicación';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Información de ubicación no disponible';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Tiempo de espera agotado al obtener la ubicación';
                    break;
            }
            
            if (locationInfo) {
                locationInfo.innerHTML = '❌ ' + errorMessage;
            }
            alert('Error al obtener ubicación: ' + errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 30000
        }
    );
}

function addLocationMarker(lat, lng, isCurrentLocation = false) {
    if (!window.mapReady || !window.map) {
        showMarkerInUI(lat, lng, isCurrentLocation);
        return;
    }
    
    try {
        if (window.currentLocationMarker) {
            window.currentLocationMarker.remove();
        }
        
        const el = document.createElement('div');
        el.className = 'location-marker';
        
        if (isCurrentLocation) {
            el.innerHTML = '📍';
            el.style.cssText = `
                width: 30px;
                height: 30px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
            `;
        } else {
            el.innerHTML = '📍';
            el.style.cssText = `
                width: 30px;
                height: 30px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
                color: #e74c3c;
            `;
        }
        
        window.currentLocationMarker = new maplibregl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(window.map);
        
    } catch (error) {
        showMarkerInUI(lat, lng, isCurrentLocation);
    }
}

function showMarkerInUI(lat, lng, isCurrentLocation) {
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        const emoji = isCurrentLocation ? '📍' : '📍';
        const type = isCurrentLocation ? 'Tu ubicación' : 'Ubicación seleccionada';
        locationInfo.innerHTML = `${emoji} ${type}: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        locationInfo.style.display = 'block';
    }
}

window.updateLocationInfo = function(lat, lng) {
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.innerHTML = `📍 Ubicación: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

window.updateLocationDisplay = function() {
    const display = document.getElementById('selectedLocationDisplay');
    if (display && window.selectedLocation) {
        display.innerHTML = `
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; 
                        padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                ✅ Ubicación seleccionada<br>
                📍 Lat: ${window.selectedLocation.lat.toFixed(6)}<br>
                📍 Lng: ${window.selectedLocation.lng.toFixed(6)}
            </div>
        `;
        display.style.display = 'block';
    }
}

window.startLocationSelection = function() {
    if (!window.mapReady || !window.map) {
        alert('El mapa se está cargando. Por favor, espera unos segundos e intenta de nuevo.');
        return;
    }
    
    window.selectingLocation = true;
    window.showClickIndicator();
    
    const mapElement = window.map.getContainer();
    mapElement.style.cursor = 'crosshair';
    mapElement.classList.add('selecting-location');
    
    window.selectedLocation = null;
    
    if (window.currentLocationMarker) {
        window.currentLocationMarker.remove();
        window.currentLocationMarker = null;
    }
}

window.showClickIndicator = function() {
    window.hideClickIndicator();
    
    const indicator = document.createElement('div');
    indicator.id = 'clickIndicator';
    indicator.className = 'map-click-indicator';
    indicator.innerHTML = `
        <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 12px 20px; 
                    border-radius: 20px; position: fixed; bottom: 100px; left: calc(50% - 140px); 
                    z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    font-weight: bold; text-align: center; width: 280px;
                    border: 2px solid rgba(255,255,255,0.2);">
            <div style="font-size: 16px; margin-bottom: 5px;">📍 Haz clic en el mapa</div>
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">Selecciona la ubicación</div>
            <button onclick="window.cancelLocationSelection()" style="background: rgba(255,255,255,0.9); color: #e74c3c; 
                    border: none; padding: 6px 14px; border-radius: 15px; margin-top: 3px; 
                    font-size: 11px; cursor: pointer; font-weight: bold; transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);"
                    onmouseover="this.style.background='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                ❌ Cancelar
            </button>
        </div>
    `;
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        const indicatorDiv = indicator.querySelector('div');
        if (indicatorDiv) {
            indicatorDiv.style.animation = 'pulse 2s infinite';
        }
    }, 100);
}

window.hideClickIndicator = function() {
    const indicator = document.getElementById('clickIndicator');
    if (indicator) {
        indicator.remove();
    }
}

window.cancelLocationSelection = function() {
    window.selectingLocation = false;
    window.hideClickIndicator();
    
    if (window.mapReady && window.map) {
        const mapElement = window.map.getContainer();
        mapElement.style.cursor = '';
        mapElement.classList.remove('selecting-location');
    }
    
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo && !window.selectedLocation) {
        locationInfo.innerHTML = '';
        locationInfo.style.display = 'none';
    }
}