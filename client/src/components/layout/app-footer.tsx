import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function AppFooter() {
  const [poweredByLogoLoaded, setPoweredByLogoLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the logo image exists and can be loaded
    const img = new Image();
    img.src = "/attached_assets/Powered by ApeCoin.png";
    img.onload = () => setPoweredByLogoLoaded(true);
    img.onerror = () => setPoweredByLogoLoaded(false);
  }, []);

  return (
    <footer className="bg-[#111111] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-[#0054FA] flex items-center justify-center text-white font-bold mr-3">
              AF
            </div>
            <span className="font-semibold text-lg">ApeForge Bridge</span>
          </div>
          <div className="grid grid-cols-2 md:flex md:space-x-8 text-sm mb-6 md:mb-0">
            <a href="#" className="hover:text-[#0054FA] mb-2 md:mb-0">Documentation</a>
            <a href="#" className="hover:text-[#0054FA] mb-2 md:mb-0">FAQ</a>
            <a href="#" className="hover:text-[#0054FA] mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="hover:text-[#0054FA]">Privacy Policy</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#0054FA]">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#0054FA]">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#0054FA]">
              <FaDiscord className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* ApeChain Branding Section */}
        <div className="flex justify-center mt-10 mb-6">
          {poweredByLogoLoaded ? (
            <img 
              src="/attached_assets/Powered by ApeCoin.png" 
              alt="Powered by ApeCoin" 
              className="h-10 object-contain"
            />
          ) : (
            <div className="py-2 px-4 bg-[#222222] rounded-lg text-sm text-gray-200">
              Powered by ApeCoin
            </div>
          )}
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ApeForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
