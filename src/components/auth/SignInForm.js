"use client";

import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Handle successful sign-in (e.g., redirect to a dashboard)
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSignIn}>
            {error && <p>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
};

export default SignInForm;
