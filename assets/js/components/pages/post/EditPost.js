import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import Layout from "../../layout/Layout";
import Loading from "../../ui/Loading";
import ErrorMessage from "../../ui/ErrorMessage";
import "../../../../styles/components/pages/post/post.css";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "../../ui/Button";

const EditPost = () => {
	const { id } = useParams(); // Get the post ID from URL params
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});
	const Auth = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`/api/posts/${id}`, {
					headers: {
						Authorization: `Bearer ${Auth.token}`,
					},
				});
				const post = response.data;
				setTitle(post.title);
				setContent(post.content);
			} catch (error) {
				const errorMessage = error.response?.data?.message || error.message;
				Swal.fire("Oops...", errorMessage, "error");
				navigate("/posts");
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [id, Auth.token, navigate]);

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
			const response = await axios.put(
				`/api/posts/${id}`,
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
				response?.data?.message || "Your post has been updated.";
			Swal.fire("Success!", successMessage, "success").then(() => {
				navigate(`/posts/${id}`);
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
				<h1 className="mb-4">Edit Post</h1>
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
							rows="10"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						></textarea>
						{validationErrors.content && (
							<div className="invalid-feedback">{validationErrors.content}</div>
						)}
					</div>
					<Button
						label="Update Post"
						className="btn btn-primary"
						isSubmitType={true}
					/>
				</form>
				{error && <ErrorMessage message={error} />}
			</div>
		</Layout>
	);
};

export default EditPost;
