import { useEffect, useMemo, useState } from "react";
import { parseJwt } from "../../lib/jwt";

const TOKEN_KEY = "access_token";

export function useAuth() {
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem(TOKEN_KEY)
	);

	// 다른 탭/윈도우에서 로그아웃/로그인 반영
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === TOKEN_KEY) setToken(localStorage.getItem(TOKEN_KEY));
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	// 라우팅 중 새로고침 없이도 갱신하고 싶을 때 사용할 수 있는 공개 메서드
	const refresh = () => setToken(localStorage.getItem(TOKEN_KEY));

	const payload = useMemo(() => parseJwt(token), [token]);
	const email = payload?.email;
	const role = payload?.role ?? "user";

	const isAuthed = !!token && !!payload;

	const loginWithGoogle = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
	};

	// 이니셜(아바타 문자) 계산
	const initial = useMemo(() => {
		if (email) return (email[0] || "U").toUpperCase();
		return "U";
	}, [email]);

	return {
		token,
		isAuthed,
		email,
		role,
		initial,
		refresh,
		loginWithGoogle,
		logout,
	};
}
