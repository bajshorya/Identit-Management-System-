import { useState } from "react";
import { useWriteContract } from "wagmi";
import clsx from "clsx";

interface IdentityFormProps {
  contractAddress: string;
  abi: any[];
  verificationFee: bigint | undefined;
}

function IdentityForm({
  contractAddress,
  abi,
  verificationFee,
}: IdentityFormProps) {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !idNumber) {
      setError("Please fill in all fields.");
      return;
    }

    if (verificationFee === undefined) {
      setError("Verification fee not loaded. Please try again.");
      return;
    }

    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "registerIdentity",
        args: [fullName, BigInt(idNumber)],
        value: verificationFee,
      });
      setFullName("");
      setIdNumber("");
    } catch (err: any) {
      setError(err.message || "Failed to register identity.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm w-full max-w-lg mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-blue-400 mb-4">
        Register Identity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ID Number
          </label>
          <input
            type="number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="mt-1 block w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-300"
            placeholder="Enter ID number"
          />
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-mono">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 dark:bg-gradient-blue-purple text-white px-6 py-2 rounded-sm hover:bg-blue-400 dark:hover:scale-105 dark:hover:shadow-neon-glow transition-all duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default IdentityForm;
