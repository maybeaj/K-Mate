export type JwtPayload = {
	sub: number;
	email?: string;
	role?: string;
	iat?: number;
	exp?: number;
};

export function parseJwt<T = JwtPayload>(token?: string | null): T | null {
	if (!token) return null;
	try {
		const base64 = token.split(".")[1];
		const json = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(json) as T;
	} catch {
		return null;
	}
}
