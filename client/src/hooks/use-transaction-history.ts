import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";

export function useTransactionHistory(walletAddress?: string) {
  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: walletAddress ? [`/api/transactions/wallet/${walletAddress}`] : null,
    // The base QueryClient is already configured with a queryFn that handles fetch requests
    enabled: !!walletAddress
  });

  return {
    transactions: transactions || [],
    isLoading,
    error
  };
}
