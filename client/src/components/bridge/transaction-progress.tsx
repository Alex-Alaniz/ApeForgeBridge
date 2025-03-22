import { Transaction } from "@shared/schema";
import { CheckIcon } from "lucide-react";

interface TransactionProgressProps {
  transaction: Transaction;
}

export default function TransactionProgress({ transaction }: TransactionProgressProps) {
  const networkExplorerUrl = transaction.fromNetwork === "ethereum" 
    ? `https://etherscan.io/tx/${transaction.transactionHash}`
    : `https://explorer.apechain.com/tx/${transaction.transactionHash}`;

  // Estimate time based on confirmations required
  const estimatedTime = () => {
    const remaining = (transaction.requiredConfirmations || 15) - (transaction.confirmations || 0);
    if (remaining <= 0) return "Completed";
    const minutesRemaining = remaining * 1; // assume 1 minute per confirmation
    return `~${minutesRemaining} min`;
  };

  return (
    <div className="mt-6 p-4 bg-[#FAFAFA] rounded-lg">
      <div className="flex items-center mb-4">
        <div className={`h-2 w-2 rounded-full ${transaction.status === 'completed' ? 'bg-[#00C853]' : 'bg-[#FFA726]'} mr-2`}></div>
        <h3 className="font-medium">
          {transaction.status === 'completed' ? 'Transaction completed' : 'Transaction in progress'}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center mb-1">
            <div className="h-6 w-6 rounded-full bg-[#00C853] flex items-center justify-center text-white text-xs">
              <CheckIcon className="h-3 w-3" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Transaction Initiated</p>
            </div>
          </div>
          <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-300 h-8"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center mb-1">
            <div className={`h-6 w-6 rounded-full ${
              transaction.status === 'completed' 
                ? 'bg-[#00C853] flex items-center justify-center text-white text-xs' 
                : 'bg-[#FFA726] flex items-center justify-center'
            }`}>
              {transaction.status === 'completed' ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <div className="h-2 w-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">
                {transaction.status === 'completed' ? 'Confirmed' : `Confirming (${transaction.confirmations || 0}/${transaction.requiredConfirmations || 15})`}
              </p>
              {transaction.status !== 'completed' && (
                <p className="text-xs text-gray-500">Estimated time: {estimatedTime()}</p>
              )}
            </div>
          </div>
          <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-300 h-8"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center">
            <div className={`h-6 w-6 rounded-full ${
              transaction.status === 'completed' 
                ? 'bg-[#00C853] flex items-center justify-center text-white text-xs'
                : 'bg-gray-200 flex items-center justify-center text-gray-400 text-xs'
            }`}>
              {transaction.status === 'completed' ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                "3"
              )}
            </div>
            <div className="ml-3">
              <p className={`font-medium text-sm ${transaction.status !== 'completed' ? 'text-gray-400' : ''}`}>
                {`Available on ${transaction.toNetwork === 'ethereum' ? 'Ethereum' : 'ApeChain'}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center">
        <a href={networkExplorerUrl} className="text-[#FF4D4D] hover:underline font-mono" target="_blank" rel="noopener noreferrer">
          View on {transaction.fromNetwork === 'ethereum' ? 'Etherscan' : 'ApeChain Explorer'}: {transaction.transactionHash.slice(0, 8)}...{transaction.transactionHash.slice(-8)}
        </a>
      </div>
    </div>
  );
}
