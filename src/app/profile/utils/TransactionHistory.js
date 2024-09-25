import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default function TransactionHistory({ userId }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', userId));
            const transactionsSnapshot = await getDocs(transactionsQuery);
            setTransactions(transactionsSnapshot.docs.map(doc => doc.data()));
        };

        fetchTransactions();
    }, [userId]);

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Item</th>
                            <th className="text-left p-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="p-2">{transaction.item}</td>
                                <td className="p-2">${transaction.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}