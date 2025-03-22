import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AppHeader() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false);
  
  const shortenAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    // Check if the logo image exists and can be loaded
    const img = new Image();
    img.src = "/attached_assets/ApeChain Icon Outlined - White.png";
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => setLogoLoaded(false);
  }, []);

  return (
    <header className="w-full py-4 px-4 md:px-6 bg-[#111111] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {logoLoaded ? (
            <img 
              src="/attached_assets/ApeChain Icon Outlined - White.png" 
              alt="ApeForge Logo" 
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0054FA] flex items-center justify-center text-white font-bold">
              AF
            </div>
          )}
          <h1 className="text-xl font-bold text-white">ApeForge Bridge</h1>
        </div>
        
        {!address ? (
          <div className="flex items-center space-x-4">
            <ConnectWallet 
              theme="dark"
              btnTitle="Connect Wallet"
              className="bg-[#0054FA] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-all"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="bg-[#222222] py-1 px-3 rounded-lg flex items-center border border-[#333333]">
              <div className="h-2 w-2 rounded-full bg-[#00C853] mr-2"></div>
              <span className="font-mono text-sm font-medium text-white">{shortenAddress(address)}</span>
            </div>
            <button 
              onClick={() => disconnect()}
              className="text-gray-300 hover:text-[#0054FA] text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
