# Identity Verification DApp

A decentralized application (DApp) for identity verification on the Ethereum Sepolia testnet, built with React, Vite, Tailwind CSS v4, and Wagmi. The app interacts with a deployed IdentityVerification smart contract, allowing users to register identities (full name and ID number) by paying a verification fee (0.1 ETH) and admins to verify identities, manage fees, and withdraw funds.

## Features

### User Features:
- Connect a wallet (e.g., MetaMask) to Sepolia
- Register an identity (full name, ID number) with a 0.1 ETH fee
- View identity status (name, ID, verification status, timestamp)

### Admin Features:
- Verify user identities
- Change the admin address
- Update the verification fee
- Withdraw collected fees

### UI Design:
- Modern design with glassmorphism cards
- Blue-to-purple gradients for buttons and headers
- Hover animations and smooth focus transitions
- Responsive layout with a grid-based admin panel
- Typography using Inter (sans-serif) and JetBrains Mono (monospace)

### Smart Contract:
- Deployed on Sepolia at 0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E
- Built with Solidity, includes functions for identity registration, verification, and admin management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5
- **Styling**: Tailwind CSS v4
- **Web3**: Wagmi 2.x, Viem 2.x, Ethers.js 6.x
- **Contract Interaction**: IdentityVerification contract on Sepolia
- **Dependencies**: @tanstack/react-query, clsx
- **Fonts**: Inter, JetBrains Mono (via Google Fonts)

## Prerequisites

- **Node.js**: Version 20 or higher (node --version to check)
- **MetaMask**: Installed in a modern browser (Chrome 111+, Firefox 128+, Safari 16.4+)
- **Sepolia ETH**: Fund your wallet with at least 0.2 ETH (0.1 ETH for registration + gas fees) via a Sepolia faucet
- **Alchemy API Key** (optional): For Sepolia RPC provider in wagmi.ts

## Installation

### Clone the Repository:
```bash
git clone https://github.com/bajshorya/Identit-Management-System-.git
cd identity-verification-app
```

### Install Dependencies:
```bash
npm install
```

### Configure Environment (optional):
1. Create a `.env` file in the root directory
2. Add your Alchemy API key for Sepolia:
```
VITE_ALCHEMY_API_KEY=your-alchemy-key
```
3. Update `src/lib/wagmi.ts` with the key or a public Sepolia RPC URL

### Verify Project Structure:
```
identity-verification-app/
├── src/
│   ├── abi/
│   │   └── IdentityVerificationABI.json
│   ├── components/
│   │   ├── IdentityForm.tsx
│   │   └── AdminPanel.tsx
│   ├── lib/
│   │   └── wagmi.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.ts
├── vite.config.ts
├── package.json
└── README.md
```

## Running the App

### Start the Development Server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### As a Regular User

**Connect Wallet:**
1. Click Connect Wallet and select a MetaMask account on Sepolia
2. Ensure the account has 0.2 ETH (0.1 ETH fee + gas)

**Register Identity:**
1. In the Identity Registration Form, enter:
   - Full Name: e.g., John Doe
   - ID Number: e.g., 123456
2. Click Register and approve the 0.1 ETH transaction in MetaMask
3. On success, the form clears, and your identity is registered (unverified)

**View Identity Status:**
- See your identity details:
  - Name, ID Number, Verified (No until admin verifies), Verified On (if verified)
- Disconnect via the Disconnect button

### As an Admin

**Connect Admin Wallet:**
1. Use the admin account (0xf4f27ba9f680abca3aa602a732fcf1641888e920 or a new admin set via changeAdmin)
2. The Admin Panel appears after connecting

**Verify Identity:**
1. Enter a user's address and click Verify
2. Approve the transaction (gas only)

**Change Admin:**
1. Enter a new admin address and click Change Admin

**Set Verification Fee:**
1. Enter a new fee (in wei, e.g., 200000000000000000 for 0.2 ETH) and click Set Fee

**Withdraw Fees:**
1. Enter a recipient address and click Withdraw to transfer collected fees

## Smart Contract Interaction (Optional)

Interact with the contract directly using cast (Foundry):

**Check Verification Fee:**
```bash
cast call 0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E "verificationFee()(uint256)" --rpc-url https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key
```

**Register Identity:**
```bash
cast send 0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E "registerIdentity(string,uint256)" "John Doe" 123456 --private-key your-private-key --rpc-url https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key --value 0.1ether
```

**Verify Identity (Admin):**
```bash
cast send 0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E "verifyIdentity(address)" user-address --private-key admin-private-key --rpc-url https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key
```

**Note:** Keep private keys secure and never share them publicly.

## Troubleshooting

**Wallet Connection Issues:**
- Ensure MetaMask is on Sepolia with sufficient ETH
- Update wagmi: `npm install wagmi@latest`

**Transaction Failures:**
- Check ETH balance and contract address (0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E)
- Verify contract deployment: `cast code 0x886a5152EecAdfB7E5De6a7Cc2e0617aBc298e1E --rpc-url https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key`

**UI Errors:**
- Share console logs (F12 → Console) and package.json

## Deployment

**Build the App:**
```bash
npm run build
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
MIT License. See LICENSE for details.

## Contact
For issues or suggestions, open a GitHub issue or contact [your-email@example.com](mailto:your-email@example.com).

Built with ❤️ for the Ethereum ecosystem.