// /web/pages/dashboard.js

import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore, collection, getDocs } from 'firebase/firestore';
import PlaidLinkButton from '../components/PlaidLinkButton';

// ...

<PlaidLinkButton />


export default function Dashboard() {
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState(0);
  const [fees, setFees] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user donation summary
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDonations(data.totalDonated || 0);
          setFees(data.totalFees || 0);
        }

        // Fetch recent transactions
        const txSnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'transactions'));
        const txList = txSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txList);
      } else {
        window.location.href = '/signup';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = '/signup';
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

      {user && (
        <div className="mb-6 text-center">
          <p className="mb-1">Hello, {user.email}</p>
          <p className="mb-1">Total Donated: ${donations.toFixed(2)}</p>
          <p className="mb-4">Total Service Fees: ${fees.toFixed(2)}</p>

          <button className="bg-gray-800 text-white px-4 py-2 rounded mr-2">
            Change Charity
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
            Pause Round-Ups
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Recent Round-Ups</h2>
      <div className="w-full max-w-md">
        {transactions.length === 0 && (
          <p className="text-gray-500">No transactions yet.</p>
        )}
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border-b py-2 flex justify-between text-sm"
          >
            <span>{tx.merchantName || 'Unknown Merchant'}</span>
            <span>Round-Up: ${tx.roundUp.toFixed(2)}</span>
            <span>Fee: $0.01</span>
          </div>
        ))}
      </div>
    </div>
  );
}

