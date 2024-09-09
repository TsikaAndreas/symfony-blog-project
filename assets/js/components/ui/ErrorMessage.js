import React from "react";
import "../../../styles/components/ui/errormessage.css";

const ErrorMessage = ({ message }) => (
	<div className="error-container">
		<p className="error-text">Error: {message}</p>
	</div>
);

export default ErrorMessage;
