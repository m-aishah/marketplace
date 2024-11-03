"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebase'; 
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/Button';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
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

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const existingUser = await fetchSignInMethodsForEmail(auth, user.email);
            
            if (existingUser.includes('password')) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                await linkWithCredential(user, credential);
            }

            router.push('/');
        } catch (error) {
            setError('Failed to log in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email. Please sign up.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address to reset your password.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
        } catch (error) {
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="transition w-full flex justify-center bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100"
                    >
                        <FcGoogle className="h-6 w-6 mr-2" />
                        Login with Google
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

                {resetEmailSent ? (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    Password reset email sent
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>
                                        Please check your inbox and follow the instructions to reset your password.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
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
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
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
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="font-medium text-brand hover:text-brand/80 focus:outline-none focus:underline transition ease-in-out duration-150"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="transition w-full bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>
                    </form>
                )}

                {error && (
                    <div className="rounded-md bg-red-50 p-4 mt-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {error}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-2 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-brand hover:text-brand-light">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
