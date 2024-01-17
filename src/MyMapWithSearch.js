import 'leaflet/dist/leaflet.css'
import { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { OpenCageAPIKey } from "./config"
import L from 'leaflet';

const MyMap = () => {
	const [center, setCenter] = useState([54.7261409, 55.947499])
	const ref = useRef()
	const [serchResult, setSearchResult] = useState()
	const mapRef = useRef(null);

	const customIcon = new L.Icon({
		iconUrl: 'путь_к_новому_изображению.png',
		iconSize: [32, 32], // Размер иконки
		iconAnchor: [16, 32], // Точка якоря иконки
		popupAnchor: [0, -32], // Точка появления всплывающего окна
	});

	const handleSearch = async () => {
		try {
			const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${ref.current.value}&key=${OpenCageAPIKey}`)
			const data = await response.json()
			if (data.results && data.results.length > 0) {
				const result = data.results[0].geometry
				setSearchResult(result)
				setCenter([result.lat, result.lng])
				console.log(serchResult)
				if (mapRef.current) {
          const map = mapRef.current;
          map.setView([result.lat, result.lng], 13);
        }
			} else {
				setSearchResult(null)
			}
		} catch (error) {
			console.error('Error fetching geocoding data:', error)
		}
	}

	return (
		<div className='colum'>
			<div>
				<input type="text" ref={ref} />
				<button onClick={handleSearch}>Search</button>
			</div>
			<div className='map'>
				<MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }} ref={mapRef}>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>

					<Marker position={center} icon={customIcon}>
						<Popup>
							Пример маркера с Leaflet в React.
						</Popup>
					</Marker>
				</MapContainer>
			</div>
		</div>
	)
}

export default MyMap
