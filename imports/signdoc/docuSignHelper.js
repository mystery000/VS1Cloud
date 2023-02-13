const docusign = require('docusign-esign');
const signingViaEmail = require('./sign2DocuSignHelper');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

const jwtConfig = require('./config.json');
const { ProvisioningInformation } = require('docusign-esign');
const demoDocsPath = path.resolve(__dirname, '../templates');
const doc2File = 'template.docx';
const doc3File = 'template.pdf';


const SCOPES = [
    "signature", "impersonation"
];

function getConsent() {
    var urlScopes = SCOPES.join('+');

    // Construct consent URL
    var redirectUri = "https://developers.docusign.com/platform/auth/consent";
    var consentUrl = `${jwtConfig.dsOauthServer}/oauth/auth?response_type=code&` +
        `scope=${urlScopes}&client_id=${jwtConfig.dsJWTClientId}&` +
        `redirect_uri=${redirectUri}`;

    console.log("Open the following URL in your browser to grant consent to the application:");
    console.log(consentUrl);
    console.log("Consent granted? \n 1)Yes \n 2)No");
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
    dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace('https://', '')); // it should be domain only.
    let rsaKey = fs.readFileSync(path.resolve(__dirname, '../private.key'));

    try {
        const results = await dsApi.requestJWTUserToken(jwtConfig.dsJWTClientId,
            jwtConfig.impersonatedUserGuid, SCOPES, rsaKey,
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
        console.log(e);
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

function getArgs(apiAccountId, accessToken, basePath, signerEmail, signerName, ccEmailv, ccNamev) {
    // signerEmail = prompt("Enter the signer's email address: ");
    // signerName = prompt("Enter the signer's name: ");
    // ccEmail = prompt("Enter the carbon copy's email address: ");
    // ccName = prompt("Enter the carbon copy's name: ");

    const envelopeArgs = {
        signerEmail: signerEmail,//
        signerName: signerName,//
        ccEmail: ccEmailv,
        ccName: ccNamev,
        status: "sent",
        doc2File: path.resolve(demoDocsPath, doc2File),
        doc3File: path.resolve(demoDocsPath, doc3File)
    };
    const args = {
        accessToken: accessToken,
        basePath: basePath,
        accountId: apiAccountId,
        envelopeArgs: envelopeArgs
    };

    return args
}


const requestSignDocument = async function (signerEmail, signerName, ccEmail, ccName, htmlData) {
    console.log('Ready send email to');
    let accountInfo = await authenticate();

    console.log('Authenticate Success');
    let args = getArgs(accountInfo.apiAccountId, accountInfo.accessToken, accountInfo.basePath, signerEmail, signerName, ccEmail, ccName);

    console.log('Sending Envelope');

    args.envelopeArgs.htmlData = htmlData;

    const {envelopeId} = await signingViaEmail.sendEnvelope(args);

    console.log('Done', envelopeId);
}


export default requestSignDocument;
