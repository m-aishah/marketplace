"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const googleUsername = user.displayName || user.email.split('@')[0];

            const existingUser = await fetchSignInMethodsForEmail(auth, user.email);
            
            if (existingUser.includes('password')) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                await linkWithCredential(user, credential);
            }

            await setDoc(doc(db, 'users', user.uid), {
                username: googleUsername,
                email: user.email,
            });

            await addDoc(collection(db, 'contacts'), {
                userId: user.uid,
                type: 'email',
                value: user.email,
            });

            router.push('/');
        } catch (error) {
            setError('Failed to signup with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const validatePassword = (password) => {
        if (password.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters long." };
        }
        
        if (!/[A-Za-z]/.test(password)) {
            return { valid: false, message: "Password must contain at least one letter." };
        }
        
        if (!/\d/.test(password)) {
            return { valid: false, message: "Password must contain at least one number." };
        }

        return { valid: true };
    };


    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            setIsLoading(false);
            return;
        }

        const validation = validatePassword(password);
        
        if (!validation.valid) {
            setError(validation.message);
            setIsLoading(false);
            return;
        }


        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
            });

            await addDoc(collection(db, 'contacts'), {
                userId: user.uid,
                type: 'email',
                value: email
            });

            router.push('/');
        } catch (error) {
            handleAuthErrors(error.code);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthErrors = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                setError('An account with this email already exists.');
                break;
            case 'auth/invalid-email':
                setError('Please enter a valid email address.');
                break;
            case 'auth/weak-password':
                setError('Password should be at least 6 characters long.');
                break;
            default:
                setError('Failed to create an account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="transition w-full flex justify-center bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100"
                    >
                        <FcGoogle className="h-6 w-6 mr-2" />
                        {isLoading ? 'Loading...' : 'Sign up with Google'}
                    </button>

                    <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                OR
                            </span>
                        </div>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleEmailSignup}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div> <br/>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div> <br/>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-500" /> : <FiEye className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div> <br/>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff className="h-5 w-5 text-gray-500" /> : <FiEye className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="transition w-full bg-brand font-medium text-white px-5 py-3 rounded-full text-sm hover:shadow-md hover:shadow-brand/30"
                        >
                            {isLoading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 text-center text-sm text-red-500">
                            {error}
                        </div>
                    )}
                </form>
                <div className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-brand hover:text-brand-light">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
