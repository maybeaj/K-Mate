export default function GoogleLoginButton() {
	const handleLogin = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
	};

	return (
		<button
			onClick={handleLogin}
			className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-full shadow hover:bg-gray-50"
		>
			{/* Google Logo */}
			<img
				src="https://developers.google.com/identity/images/g-logo.png"
				alt="Google"
				className="w-5 h-5"
			/>
			Continue with Google
		</button>
	);
}
