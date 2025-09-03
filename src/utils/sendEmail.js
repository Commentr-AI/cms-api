import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({
  to,
  subject,
  htmlContent,
  templateId = null,
  params = {},
}) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
      to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
      sender: {
        email: process.env.SENDER_EMAIL || "",
        name: "CMP Team",
      },
      subject,
    };

    if (templateId) {
      emailData.templateId = templateId;
      emailData.params = params;
    } else {
      emailData.htmlContent = htmlContent;
    }

    const res = await apiInstance.sendTransacEmail(emailData);
    console.log("Email sent successfully", res);
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;
