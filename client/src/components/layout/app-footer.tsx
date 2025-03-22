import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export default function AppFooter() {
  return (
    <footer className="bg-[#3B3B3B] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-[#FF4D4D] flex items-center justify-center text-white font-bold mr-3">
              A
            </div>
            <span className="font-semibold text-lg">ApeChain Bridge</span>
          </div>
          <div className="grid grid-cols-2 md:flex md:space-x-8 text-sm mb-6 md:mb-0">
            <a href="#" className="hover:text-[#FF4D4D] mb-2 md:mb-0">Documentation</a>
            <a href="#" className="hover:text-[#FF4D4D] mb-2 md:mb-0">FAQ</a>
            <a href="#" className="hover:text-[#FF4D4D] mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="hover:text-[#FF4D4D]">Privacy Policy</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#FF4D4D]">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#FF4D4D]">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#FF4D4D]">
              <FaDiscord className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ApeChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
