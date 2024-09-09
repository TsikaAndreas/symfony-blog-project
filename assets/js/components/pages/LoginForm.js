import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";

const LoginForm = () => {
	const navigate = useNavigate();
	const loginReference = useRef(null);
	const passwordReference = useRef(null);
	const [isLoadingLogin, setIsLoadingLogin] = useState(false);
	const [errorLogin, setErrorLogin] = useState(null);
	const Auth = useContext(AuthContext);

	const performLogin = async () => {
		setErrorLogin(null);
		setIsLoadingLogin(true);

		const response = await axios
			.post(
				"/api/login",
				{
					username: loginReference.current?.value,
					password: passwordReference.current?.value,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			)
			.then(function (response) {
				const data = response.data;
				Auth.login(data.token);
				navigate("/posts", { replace: true });
			})
			.catch(function (error) {
				if (error.response.data.message) {
					setErrorLogin(error.response.data.message);
				} else {
					setErrorLogin(error.message);
				}
				setIsLoadingLogin(false);
			});
	};

	const onSubmitHandler = (event) => {
		event.preventDefault();
		performLogin();
	};

	return (
		<section className="vh-100">
			<div className="container py-5 h-100">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-12 col-md-8 col-lg-6 col-xl-6">
						<div className="card">
							<div className="row g-0">
								<div className="col-12 d-flex align-items-center">
									<div className="card-body p-4 p-lg-5 text-black">
										<form onSubmit={onSubmitHandler}>
											<div className="d-flex align-items-center mb-3 pb-1">
												<h1 className="fw-bold mb-0">Welcome!</h1>
											</div>

											{!!errorLogin && (
												<div className="text-danger">{errorLogin}</div>
											)}

											<h5
												className="fw-normal mb-3 pb-3"
												style={{ letterSpacing: "1px" }}
											>
												Sign into your account
											</h5>

											<div className="form-outline mb-4">
												<input
													type="text"
													className="form-control form-control-lg"
													placeholder="Username"
													ref={loginReference}
												/>
											</div>

											<div className="form-outline mb-4">
												<input
													type="password"
													className="form-control form-control-lg"
													placeholder="Password"
													ref={passwordReference}
												/>
											</div>

											<div className="pt-1 mb-4">
												<Button
													label={"Login"}
													isLoading={isLoadingLogin}
													isSubmitType={true}
												/>
											</div>
										</form>
										<div className="hint-box">
											<div>Hint:</div>
											<ul>
												<li>
													<strong>Usernames:</strong> <u>user1</u> &{" "}
													<u>user2</u>
												</li>
												<li>
													<strong>Password:</strong> <u>demo</u>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginForm;
