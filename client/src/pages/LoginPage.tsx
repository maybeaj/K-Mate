import GoogleLoginButton from '../components/common/GoogleLoginButton'
import { useMemo } from 'react'

export default function LoginPage() {
	const msg = useMemo(() => {
		const q = new URLSearchParams(window.location.search)
		const err = q.get('error')
		if (err === 'oauth_failed') return '로그인에 실패했습니다. 다시 시도해주세요.'
		return ''
	}, [])

	return (
		<div className="p-6 space-y-4">
			{msg && <div className="text-red-600">{msg}</div>}
			<GoogleLoginButton />
		</div>
	)
}
