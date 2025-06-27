const qs = require("qs");
const axios = require("axios");
const logger = require("../utils/logger");

exports.getGoogleTokens = async ({ code }) => {
  const url = process.env.GOOGLE_OAUTH_TOKEN;

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  console.log("Exchanging code for access token with values:", values);

  try {
    const response = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    logger.error("Error exchanging code for access token:", error);
    throw new Error(error.message);
  }
};

exports.getGoogleUser = async ({ id_token, access_token }) => {
  const url = `${process.env.GOOGLE_USER_INFO}?alt=json&access_token=${access_token}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });

    return response.data;
  } catch (error) {
    logger.error("Error fetching Google user info:", error);
    throw new Error(error.message);
  }
};
