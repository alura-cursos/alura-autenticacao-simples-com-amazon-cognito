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
    console.log('obtendo usuário')
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
