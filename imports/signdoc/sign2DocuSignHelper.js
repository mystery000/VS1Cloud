/**
 * @file
 * Example 002: Remote signer, cc, envelope has three documents
 * @author DocuSign
 */

const fs = require("fs-extra");
const docusign = require("docusign-esign");

/**
 * This function does the work of creating the envelope
 */
const sendEnvelope = async (args) => {
    // Data for this method
    // args.basePath
    // args.accessToken
    // args.accountId

    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
        results = null;

    // Step 1. Make the envelope request body
    let envelope = makeEnvelope(args.envelopeArgs);

    // Step 2. call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(args.accountId, {
        envelopeDefinition: envelope,
    });
    let envelopeId = results.envelopeId;

    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    return { envelopeId: envelopeId };
};

/**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(args) {
    // Data for this method
    // args.signerEmail
    // args.signerName
    // args.ccEmail
    // args.ccName
    // args.status
    // doc2File
    // doc3File

    // document 1 (html) has tag **signature_1**
    // document 2 (docx) has tag /sn1/
    // document 3 (pdf) has tag /sn1/
    //
    // The envelope has two recipients.
    // recipient 1 - signer
    // recipient 2 - cc
    // The envelope will be sent first to the signer.
    // After it is signed, a copy is sent to the cc person.

    let doc2DocxBytes, doc3PdfBytes;
    // read files from a local directory
    // The reads could raise an exception if the file is not available!
    doc2DocxBytes = fs.readFileSync(args.doc2File);
    doc3PdfBytes = fs.readFileSync(args.doc3File);

    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = "Please sign this document set";

    // add the documents
    let doc1 = new docusign.Document(),
        doc1b64 = Buffer.from(document1(args)).toString("base64"),
        doc2b64 = Buffer.from(doc2DocxBytes).toString("base64"),
        doc3b64 = Buffer.from(doc3PdfBytes).toString("base64");
    doc1.documentBase64 = doc1b64;
    doc1.name = "Order acknowledgement"; // can be different from actual file name
    doc1.fileExtension = "html"; // Source data format. Signed docs are always pdf.
    doc1.documentId = "1"; // a label used to reference the doc

    // Alternate pattern: using constructors for docs 2 and 3...
    let doc2 = new docusign.Document.constructFromObject({
        documentBase64: doc2b64,
        name: "Battle Plan", // can be different from actual file name
        fileExtension: "docx",
        documentId: "2",
    });

    let doc3 = new docusign.Document.constructFromObject({
        documentBase64: doc3b64,
        name: "Lorem Ipsum", // can be different from actual file name
        fileExtension: "pdf",
        documentId: "3",
    });

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1, doc2, doc3];

    // create a signer recipient to sign the document, identified by name and email
    // We're setting the parameters via the object constructor
    let signer1 = docusign.Signer.constructFromObject({
        email: args.signerEmail,
        name: args.signerName,
        recipientId: "1",
        routingOrder: "1",
    });
    // routingOrder (lower means earlier) determines the order of deliveries
    // to the recipients. Parallel routing order is supported by using the
    // same integer as the order for two or more recipients.

    // create a cc recipient to receive a copy of the documents, identified by name and email
    // We're setting the parameters via setters
    let cc1 = new docusign.CarbonCopy();
    cc1.email = args.ccEmail;
    cc1.name = args.ccName;
    cc1.routingOrder = "2";
    cc1.recipientId = "2";

    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    //
    // The DocuSign platform searches throughout your envelope's
    // documents for matching anchor strings. So the
    // signHere2 tab will be used in both document 2 and 3 since they
    // use the same anchor string for their "signer 1" tabs.
    let signHere1 = docusign.SignHere.constructFromObject({
        anchorString: "**signature_1**",
        anchorYOffset: "10",
        anchorUnits: "pixels",
        anchorXOffset: "20",
    }),
        signHere2 = docusign.SignHere.constructFromObject({
            anchorString: "/sn1/",
            anchorYOffset: "10",
            anchorUnits: "pixels",
            anchorXOffset: "20",
        });
    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
        signHereTabs: [signHere1, signHere2],
    });
    signer1.tabs = signer1Tabs;

    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: [signer1],
        carbonCopies: [cc1],
    });
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = args.status;

    return env;
}

/**
 * Creates document 1
 * @function
 * @private
 * @param {Object} args parameters for the envelope
 * @returns {string} A document in HTML format
 */

function document1(args) {
    // Data for this method
    // args.signerEmail
    // args.signerName
    // args.ccEmail
    // args.ccName

    return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        
        <body style="font-family:sans-serif;margin-left:2em;">
            <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
                color: darkblue;margin-bottom: 0;">Test Sign Doc</h1>
            <p>Lorem some text</p>
              
            <p>Email: ${args.signerEmail}</p>
            <p>Copy to: ${args.ccName}, ${args.ccEmail}</p>
            <p>
                Lorem some body
            </p>
            <!-- Note the anchor tag for the signature field is in white. -->
            <h3 style="margin-top:2em;">Sign: <span style="color:white;">**signature_1**/</span></h3>
        </body>
    </html>
  `;
}

module.exports = { sendEnvelope, makeEnvelope, document1 };
