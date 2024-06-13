'use client';

import WelcomeScreen from './components/WelcomeScreen';
import Image from 'next/image';

export default function JoelTestsPage() {
  
  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainPage">
      <div className="flex flex-col w-full max-w-4xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4 self-center mb-6" />
        <WelcomeScreen />
      </div>
    </div>
  );
}