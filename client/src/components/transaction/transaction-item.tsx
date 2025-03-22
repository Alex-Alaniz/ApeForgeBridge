import { Transaction } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isDeposit = transaction.type === "deposit";
  const assetSymbol = transaction.asset === "eth" ? "ETH" : "APE";
  const assetDisplay = transaction.asset === "eth" ? "Ethereum" : "ApeCoin";
  
  // Format time ago
  const timeAgo = formatDistanceToNow(
    new Date(transaction.timestamp), 
    { addSuffix: true }
  );
  
  // Determine status badge styling
  const getStatusBadgeClass = () => {
    switch (transaction.status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Capitalized status text
  const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full ${transaction.asset === 'eth' ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center mr-3`}>
            <span className={`${transaction.asset === 'eth' ? 'text-blue-600' : 'text-purple-600'} text-xs font-medium`}>
              {assetSymbol}
            </span>
          </div>
          <span className="font-medium">{assetDisplay}</span>
        </div>
      </td>
      <td className="py-4">
        <span className="inline-flex items-center">
          {isDeposit ? (
            <ArrowUp className="w-4 h-4 mr-1 text-[#0054FA]" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1 text-green-600" />
          )}
          {isDeposit ? 'Deposit' : 'Withdrawal'}
        </span>
      </td>
      <td className="py-4 font-mono">{transaction.amount} {assetSymbol}</td>
      <td className="py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
          {statusText}
        </span>
      </td>
      <td className="py-4 text-sm text-gray-500">{timeAgo}</td>
    </tr>
  );
}
