import type React from "react";

const Sidebar: React.FC = () => {
	const menuItems = [
		{ icon: "☰", label: "Menu" },
		{ icon: "🔖", label: "Bookmark" },
		{ icon: "📍", label: "K-Travel" },
		{ icon: "🍽️", label: "K-Food" },
		{ icon: "☕", label: "K-Cafe" },
	];

	return (
		<aside className="flex flex-col items-center w-16 py-4 space-y-4 bg-white border-r border-gray-200 shadow-sm">
			{menuItems.map((item, index) => (
				<button
					key={index}
					className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg hover:bg-gray-100 group"
					title={item.label}
				>
					<span className="text-lg">{item.icon}</span>
				</button>
			))}

			{/* Bottom section with additional tools */}
			<div className="flex-1" />
			<div className="space-y-2">
				<button className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg hover:bg-gray-100">
					<span className="text-sm font-bold">TIPS</span>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
