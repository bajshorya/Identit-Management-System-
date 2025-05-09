import { useState } from "react";
import { useWriteContract } from "wagmi";

interface AdminPanelProps {
  contractAddress: string;
  abi: any[];
}

function AdminPanel({ contractAddress, abi }: AdminPanelProps) {
  const [userAddress, setUserAddress] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const [newFee, setNewFee] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync: verifyIdentity } = useWriteContract();
  const { writeContractAsync: changeAdmin } = useWriteContract();
  const { writeContractAsync: setVerificationFee } = useWriteContract();
  const { writeContractAsync: withdrawFees } = useWriteContract();

  const handleVerify = async () => {
    setError(null);
    try {
      await verifyIdentity({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "verifyIdentity",
        args: [userAddress],
      });
      setUserAddress("");
    } catch (err: any) {
      setError(err.message || "Failed to verify identity.");
    }
  };

  const handleChangeAdmin = async () => {
    setError(null);
    try {
      await changeAdmin({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "changeAdmin",
        args: [newAdmin],
      });
      setNewAdmin("");
    } catch (err: any) {
      setError(err.message || "Failed to change admin.");
    }
  };

  const handleSetFee = async () => {
    setError(null);
    try {
      await setVerificationFee({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "setVerificationFee",
        args: [BigInt(newFee)],
      });
      setNewFee("");
    } catch (err: any) {
      setError(err.message || "Failed to set verification fee.");
    }
  };

  const handleWithdraw = async () => {
    setError(null);
    try {
      await withdrawFees({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "withdrawFees",
        args: [withdrawAddress],
      });
      setWithdrawAddress("");
    } catch (err: any) {
      setError(err.message || "Failed to withdraw fees.");
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-md border border-gray-700/50 hover:shadow-glow-cyan/50 hover:scale-[1.02] transition-all duration-300 w-full max-w-2xl mb-8 animate-slide-up animate-glow-pulse">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6 font-mono">
        Admin Panel
      </h2>
      {error && <p className="text-red-400 text-sm font-mono mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verify Identity */}
        <div>
          <h3 className="text-lg font-medium text-purple-400 mb-2 font-mono">
            Verify Identity
          </h3>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 px-3 py-2 mb-2"
            placeholder="User address"
          />
          <button
            onClick={handleVerify}
            className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md hover:scale-105 hover:shadow-glow-cyan hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
          >
            <span className="absolute inset-0 bg-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
            Verify
          </button>
        </div>

        {/* Change Admin */}
        <div>
          <h3 className="text-lg font-medium text-purple-400 mb-2 font-mono">
            Change Admin
          </h3>
          <input
            type="text"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 px-3 py-2 mb-2"
            placeholder="New admin address"
          />
          <button
            onClick={handleChangeAdmin}
            className="relative w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md hover:scale-105 hover:shadow-glow-purple hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
          >
            <span className="absolute inset-0 bg-purple-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
            Change Admin
          </button>
        </div>

        {/* Set Verification Fee */}
        <div>
          <h3 className="text-lg font-medium text-purple-400 mb-2 font-mono">
            Set Verification Fee
          </h3>
          <input
            type="number"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 px-3 py-2 mb-2"
            placeholder="New fee (wei)"
          />
          <button
            onClick={handleSetFee}
            className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md hover:scale-105 hover:shadow-glow-cyan hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
          >
            <span className="absolute inset-0 bg-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
            Set Fee
          </button>
        </div>

        {/* Withdraw Fees */}
        <div>
          <h3 className="text-lg font-medium text-purple-400 mb-2 font-mono">
            Withdraw Fees
          </h3>
          <input
            type="text"
            value={withdrawAddress}
            onChange={(e) => setWithdrawAddress(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 px-3 py-2 mb-2"
            placeholder="Recipient address"
          />
          <button
            onClick={handleWithdraw}
            className="relative w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md hover:scale-105 hover:shadow-glow-purple hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
          >
            <span className="absolute inset-0 bg-purple-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
