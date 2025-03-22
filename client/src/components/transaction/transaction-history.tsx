import { useState } from "react";
import { Transaction, Asset, TransactionType } from "@shared/schema";
import { useAddress } from "@thirdweb-dev/react";
import TransactionItem from "./transaction-item";
import { Button } from "@/components/ui/button";
import { useTransactionHistory } from "@/hooks/use-transaction-history";

export default function TransactionHistory() {
  const address = useAddress();
  const { transactions, isLoading } = useTransactionHistory(address);
  
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [assetFilter, setAssetFilter] = useState<Asset | "all">("all");
  
  const filteredTransactions = transactions?.filter(tx => {
    const matchesType = filter === "all" || tx.type === filter;
    const matchesAsset = assetFilter === "all" || tx.asset === assetFilter;
    return matchesType && matchesAsset;
  }) || [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Transaction History</h2>
      
      {/* History Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <Button 
            onClick={() => setFilter("all")} 
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-[#FF4D4D] text-white" : "bg-[#FAFAFA] text-[#3B3B3B] hover:bg-gray-200"}
            size="sm"
          >
            All
          </Button>
          <Button 
            onClick={() => setFilter("deposit")} 
            variant={filter === "deposit" ? "default" : "outline"}
            className={filter === "deposit" ? "bg-[#FF4D4D] text-white" : "bg-[#FAFAFA] text-[#3B3B3B] hover:bg-gray-200"}
            size="sm"
          >
            Deposits
          </Button>
          <Button 
            onClick={() => setFilter("withdrawal")} 
            variant={filter === "withdrawal" ? "default" : "outline"}
            className={filter === "withdrawal" ? "bg-[#FF4D4D] text-white" : "bg-[#FAFAFA] text-[#3B3B3B] hover:bg-gray-200"}
            size="sm"
          >
            Withdrawals
          </Button>
        </div>
        
        <div className="relative">
          <select 
            className="appearance-none bg-[#FAFAFA] border border-gray-200 rounded-lg py-1.5 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:border-transparent"
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value as Asset | "all")}
          >
            <option value="all">All Assets</option>
            <option value="eth">Ethereum</option>
            <option value="ape">ApeCoin</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#FF4D4D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transaction history...</p>
        </div>
      )}
      
      {/* Connected state with transactions */}
      {address && !isLoading && filteredTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Empty state */}
      {address && !isLoading && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No transactions yet</h3>
          <p className="text-gray-500 text-sm">Your bridge transaction history will appear here</p>
        </div>
      )}
      
      {/* Not connected state */}
      {!address && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">Connect wallet to view history</h3>
          <p className="text-gray-500 text-sm mb-4">Your transaction history will appear here after connecting</p>
        </div>
      )}
    </div>
  );
}
