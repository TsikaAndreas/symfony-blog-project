import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {
	return (
		<React.Fragment>
			<Header />
			<main className="mb-5 mt-3 flex-shrink-0">{props.children}</main>
			<Footer />
		</React.Fragment>
	);
};

export default Layout;
