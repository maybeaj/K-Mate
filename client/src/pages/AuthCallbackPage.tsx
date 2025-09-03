import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function AuthCallbackPage() {
	const navigate = useNavigate();
	const { refresh } = useAuth();
	useEffect(() => {
		const p = new URLSearchParams(window.location.search);
		const t = p.get("token");
		if (t) {
			localStorage.setItem("access_token", t);
			refresh(); // 헤더가 즉시 갱신되도록
			navigate("/", { replace: true });
		} else {
			navigate("/login?error=token_missing", { replace: true });
		}
	}, [navigate, refresh]);

	return <div className="p-6">로그인 처리 중...</div>;
}
