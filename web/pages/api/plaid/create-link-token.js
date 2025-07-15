// /web/pages/api/plaid/create-link-token.js

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // For testing
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: "unique-user-id-123", // Use your actual user ID here
        },
        client_name: "Karma Round-Up Engine",
        products: ["transactions"],
        country_codes: ["US"],
        language: "en",
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
