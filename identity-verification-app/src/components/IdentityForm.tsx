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
    <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-md border border-gray-700/50 hover:shadow-glow-cyan/50 hover:scale-[1.02] transition-all duration-300 w-full max-w-lg mb-8 animate-slide-up animate-glow-pulse">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6 font-mono">
        Register Identity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 px-3 py-2"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
            ID Number
          </label>
          <input
            type="number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="block w-full rounded-md bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 px-3 py-2"
            placeholder="Enter ID number"
          />
        </div>
        {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
        <button
          type="submit"
          className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-md hover:scale-105 hover:shadow-glow-cyan hover:animate-pulse transition-all duration-300 group overflow-hidden hover:cursor-pointer"
        >
          <span className="absolute inset-0 bg-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
          Register
        </button>
      </form>
    </div>
  );
}

export default IdentityForm;
