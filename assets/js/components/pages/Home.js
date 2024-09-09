import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
	const user = useAuth();

	return (
		<div>
			{user ? (
				<h1>Welcome, {user.email}</h1>
			) : (
				<h1>Please login to continue</h1>
			)}
		</div>
	);
};

export default Home;
