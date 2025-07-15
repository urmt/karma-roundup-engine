// /web/pages/signup.js

import { useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

export default function SignUp() {
  const db = getFirestore();

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user doc in Firestore if new
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date()
      }, { merge: true });

      alert('Signed up successfully!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date()
      }, { merge: true });

      alert('Signed up successfully!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>

      <button
        onClick={handleGoogleSignUp}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-6"
      >
        Sign Up with Google
      </button>

      <form onSubmit={handleEmailSignUp} className="flex flex-col w-full max-w-xs">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border px-3 py-2 mb-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border px-3 py-2 mb-3"
        />
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          Sign Up with Email
        </button>
      </form>
    </div>
  );
}
