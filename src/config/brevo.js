import SibApiV3Sdk from "sib-api-v3-sdk";

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
console.log("🔑 Brevo API Key set", process.env.BREVO_API_KEY);

export default new SibApiV3Sdk.TransactionalEmailsApi();
