import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/pages/LoginForm";
import PostsList from "./components/pages/post/PostsList";
import Post from "./components/pages/post/Post"; // Import the Post component
import AuthContext from "./contexts/AuthContext";
import CreatePost from "./components/pages/post/CreatePost";
import EditPost from "./components/pages/post/EditPost";

const App = () => {
	const Auth = useContext(AuthContext);

	return (
		<Routes>
			{/* Redirect based on authentication status */}
			<Route
				path="/"
				element={
					Auth.isLoggedIn ? (
						<Navigate to="/posts" replace />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>

			{/* Login route */}
			<Route
				path="/login"
				element={
					Auth.isLoggedIn ? <Navigate to="/posts" replace /> : <LoginForm />
				}
			/>

			{/* Wildcard route */}
			<Route path="*" element={<Navigate to="/" replace />} />

			{/* Protected Routes */}
			{Auth.isLoggedIn && (
				<>
					<Route path="/posts" element={<PostsList />} />
					<Route path="/posts/:id" element={<Post />} />
					<Route path="/posts/create" element={<CreatePost />} />
					<Route path="/posts/:id/edit" element={<EditPost />} />
				</>
			)}
		</Routes>
	);
};

export default App;
