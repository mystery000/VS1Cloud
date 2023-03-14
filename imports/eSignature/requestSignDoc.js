const docusign = require('docusign-esign');
const signingViaEmail = require('./signingViaEmail');
const prompt = require('prompt-sync')();
const docuSignConfig = require('./docuSignConfig.json');


const SCOPES = [
    "signature", "impersonation"
];

function getConsent() {
    var urlScopes = SCOPES.join('+');

    // Construct consent URL
    var redirectUri = "https://developers.docusign.com/platform/auth/consent";
    var consentUrl = `${docuSignConfig.dsOauthServer}/oauth/auth?response_type=code&` +
        `scope=${urlScopes}&client_id=${docuSignConfig.dsJWTClientId}&` +
        `redirect_uri=${redirectUri}`;

    let consentGranted = prompt("");
    if (consentGranted == "1") {
        return true;
    } else {
        console.error("Please grant consent!");
        process.exit();
    }
}

async function authenticate() {
    const jwtLifeSec = 10 * 60, // requested lifetime for the JWT is 10 min
        dsApi = new docusign.ApiClient();
    dsApi.setOAuthBasePath('https://account-d.docusign.com'.replace('https://', '')); // it should be domain only.
    const rsaKey = Assets.getText('private.key');

    try {
        const results = await dsApi.requestJWTUserToken(docuSignConfig.dsJWTClientId,
            docuSignConfig.impersonatedUserGuid, SCOPES, rsaKey,
            jwtLifeSec);
        const accessToken = results.body.access_token;

        // get user info
        const userInfoResults = await dsApi.getUserInfo(accessToken);

        // use the default account
        let userInfo = userInfoResults.accounts.find(account =>
            account.isDefault === "true");

        return {
            accessToken: results.body.access_token,
            apiAccountId: userInfo.accountId,
            basePath: `${userInfo.baseUri}/restapi`
        };
    } catch (e) {
        let body = e.response && e.response.body;
        // Determine the source of the error
        if (body) {
            // The user needs to grant consent
            if (body.error && body.error === 'consent_required') {
                if (getConsent()) { return authenticate(); };
            } else {
                // Consent has been granted. Show status code for DocuSign API error
                this._debug_log(`\nAPI problem: Status code ${e.response.status}, message body:
        ${JSON.stringify(body, null, 4)}\n\n`);
            }
        }
    }
}

function getArgs(apiAccountId, accessToken, basePath, signerEmail, signerName) {
    // signerEmail = prompt("Enter the signer's email address: ");
    // signerName = prompt("Enter the signer's name: ");
    // ccEmail = prompt("Enter the carbon copy's email address: ");
    // ccName = prompt("Enter the carbon copy's name: ");

    const envelopeArgs = {
        signerEmail: signerEmail,//"atlass.follower@proton.me"
        signerName: signerName,//"Daniel1"
        ccEmail: "atlas.follower@proton.me",
        ccName: "Daniel2",
        status: "sent",
        // docFile: docfile,
        docFile: './tmpDocs/output.pdf',
    };
    const args = {
        accessToken: accessToken,
        basePath: basePath,
        accountId: apiAccountId,
        envelopeArgs: envelopeArgs
    };

    return args
}


const requestSignDocument = async function (signerEmail, signerName) {
    let accountInfo = await authenticate();
    let args = getArgs(accountInfo.apiAccountId, accountInfo.accessToken, accountInfo.basePath, signerEmail, signerName);
    let envelopeId = await signingViaEmail.sendEnvelope(args);
    return envelopeId;
}


export default requestSignDocument;