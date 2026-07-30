const sendEmail = async ({ to, subject, text, html }) => {
  console.log('--- MOCK EMAIL SENT ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text content: ${text}`);
  console.log('-----------------------');
  return { success: true };
};

module.exports = sendEmail;
