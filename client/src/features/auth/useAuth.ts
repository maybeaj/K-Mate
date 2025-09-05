// src/features/auth/useAuth.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../api/client'

type User = { sub: number | string; email?: string; role?: 'user' | 'admin' }

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [ready, setReady] = useState(false)
	const didInitRef = useRef(false)

	const refresh = useCallback(async () => {
		try {
			const { data } = await api.get<User | null>('/auth/me') // 항상 200
			setUser(data ?? null)
		} catch {
			setUser(null) // 네트워크 에러 등
		} finally {
			setReady(true)
		}
	}, [])

	useEffect(() => {
		if (didInitRef.current) return
		didInitRef.current = true
		void refresh()
	}, [refresh])

	const loginWithGoogle = () => {
		const redirectUri = `${window.location.origin}/auth/callback`
		window.location.href = `${
			import.meta.env.VITE_API_URL
		}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
	}

	const logout = async () => {
		try {
			await api.post('/auth/logout') // 204 기대
		} finally {
			setUser(null)
			setReady(true)
		}
	}

	const isAuthed = !!user
	const email = user?.email
	const role = user?.role ?? 'user'
	const initial = useMemo(() => (email ? (email[0] || 'U').toUpperCase() : 'U'), [email])

	return { user, isAuthed, ready, email, role, initial, refresh, loginWithGoogle, logout }
}
