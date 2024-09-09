import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import Layout from "../../layout/Layout";
import Loading from "../../ui/Loading";
import ErrorMessage from "../../ui/ErrorMessage";
import axios from "axios";
import Button from "../../ui/Button";
import "../../../../styles/components/pages/post/postlist.css";

const PostsList = () => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [limit] = useState(6); // Number of posts per page
	const Auth = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const didFetch = useRef(false); // To track if the fetch was made

	useEffect(() => {
		if (!didFetch.current) {
			// Only fetch if it's the first render
			const fetchPosts = async () => {
				setLoading(true);
				try {
					const response = await axios.get("/api/posts", {
						headers: {
							Authorization: `Bearer ${Auth.token}`,
						},
						params: {
							page,
							limit,
						},
					});
					setPosts(response.data.posts);
					setTotal(response.data.total);
				} catch (error) {
					setError(error.message);
				} finally {
					setLoading(false);
				}
			};

			fetchPosts();
			didFetch.current = true; // Set to true after fetching
		}
	}, [page, Auth.token, limit]); // Watch for changes in page or Auth token

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
			setPage(newPage);
			didFetch.current = false; // Allow fetching again when page changes
		}
	};

	if (loading) {
		return (
			<Layout>
				<Loading />
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

	// Calculate total pages
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const isFirstPage = page === 1;
	const isLastPage = page === totalPages;

	return (
		<Layout>
			<div className="container">
				<h1 className="mb-5">Posts List</h1>
				<div className="mb-4">
					<Button
						label="Create New Post"
						onClick={() => navigate("/posts/create")}
					/>
				</div>
				<div className="grid-container">
					{posts.map((post) => (
						<div className="grid-item" key={post.id}>
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">{post.title}</h5>
									<p className="card-text">{post.content}</p>
									<p className="card-text">
										<small className="text-muted">
											By {post.author.fullname}
										</small>
									</p>
									<p className="card-text">
										<small className="text-muted">
											Created at:{" "}
											{new Date(
												post.created_at.timestamp * 1000,
											).toLocaleDateString()}
										</small>
									</p>
								</div>
								<div className="card-footer">
									<Button
										label="Read more"
										className="btn btn-primary"
										onClick={() => navigate(`/posts/${post.id}`)}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="pagination mt-4">
					<Button
						label="Previous"
						onClick={() => handlePageChange(page - 1)}
						disabled={isFirstPage}
					/>
					<span className="mx-3">
						Page {page} of {totalPages}
					</span>
					<Button
						label="Next"
						onClick={() => handlePageChange(page + 1)}
						disabled={isLastPage}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default PostsList;
