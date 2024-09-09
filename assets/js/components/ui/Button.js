import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({
	label,
	isLoading = false,
	isSubmitType = false,
	onClick = () => {},
	className = "",
}) => {
	const defaultClasses = "btn btn-dark btn-lg btn-block";

	return (
		<button
			className={classNames(className || defaultClasses, {
				"is-loading": isLoading,
			})}
			type={isSubmitType ? "submit" : "button"}
			onClick={onClick}
			disabled={isLoading} // Disables the button while loading
		>
			{isLoading ? (
				<span
					className="spinner-border spinner-border-sm"
					role="status"
					aria-hidden="true"
				></span>
			) : (
				label
			)}
		</button>
	);
};

Button.propTypes = {
	label: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	isSubmitType: PropTypes.bool,
	onClick: PropTypes.func,
	className: PropTypes.string, // Added className prop validation
};

export default Button;
