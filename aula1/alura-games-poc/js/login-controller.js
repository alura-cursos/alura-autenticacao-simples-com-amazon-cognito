var user = {
	name: "",
	email: "",
	email_verified: "false",
	status: "",
	update: function (userInfo) {
		for (key in userInfo){
			if (this[key] != undefined){
				this[key] = userInfo[key];
			}
		}		
	}
};

//redenderizar credênciais Cognito armazenadas no localStorage
function renderizarCredenciaisCognitoSalvasNoLocalStorage() {
	if ((localStorage["aws-congnito-user-pool-id"] !== undefined) &&
		(localStorage["aws-congnito-app-id"] !== undefined)) {
			$("#cognitoUserPoolId").val(localStorage["aws-congnito-user-pool-id"]);
			$("#applicationId").val(localStorage["aws-congnito-app-id"]);
		}
	$("#modalCredenciaisCognito").modal();
}

//salvar credênciais Cognito no localStorage
function salvarCredenciaisCognitoSalvasNoLocalStorage() {
	let userPoolId =  $("#cognitoUserPoolId").val();
	localStorage.setItem("aws-congnito-user-pool-id", userPoolId);
	let appId =  $("#applicationId").val();
	localStorage.setItem("aws-congnito-app-id", appId);
}

//limpar credênciais Cognito do localStorage
function apagarCredenciaisCognitoSalvasNoLocalStorage(){
	localStorage.removeItem("aws-congnito-user-pool-id");
	localStorage.removeItem("aws-congnito-app-id");
	$("#cognitoUserPoolId").val("");
	$("#applicationId").val("");	
}

//chavear visibilidade de componente
function visibility(divElementId, show=false){
	let divElement = document.getElementById(divElementId);
	if (show){
		divElement.style.display = "block";
	}
	else {
        divElement.style.display = "none";
	}
}

//exibir alerta
function exibirAlerta(alertType, message){
	$("#operationAlert span").remove();
	$("#operationAlert").attr('class', "alert alert-" + alertType);
	$("#operationAlert button").after('<span>' + message +'</span>');
	$("#operationAlert").fadeIn('slow');
	$("#operationAlert").show();
}

//fechar alerta
function fecharAlerta(){
	$("#operationAlert span").remove();
	$("#operationAlert").hide();
}

//criação de callback padrão para todas as operações
function criarCallBack(successMessage, userName="", email="", confirmed="", status=""){
	return (err, result)=>{
		if (err){
			message = "<strong>" + err.name + "</strong>: " + err.message;
			exibirAlerta('danger', message);
		}
		else
		{
			user.update({name: userName,
						email: email,
						email_verified: confirmed,
						status: status});
			message = "<strong>Successo</strong>: " + successMessage;
			exibirAlerta('success', message);
			consultarDadosUsuario(updateTable);
		}
	};
}

//modal padrão para input de informações
function modalFormulario(){
	let buttonText = $("#modalFormButton").text(); 
	let username = $("#userName").val();
	let name = $("#name").val();
	let email =  $("#userEmail").val();
	let code =  $("#userConfirmationCode").val();
	let password =  $("#userPassword").val();
	let newPassword = $("#newUserPassword").val();
	
	let callback;
	let message;
	switch (buttonText){
	case "cadastrarUsuario":
		message = `Usuário <i>${username}</i> cadastrado!`;
		callback = criarCallBack(message, username, email, "No", "Cadastrado");	
		cadastrarCognito(username,name, email, password, callback);
		break;
	
	case "confirmarCadastro":
		message = `Usuário <i>${username}</i> confirmou o e-mail ${email}`;
		callback = criarCallBack(message, username, user.email, "true", "Confirmado");		
		confirmaCadastroCognito(username, code, callback); 
		break;
	
	case "efetuarLogin":
		message = `Usuário <i>${username}</i> logado`;
		callback = criarCallBack(message, username, "", "true", "Logado");			
		efetuarLoginCognito(username, password, callback);
		break;
	
	case "trocarSenha":
		message = `senha do usuário <i>${user.name}</i> alterada com sucesso!`;
		callback = criarCallBack(message, user.name, 
		                          user.email, user.email_verified, "Senha alterada");

		trocarSenhaCognito(password, newPassword, callback);
		break;
	
	case "esqueciSenha":esqueciSenha
		message = `Código de confirmação para reset de senha enviado para o e-mail de: <i>${user.name}</i>`;
		callback = criarCallBack(message, username, 
		                          "", "", "Código de confirmação para reset");

		esqueciSenhaCognito(username, callback);

		configurarModalFormulario(true, false, false, false, true, true, "confirmarEsqueciSenha", 
					"Senha resetada")
		return ; // keep the modal visible

	case "confirmarEsqueciSenha":
		message = `Usuário <i>${user.name}</i> confirmou que esqueceu senha`;
		callback = criarCallBack(message, user.name, 
		                          "", "true", "Nova senha");

		confirmarEsqueciSenha(username, code, newPassword, callback);
		break	

	}
	$("#addUserModal").modal('hide');
}

//atualizar campos a serem exibidos no modal configurarModalFormulario(true,false,false, true, false, false, "efetuarLogin", "Efetuar login");
function configurarModalFormulario(showUserName,showName, showEmail, showPassword, showNewPassword, showConfirm, buttonText, title){
	visibility("userNameDiv", true);
	visibility("nameDiv", false);
	visibility("userEmailDiv", false);
	if (showNewPassword){
		visibility("userNewPasswordDiv", true);
		$("#passwordLabel").text("Senha atual"); 
	}
	else{
		visibility("userNewPasswordDiv", false);
		$("#passwordLabel").text("Password"); 
	}
	visibility("userPasswordDiv", showPassword);
	visibility("confirmationCode", showConfirm);
	$("#modalFormButton").text(buttonText);
	$("#addUserModalLabel").text(title);
	$("#addUserModal").modal();
}

//chavear entre exibir ou ocultar senha
function toggleShowPassword(checkBoxId, inputId){
	if ($("#" + checkBoxId).is(":checked")) {
		$("#" + inputId).prop("type", "text");
	}
	else{
		$("#" + inputId).prop("type", "password");
	}
}


//login
function efetuarLogin() {

	let username = $("#userName").val();
	let password =  $("#userPassword").val();
	console.info(username);
	console.info(password);
	message = `Usuário <i>${username}</i> logado`;
		callback = criarCallBack(message, username, "", "true", "Logado");			
		efetuarLoginCognito(username, password, callback);
}

//renderizar atributos do usuário logado
function renderizarAtributosUsuarioLogado(attributes){
	$("#userAttributesTableBody tr").remove();
	let table =  document.getElementById("userAttributesTableBody");
	for (key in attributes){
		let row = table.insertRow(-1);
		let nameCell = row.insertCell(0);
		nameCell.innerHTML = key;
		let valueCell = row.insertCell(1);
		valueCell.innerHTML = attributes[key];
	}
}


//renderizar status de usuário conforme operação realizada
function updateTable(userInfo) {
	user.update(userInfo);
	$("#userNameCell").html(user.name);
	$("#userEmailCell").html(user.email);
	if (user.email_verified=="true"){
		$("#userConfirmedCell").html("Yes");
	}
	else {
		if (user.name){
			$("#userConfirmedCell").html("No");
		}
		else {
			$("#userConfirmedCell").html("");			
		}
	}	
	$("#userStatusCell").html(user.status);			

	renderizarAtributosUsuarioLogado(userInfo);
}