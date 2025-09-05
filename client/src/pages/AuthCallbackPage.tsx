// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

export default function AuthCallbackPage() {
	const navigate = useNavigate()
	const { refresh } = useAuth()

	useEffect(() => {
		;(async () => {
			await refresh() // ✅ 쿠키 세션 확인
			const to = sessionStorage.getItem('post_login_redirect') || '/'
			sessionStorage.removeItem('post_login_redirect')
			navigate(to, { replace: true })
		})()
	}, [refresh, navigate])

	return <div className="p-6">로그인 처리 중...</div>
}
