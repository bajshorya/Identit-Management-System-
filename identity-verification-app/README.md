# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:
Using the App as a Regular User
The app allows users to connect a wallet, register an identity (full name and ID number) by paying a 0.1 ETH verification fee, and view their identity status.

Connect Wallet:
On the app’s homepage, click Connect Wallet.
MetaMask will prompt you to connect an account. Select an account with Sepolia ETH.
The UI should display: Connected: 0x1234...abcd (your address truncated).
View Verification Fee:
After connecting, the app displays: Verification Fee: 0.1 ETH (fetched from the contract’s verificationFee function).
If the fee doesn’t load, check the console for errors and ensure wagmi.ts has a valid Sepolia provider.
Register Identity:
If no identity is registered, the Identity Registration Form appears.
Enter:
Full Name: e.g., John Doe.
ID Number: e.g., 123456 (must be a number).
Click Register.
MetaMask will prompt you to confirm the transaction:
Value: 0.1 ETH (the verification fee).
Gas fees: Varies (typically <0.01 ETH on Sepolia).
Approve the transaction.
If successful, the form clears, and the identity is registered (but not verified until an admin verifies it).
If an error occurs (e.g., insufficient funds), the UI shows an error message like Failed to register identity.
View Identity Status:
After registering, the Identity Status section appears, showing:
Name: e.g., John Doe.
ID Number: e.g., 123456.
Verified: No (until an admin verifies).
Verified On: Empty (until verified).
If verified by an admin, Verified changes to Yes, and Verified On shows the timestamp.
Disconnect Wallet:
Click Disconnect to disconnect your wallet.
The UI reverts to showing the Connect Wallet button.
Step 4: Using the App as an Admin
The admin (initially 0xf4f27ba9f680abca3aa602a732fcf1641888e920, the deployer account) can verify identities, change the admin, set a new verification fee, and withdraw collected fees. The Admin Panel only appears when the connected wallet is the admin.

Connect Admin Wallet:
In MetaMask, switch to the admin account (0xf4f27ba9f680abca3aa602a732fcf1641888e920 or another admin set via changeAdmin).
Click Connect Wallet.
Ensure the account has Sepolia ETH for gas fees.
The Admin Panel appears below the Identity Status section.
Verify Identity:
In the Verify Identity section, enter a user’s address (e.g., 0xAnotherUserAddress that has registered an identity).
Click Verify.
MetaMask prompts for transaction approval (no ETH value, only gas fees).
On success, the user’s isVerified status becomes true, and verificationTimestamp is set.
Check the user’s status by reconnecting as that user.
Change Admin:
In the Change Admin section, enter a new admin address (e.g., 0xNewAdminAddress).
Click Change Admin.
Approve the transaction in MetaMask.
On success, the new address becomes the admin, and the panel disappears unless the connected wallet is the new admin.
Set Verification Fee:
In the Set Verification Fee section, enter a new fee in wei (e.g., 200000000000000000 for 0.2 ETH).
Click Set Fee.
Approve the transaction.
On success, the new fee is updated, and users see the updated fee in the UI.
Withdraw Fees:
In the Withdraw Fees section, enter a recipient address to receive collected fees (e.g., 0xRecipientAddress).
Click Withdraw.
Approve the transaction.
On success, the contract’s balance is sent to the recipient address.
Check the recipient’s balance:
bash

Copy
cast balance 0xRecipientAddress --rpc-url https://eth-sepolia.g.alchemy.com/v2/<your-al

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
