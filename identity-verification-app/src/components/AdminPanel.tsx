import { useState } from "react";
import { useWriteContract } from "wagmi";
import clsx from "clsx";

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
    <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm w-full max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-blue-400 mb-6">
        Admin Panel
      </h2>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm font-mono mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verify Identity */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-purple-400 mb-2">
            Verify Identity
          </h3>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300 mb-2"
            placeholder="User address"
          />
          <button
            onClick={handleVerify}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-400 dark:hover:bg-blue-500 hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
          >
            Verify
          </button>
        </div>

        {/* Change Admin */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-purple-400 mb-2">
            Change Admin
          </h3>
          <input
            type="text"
            value={newAdmin}
            onChange={(e) => setUserAddress(e.target.value)}
            className="block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300 mb-2"
            placeholder="New admin address"
          />
          <button
            onClick={handleChangeAdmin}
            className="w-full bg-purple-500 dark:bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-400 dark:hover:bg-purple-500 hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
          >
            Change Admin
          </button>
        </div>

        {/* Set Verification Fee */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-purple-400 mb-2">
            Set Verification Fee
          </h3>
          <input
            type="number"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            className="block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300 mb-2"
            placeholder="New fee (wei)"
          />
          <button
            onClick={handleSetFee}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-400 dark:hover:bg-blue-500 hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
          >
            Set Fee
          </button>
        </div>

        {/* Withdraw Fees */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-purple-400 mb-2">
            Withdraw Fees
          </h3>
          <input
            type="text"
            value={withdrawAddress}
            onChange={(e) => setWithdrawAddress(e.target.value)}
            className="block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300 mb-2"
            placeholder="Recipient address"
          />
          <button
            onClick={handleWithdraw}
            className="w-full bg-purple-500 dark:bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-400 dark:hover:bg-purple-500 hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
