// /web/pages/api/plaid/exchange.js

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use 'development' or 'production' later
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
    const { public_token } = req.body;

    try {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token,
      });

      // tokenResponse.data.access_token --> store in Firestore (encrypted) or secure server
      console.log('Plaid access_token:', tokenResponse.data.access_token);

      res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
