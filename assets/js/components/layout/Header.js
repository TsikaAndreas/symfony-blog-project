import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import AuthContext from "../../contexts/AuthContext";
import "../../../styles/components/layout/header.css";
import Button from "../ui/Button";

const Header = () => {
	const Auth = useContext(AuthContext);
	const navigate = useNavigate();

	const logout = () => {
		Auth.logout();
		navigate("/login");
	};

	return (
		<header className="header-container">
			<div className="header-content">
				<div className="header-links">
					<a href="/" className="header-home-link">
						<span className="header-title">Home</span>
					</a>
				</div>

				<Button
					label="Logout"
					className={"header-logout-btn"}
					onClick={logout}
				/>
			</div>
		</header>
	);
};

export default Header;
