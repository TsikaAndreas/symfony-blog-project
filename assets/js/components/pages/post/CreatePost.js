import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import Layout from "../../layout/Layout";
import Loading from "../../ui/Loading";
import ErrorMessage from "../../ui/ErrorMessage";
import "../../../../styles/components/pages/post/post.css";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "../../ui/Button";

const CreatePost = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});
	const Auth = useContext(AuthContext);
	const navigate = useNavigate();

	const validateForm = () => {
		const errors = {};

		if (title.trim().length < 5) {
			errors.title = "Title must be at least 5 characters long.";
		} else if (title.trim().length > 255) {
			errors.title = "Title cannot exceed 255 characters.";
		}

		if (content.trim().length < 10) {
			errors.content = "Content must be at least 10 characters long.";
		} else if (content.trim().length > 500) {
			// Assuming 10000 is the maximum limit for content
			errors.content = "Content cannot exceed 500 characters.";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);

		if (!validateForm()) {
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				"/api/posts",
				{
					title,
					content,
				},
				{
					headers: {
						Authorization: `Bearer ${Auth.token}`,
						"Content-Type": "application/json",
					},
				},
			);

			const successMessage =
				response?.data?.message || "Your post has been created.";
			Swal.fire("Success!", successMessage, "success").then(() => {
				navigate("/posts");
			});
		} catch (error) {
			const errorMessage = error.response?.data?.message || error.message;
			Swal.fire("Oops...", errorMessage, "error");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container">
				<h1 className="mb-4">Create New Post</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="title" className="form-label">
							Title
						</label>
						<input
							type="text"
							id="title"
							className={`form-control ${
								validationErrors.title ? "is-invalid" : ""
							}`}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						{validationErrors.title && (
							<div className="invalid-feedback">{validationErrors.title}</div>
						)}
					</div>
					<div className="mb-3">
						<label htmlFor="content" className="form-label">
							Content
						</label>
						<textarea
							id="content"
							className={`form-control ${
								validationErrors.content ? "is-invalid" : ""
							}`}
							rows="5"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						></textarea>
						{validationErrors.content && (
							<div className="invalid-feedback">{validationErrors.content}</div>
						)}
					</div>
					<Button
						label="Create Post"
						className="btn btn-primary"
						isSubmitType={true}
					/>
				</form>
				{error && <ErrorMessage message={error} />}
			</div>
		</Layout>
	);
};

export default CreatePost;
