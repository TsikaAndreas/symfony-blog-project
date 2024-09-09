import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import Layout from "../../layout/Layout";
import Loading from "../../ui/Loading";
import ErrorMessage from "../../ui/ErrorMessage";
import "../../../../styles/components/pages/post/post.css";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "../../ui/Button";

const Post = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const Auth = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const didFetch = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Only fetch if this is the first render
		if (!didFetch.current) {
			getPostApi();
			didFetch.current = true;
		}
	}, []);

	const getPostApi = async () => {
		try {
			const response = await fetch(`/api/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${Auth.token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch post with ID ${id}`);
			}
			const data = await response.json();
			setPost(data);
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	const handleDelete = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.delete(`/api/posts/${id}`, {
						headers: {
							Authorization: `Bearer ${Auth.token}`,
						},
					})
					.then((response) => {
						const successMessage =
							response?.data?.message || "Your post has been deleted.";
						Swal.fire("Deleted!", successMessage, "success").then(() => {
							navigate("/posts");
						});
					})
					.catch((error) => {
						const errorMessage = error.response?.data?.message || error.message;
						Swal.fire("Oops...", errorMessage, "error");
					});
			}
		});
	};

	if (loading) {
		return (
			<Layout>
				<Loading />;
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<ErrorMessage message={error} />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="post-container">
				<h1 className="post-title">{post.title}</h1>
				<div className="post-card">
					<div className="post-card-body">
						<p className="post-content">{post.content}</p>
						<p className="post-author">
							<small className="text-muted">By {post.author.fullname}</small>
						</p>
						<p className="post-date">
							<small className="text-muted">
								Created at:{" "}
								{new Date(
									post.created_at.timestamp * 1000,
								).toLocaleDateString()}
							</small>
						</p>
						<div className="post-actions">
							<Button
								label="Delete Post"
								className={"btn btn-danger"}
								onClick={handleDelete}
							/>

							<Button
								label="Edit Post"
								className={"btn btn-success"}
								onClick={() => navigate(`/posts/${id}/edit`)}
							/>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Post;
