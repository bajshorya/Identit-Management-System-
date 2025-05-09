import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import IdentityForm from "./components/IdentityForm";
import AdminPanel from "./components/AdminPanel";
import IdentityVerificationABI from "./abi/IdentityVerificationABI.json";
import { formatEther } from "viem";

// Deployed contract address on Sepolia
const CONTRACT_ADDRESS = "0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E";

interface Identity {
  fullName: string;
  idNumber: number;
  isVerified: boolean;
  verificationTimestamp: number;
}

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Fetch verification fee
  const { data: verificationFee } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: IdentityVerificationABI,
    functionName: "verificationFee",
  }) as { data: bigint | undefined };

  // Fetch admin address
  const { data: admin } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: IdentityVerificationABI,
    functionName: "admin",
  }) as { data: string | undefined };

  // Fetch identity
  const { data: identity } = useQuery<Identity | null>({
    queryKey: ["identity", address],
    queryFn: async () => {
      if (!address) return null;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        IdentityVerificationABI,
        provider
      );
      const result = await contract.getIdentity(address);
      return {
        fullName: result[0] as string,
        idNumber: Number(result[1]),
        isVerified: result[2] as boolean,
        verificationTimestamp: Number(result[3]),
      };
    },
    enabled: !!address,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 flex flex-col relative overflow-hidden">
      {/* Background Animation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-gradient-shift pointer-events-none"></div>
      <div className="absolute inset-0 digital-rain pointer-events-none"></div>

      {/* Header */}
      <header className="w-full py-6 px-6 sticky top-0 z-20 border-b border-gray-800/50 bg-gradient-to-b from-gray-950 to-gray-900/90 animate-fade-in">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 animate-typing">
              Decentralized Identity Verification
            </h1>
          </div>
          <p className="text-gray-400 text-center max-w-md font-mono">
            Securely verify and manage your identity on the blockchain with our
            cutting-edge Web3 solution.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 flex flex-col items-center pt-8 z-10">
        {/* Wallet Connection */}
        <div className="mb-8 animate-slide-up">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-cyan-400 bg-gray-800/50 px-3 py-1 rounded-md">
                Connected:{" "}
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Unknown"}
              </span>
              <button
                onClick={() => disconnect()}
                className="relative bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-md hover:scale-105 hover:shadow-glow-red hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
              >
                <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-md hover:scale-105 hover:shadow-glow-cyan hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
            >
              <span className="absolute inset-0 bg-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
              Connect Wallet
            </button>
          )}
        </div>

        {/* Verification Fee */}
        {verificationFee !== undefined && (
          <p className="text-gray-400 font-mono mb-8 animate-slide-up">
            Verification Fee:{" "}
            <span className="text-cyan-400">
              {formatEther(verificationFee)} ETH
            </span>
          </p>
        )}

        {/* Identity Status */}
        {isConnected && identity !== null && (
          <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-md border border-gray-700/50 hover:shadow-glow-cyan/50 hover:scale-[1.02] transition-all duration-300 w-full max-w-lg mb-8 animate-slide-up animate-glow-pulse">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4 font-mono">
              Identity Status
            </h2>
            {identity?.fullName ? (
              <>
                <p className="font-mono text-gray-300 mb-2">
                  <strong className="text-purple-400">Name:</strong>{" "}
                  {identity.fullName}
                </p>
                <p className="font-mono text-gray-300 mb-2">
                  <strong className="text-purple-400">ID Number:</strong>{" "}
                  {identity.idNumber}
                </p>
                <p className="font-mono text-gray-300 mb-2">
                  <strong className="text-purple-400">Verified:</strong>{" "}
                  <span
                    className={
                      identity.isVerified ? "text-green-400" : "text-red-400"
                    }
                  >
                    {identity.isVerified ? "Yes" : "No"}
                  </span>
                </p>
                {identity.verificationTimestamp > 0 && (
                  <p className="font-mono text-gray-300">
                    <strong className="text-purple-400">Verified On:</strong>{" "}
                    {new Date(
                      identity.verificationTimestamp * 1000
                    ).toLocaleString()}
                  </p>
                )}
              </>
            ) : (
              <p className="font-mono text-gray-500">No identity registered.</p>
            )}
          </div>
        )}

        {/* Identity Registration Form */}
        {isConnected && (!identity || !identity.fullName) && (
          <IdentityForm
            contractAddress={CONTRACT_ADDRESS}
            abi={IdentityVerificationABI}
            verificationFee={verificationFee}
          />
        )}

        {/* Admin Panel */}
        {isConnected &&
          address &&
          admin &&
          address.toLowerCase() === admin.toLowerCase() && (
            <AdminPanel
              contractAddress={CONTRACT_ADDRESS}
              abi={IdentityVerificationABI}
            />
          )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 bg-gradient-to-b from-gray-950 to-gray-900/90 border-t border-gray-800/50 animate-fade-in z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <p className="text-gray-400 text-sm font-mono">
            © 2025 Identity Verification System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
