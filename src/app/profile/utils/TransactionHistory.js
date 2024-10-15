import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      setTransactions(transactionsSnapshot.docs.map((doc) => doc.data()));
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Transaction History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your recent transactions and activities.
        </p>
      </div>
      <div className="border-t border-gray-200">
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
                <td className="p-2">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
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
