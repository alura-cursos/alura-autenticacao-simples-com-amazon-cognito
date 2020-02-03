//obter dados de conexao com o cognito a partir do localstorage
function getPoolData() {
    return {
        UserPoolId: localStorage['aws-congnito-user-pool-id'],
        ClientId: localStorage['aws-congnito-app-id']
    }
}

var userPool
function getUserPool() {
    if (userPool === undefined) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(getPoolData())
    }
    return userPool
}

var cognitoUser
function getUser(userName) {
    if (cognitoUser === undefined) {
        var userData = {
            Username: userName,
            Pool: getUserPool()
        }
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    }
    return cognitoUser
}

function efetuarLoginCognito(userName, password, callback) {
    let authenticationData = {
        Username: userName,
        Password: password
    }
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    )

    getUser(userName).authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.info(result)
            document.getElementById('responsediv').innerHTML = JSON.stringify(
                result,
                undefined,
                2
            )
        },

        onFailure: function(err) {
            console.info(err)
            document.getElementById('responsediv').innerHTML = JSON.stringify(
                err,
                undefined,
                2
            )
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            cognitoUser.completeNewPasswordChallenge(
                password,
                requiredAttributes,
                this
            )
        }
    })
}
