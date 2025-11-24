import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPicker = ({ onLocationSelect, initialPosition = [30.0444, 31.2357] }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView(initialPosition, 13);
        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add marker on click
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            // Remove existing marker
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
            }

            // Add new marker
            const marker = L.marker([lat, lng]).addTo(map);
            markerRef.current = marker;

            // Reverse geocoding using Nominatim API
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    marker.bindPopup(address).openPopup();

                    if (onLocationSelect) {
                        onLocationSelect(address, { lat, lng });
                    }
                })
                .catch(() => {
                    const coords = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    marker.bindPopup(coords).openPopup();

                    if (onLocationSelect) {
                        onLocationSelect(coords, { lat, lng });
                    }
                });
        });

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-96 rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner"
        />
    );
};

export default MapPicker;
