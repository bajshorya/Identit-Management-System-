import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import IdentityForm from "./components/IdentityForm";
import AdminPanel from "./components/AdminPanel";
import IdentityVerificationABI from "./abi/IdentityVerificationABI.json";
import clsx from "clsx";
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-blue-purple mb-8 animate-pulse">
        Identity Verification
      </h1>

      {/* Wallet Connection */}
      <div className="mb-6">
        {isConnected ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-mono text-gray-700 dark:text-blue-400">
              Connected:{" "}
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Unknown"}
            </span>
            <button
              onClick={() => disconnect()}
              className="bg-red-500 dark:bg-purple-600 text-white px-6 py-2 rounded-sm hover:bg-red-400 dark:hover:bg-purple-500 hover:scale-105 transition-all duration-300 dark:shadow-neon-glow"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-blue-500 dark:bg-gradient-blue-purple text-white px-6 py-2 rounded-sm hover:bg-blue-400 dark:hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Verification Fee */}
      {verificationFee !== undefined && (
        <p className="text-gray-600 dark:text-gray-300 font-mono mb-6">
          Verification Fee:{" "}
          <span className="text-blue-500 dark:text-blue-400">
            {formatEther(verificationFee)} ETH
          </span>
        </p>
      )}

      {/* Identity Status */}
      {isConnected && identity !== null && (
        <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm mb-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-blue-400 mb-4">
            Identity Status
          </h2>
          {identity?.fullName ? (
            <>
              <p className="font-mono text-gray-700 dark:text-gray-200">
                <strong className="text-gray-900 dark:text-purple-400">
                  Name:
                </strong>{" "}
                {identity.fullName}
              </p>
              <p className="font-mono text-gray-700 dark:text-gray-200">
                <strong className="text-gray-900 dark:text-purple-400">
                  ID Number:
                </strong>{" "}
                {identity.idNumber}
              </p>
              <p className="font-mono text-gray-700 dark:text-gray-200">
                <strong className="text-gray-900 dark:text-purple-400">
                  Verified:
                </strong>{" "}
                <span
                  className={
                    identity.isVerified
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }
                >
                  {identity.isVerified ? "Yes" : "No"}
                </span>
              </p>
              {identity.verificationTimestamp > 0 && (
                <p className="font-mono text-gray-700 dark:text-gray-200">
                  <strong className="text-gray-900 dark:text-purple-400">
                    Verified On:
                  </strong>{" "}
                  {new Date(
                    identity.verificationTimestamp * 1000
                  ).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <p className="font-mono text-gray-600 dark:text-gray-300">
              No identity registered.
            </p>
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
    </div>
  );
}

export default App;
