import Link from 'next/link';

export default function ProfileNavigation({ onCreateListing }) {
    return (
        <div className="flex justify-between items-center mt-8">
            <Link href="/" className="text-blue-500 hover:text-blue-700">
                Back to Dashboard
            </Link>
            <button 
                onClick={onCreateListing}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Create New Listing
            </button>
        </div>
    );
}