// /web/components/PlaidLinkButton.js

import { usePlaidLink } from 'react-plaid-link';

export default function PlaidLinkButton() {
  const onSuccess = async (public_token) => {
    const response = await fetch('/api/plaid/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_token })
    });

    const data = await response.json();
    console.log(data);
    alert('Bank connected!');
  };

  const config = {
    token: '<REPLACE_WITH_LINK_TOKEN>',
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Connect Your Bank
    </button>
  );
}
