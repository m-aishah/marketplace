"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-brand animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border-t-4 border-b-4 border-brand animate-spin animation-delay-150"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-t-4 border-b-4 border-brand animate-spin animation-delay-300"></div>
    </div>
  </div>
);

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !isReady) {
    return <LoadingSpinner />;
  }

  return children;
}