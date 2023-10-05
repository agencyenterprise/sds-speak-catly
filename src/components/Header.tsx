import Image from 'next/image'
import defaultLogo from '@/images/logo.svg'
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick.hooks';

export default function Header() {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const logoutRef = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession();
  useOutsideClick(logoutRef, () => setAvatarOpen(false));


  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      void signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  function handleLogout() {
    setAvatarOpen(false);
    void signOut();
  }

  function handleAvatarClick() {
    setAvatarOpen(!avatarOpen);
  };

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-8 relative justify-end">
          <button onClick={handleAvatarClick} className="-m-1.5 p-1.5">
            <span className="sr-only">Your profile</span>
            <Image
              className="h-8 w-8 rounded-full bg-gray-800"
              width={32}
              height={32}
              src={session?.user?.image || defaultLogo.src}
              alt=""
            />
          </button>
          {avatarOpen && (
            <div className="absolute mt-3 right-[-14px] bg-primary-600 text-primary-100 hover:bg-primary-700 rounded-sm shadow-md z-50">
              <div className="flex flex-col gap-2 px-1 py-1">
                <button ref={logoutRef} onClick={handleLogout} className="rounded-sm px-3 py-[6px]">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}