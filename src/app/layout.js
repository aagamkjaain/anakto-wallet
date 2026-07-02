import { Web3Provider } from '@/context/Web3Context';
import './globals.css';

export const metadata = {
  title: 'ANAKTO | Dead Man\'s Switch Wallet',
  description: 'A modular smart contract wallet with spending limits and built-in inheritance dead man\'s switch systems on zkSync.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/square-m.png" />
      </head>
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
