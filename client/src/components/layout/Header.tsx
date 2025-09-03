// src/components/layout/Header.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  return (
    <button
      onClick={loginWithGoogle}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-full shadow hover:bg-gray-50"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
}

export default function Header() {
  const { isAuthed, initial, email, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b h-14 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between h-full px-4 mx-auto max-w-screen-2xl">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="grid w-8 h-8 text-sm font-bold text-white bg-black rounded-full place-items-center">K</div>
          <span className="font-semibold">Mate</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/">K - Map</NavLink>
          <NavLink to="/buzz">K - Buzz</NavLink>
          <NavLink to="/trend">K - Trend</NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isAuthed ? (
            // 로그인 상태: 아바타 + 드롭다운(간단버전)
            <div className="relative group">
              <div className="grid w-8 h-8 text-sm font-bold text-white bg-blue-500 rounded-full cursor-pointer place-items-center">
                {initial}
              </div>
              <div className="absolute right-0 hidden p-2 mt-2 bg-white border rounded-lg shadow w-44 group-hover:block">
                <div className="px-2 py-1 text-xs text-gray-500">{email}</div>
                <hr className="my-2" />
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-left rounded hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            // 비로그인 상태: 구글 로그인 버튼
            <GoogleLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}