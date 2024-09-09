import React from "react";
import "../../../styles/components/ui/loading.css";

const Loading = () => (
	<div className="loading-container">
		<div className="spinner"></div>
		<p className="loading-text">Loading...</p>
	</div>
);

export default Loading;
