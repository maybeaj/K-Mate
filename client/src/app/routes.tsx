import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import HomePage from "../pages/HomePage";
import AuthCallbackPage from "../pages/AuthCallbackPage";

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/auth/callback" element={<AuthCallbackPage />} />
				{/* 필요한 페이지 추가 가능 */}
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
