import { formatDistanceToNow } from "date-fns";

/**
 * Formats a wallet address for display by truncating the middle
 */
export const formatAddress = (address: string | undefined): string => {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Formats an amount with a symbol
 */
export const formatAmount = (amount: string | number, symbol: string): string => {
  if (typeof amount === "number") {
    amount = amount.toString();
  }
  return `${amount} ${symbol}`;
};

/**
 * Formats a timestamp as a "time ago" string
 */
export const formatTimeAgo = (timestamp: Date | string | number): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Calculates estimated completion time based on confirmations
 */
export const calculateEstTime = (
  confirmations: number,
  requiredConfirmations: number,
  timePerConfirmation: number = 1
): string => {
  const remaining = requiredConfirmations - confirmations;
  if (remaining <= 0) return "Completed";
  return `~${remaining * timePerConfirmation} min`;
};

/**
 * Formats USD value with two decimal places
 */
export const formatUSD = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return numValue.toFixed(2);
};

/**
 * Converts a crypto amount to USD based on a rate
 */
export const cryptoToUSD = (amount: string | number, rate: number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return formatUSD(numAmount * rate);
};
