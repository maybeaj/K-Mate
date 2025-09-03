import { useEffect, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";

declare global {
	interface Window {
		google?: any;
		initMap?: () => void;
	}
}

export default function HomePage() {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
			| string
			| undefined;

		const createMap = () => {
			if (!mapRef.current || !window.google?.maps) return;

			const map = new window.google.maps.Map(mapRef.current, {
				center: { lat: 37.5665, lng: 126.978 }, // Seoul
				zoom: 12,
				styles: [
					{
						featureType: "all",
						elementType: "geometry.fill",
						stylers: [{ color: "#f5f5f5" }],
					},
					{
						featureType: "water",
						elementType: "geometry",
						stylers: [{ color: "#c9c9c9" }],
					},
				],
				mapTypeControl: false,
				streetViewControl: false,
				fullscreenControl: false,
			});

			const markers = [
				{ lat: 37.5665, lng: 126.978, number: "1" },
				{ lat: 37.5505, lng: 126.988, number: "2" },
				{ lat: 37.5825, lng: 126.968, number: "3" },
				{ lat: 37.5445, lng: 126.958, number: "4" },
				{ lat: 37.5705, lng: 126.998, number: "5" },
				{ lat: 37.5385, lng: 126.948, number: "1" },
				{ lat: 37.5945, lng: 126.988, number: "2" },
				{ lat: 37.5285, lng: 126.938, number: "3" },
			];

			markers.forEach((m) => {
				new window.google.maps.Marker({
					position: { lat: m.lat, lng: m.lng },
					map,
					icon: {
						url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#4285f4" stroke="white" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${m.number}</text>
            </svg>
            `)}`,
						scaledSize: new window.google.maps.Size(40, 40),
					},
				});
			});
		};

		// 이미 로드되어 있으면 바로 생성
		if (window.google?.maps) {
			createMap();
			return;
		}

		// 스크립트 중복 주입 방지
		const existing = document.getElementById(
			"google-maps-api"
		) as HTMLScriptElement | null;
		if (existing) {
			// callback 대기 상태라면 콜백에 연결
			window.initMap = () => createMap();
			return;
		}

		// 키 없으면 경고만 찍고 종료
		if (!API_KEY) {
			console.warn("VITE_GOOGLE_MAPS_API_KEY 가 설정되지 않았습니다.");
			return;
		}

		// 스크립트 주입
		const script = document.createElement("script");
		script.id = "google-maps-api";
		script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
		script.async = true;
		script.defer = true;

		// 전역 콜백
		window.initMap = () => createMap();

		document.head.appendChild(script);

		// cleanup: 이 화면 전용으로 추가했을 때만 제거
		return () => {
			script.parentNode?.removeChild(script);
			delete window.initMap;
		};
	}, []);

	return (
		<div>
			{/* 헤더 아래 전영역 고정 & 좌우 레이아웃 */}
			<div className="fixed inset-x-0 bottom-0 flex top-14">
				{/* 왼쪽 사이드바 (고정 폭) */}
				<div className="w-16 bg-white border-r shrink-0">
					<Sidebar />
				</div>

				{/* 오른쪽 지도 영역 */}
				<div className="relative flex-1">
					<div ref={mapRef} className="absolute inset-0" />
				</div>
			</div>
		</div>
	);
}
