var userPool
var cognitoUser

//obter dados de conexao com o cognito a partir do localstorage
function getPoolData() {
    return {
        UserPoolId: localStorage['aws-congnito-user-pool-id'],
        ClientId: localStorage['aws-congnito-app-id']
    }
}

function getUserPool() {
    if (userPool == undefined) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(getPoolData())
    }
    return userPool
}

function cadastrarCognito(userName, name, userEmail, userPassword, callback) {
    let dataEmail = {
        Name: 'email',
        Value: userEmail
    }

    let dataName = {
        Name: 'preferred_username',
        Value: userName
    }

    let dataPersonName = {
        Name: 'name',
        Value: name
    }

    let attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail),
        new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonName),
        new AmazonCognitoIdentity.CognitoUserAttribute(dataName)
    ]

    let userPool = getUserPool()
    userPool.signUp(userName, userPassword, attributeList, null, function(
        err,
        result
    ) {
        if (err) {
            callback(err, null)
        } else {
            cognitoUser = result.user
            callback(null, result)
        }
    })
}

function getUser(userName) {
    if (cognitoUser == undefined) {
        var userData = {
            Username: userName,
            Pool: getUserPool()
        }
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    }

    return cognitoUser
}

function confirmaCadastroCognito(userName, code, callback) {
    getUser(userName).confirmRegistration(code, true, callback)
}

function efetuarLoginCognito(userName, password, callback) {
    let authenticationData = {
        Username: userName,
        Password: password
    }
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    )

    getUser(userName).authenticateUser(
        authenticationDetails,
        tratarCallback(callback)
    )
}

function efetuarLogoutCognito(callback) {
    console.log('efetuando logout')
}

function apagarUsuarioCognito(callback) {
    console.log('apagando usuário')
}

function trocarSenhaCognito(oldPassword, newPassword, callback) {
    console.log('trocando senha')
}

function esqueciSenhaCognito(userName, callback) {
    console.log('esqueci senha')
}

function confirmarEsqueciSenha(userName, code, newPassword, callback) {
    console.log('confirmar esqueci senha')
}

function consultarDadosUsuario(updateCallback) {
    console.log('consultar dados usuário')
}

function tratarCallback(callback) {
    return {
        onFailure: err => {
            callback(err, null)
        },
        onSuccess: result => {
            callback(null, result)
        }
    }
}
