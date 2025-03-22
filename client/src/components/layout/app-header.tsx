import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const address = useAddress();
  const disconnect = useDisconnect();
  
  const shortenAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="w-full py-4 px-4 md:px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-[#FF4D4D] flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">ApeChain Bridge</h1>
        </div>
        
        {!address ? (
          <div className="flex items-center space-x-4">
            <ConnectWallet 
              theme="light"
              btnTitle="Connect Wallet"
              className="bg-[#FF4D4D] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-all"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="bg-[#FAFAFA] py-1 px-3 rounded-lg flex items-center">
              <div className="h-2 w-2 rounded-full bg-[#00C853] mr-2"></div>
              <span className="font-mono text-sm font-medium">{shortenAddress(address)}</span>
            </div>
            <button 
              onClick={() => disconnect()}
              className="text-[#3B3B3B] hover:text-[#FF4D4D] text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
