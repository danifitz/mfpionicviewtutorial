function getPeople() {
	 	var input = {
			method: 'get',
			returnedContentType: 'json',
			path: '/?results=10'
		}
		return WL.Server.invokeHttp(input);
}

function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;

	return {
		authRequired: true,
		errorMessage: errorMessage
	};
}

function submitAuthentication(username, password){
	if (username==="user" && password === "password"){

		var userIdentity = {
				userId: username,
				displayName: username,
				attributes: {
					foo: "bar"
				}
		};

		WL.Server.setActiveUser("AuthRealm", userIdentity);

		return {
			authRequired: false
		};
	}

	return onAuthRequired(null, "Invalid login credentials");
}

function testApplicationAuthenticity() {
	return {
		result: "Success"
	};
}

function onLogout(){
	WL.Logger.debug("Logged out");
}
