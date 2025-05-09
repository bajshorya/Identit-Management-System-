import { createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";
import { injected } from "@wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});
