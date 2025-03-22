import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThirdwebProvider, coinbaseWallet, metamaskWallet, walletConnect } from "@thirdweb-dev/react";
import NotFound from "@/pages/not-found";
import BridgePage from "@/pages/bridge";
import AppHeader from "@/components/layout/app-header";
import AppFooter from "@/components/layout/app-footer";
import { NETWORK_CHAIN_CONFIG } from "@/hooks/use-wallet";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BridgePage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThirdwebProvider
      activeChain={NETWORK_CHAIN_CONFIG.ethereum} // Use our chain configuration object
      supportedChains={[NETWORK_CHAIN_CONFIG.ethereum, NETWORK_CHAIN_CONFIG.apechain]}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect()
      ]}
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || ""}
    >
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <div className="flex-grow">
            <Router />
          </div>
          <AppFooter />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}

export default App;
