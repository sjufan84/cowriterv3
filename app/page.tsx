'use client';

import WelcomeScreen from './tests/joelTests/components/WelcomeScreen';
import Image from 'next/image';

export default function JoelTestsPage() {
  
  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainPage">
      <div className="flex flex-col w-full max-w-4xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={400} height={400} className="mt-4 self-center mb-8" sizes="(max-width: 768px) 100vw, 33vw" />
        <WelcomeScreen />
      </div>
    </div>
  );
}