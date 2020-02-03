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
    console.log('obtendo usuário')
}

function confirmaCadastroCognito(userName, code, callback) {
    console.log('confirmar cadastro')
}

function efetuarLoginCognito(userName, password, callback) {
    console.log('efetuando login')
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
