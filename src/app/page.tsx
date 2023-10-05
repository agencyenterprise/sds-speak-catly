'use client';
import { GetAllUserList } from '@/app/api/list/user/[userId]/route';
import ListComponent from '@/components/List';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {

  const [lists, setLists] = useState<GetAllUserList[]>([]);
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      redirect('/api/auth/signin');
    }
  }, [status])


  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/list/user/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setLists(data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  function handleListCreation() {
    if (!session?.user?.id) return;

    const title = prompt('Enter the title of your list');
    if (!title) return;
    fetch(`/api/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        userId: session.user.id,
        items: []
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setLists((prev) => [...prev, data.data]);
      })
      .catch((error) => {
        console.log(error);
      })
  }


  return (
    <div className="flex min-h-full flex-col bg-primary-100">
      <div className="mx-auto flex w-full items-start gap-x-8">
        <aside className="sticky top-8 hidden w-44 shrink-0 lg:block bg-primary-400 h-full">
          <ListComponent lists={lists} />
          <button onClick={handleListCreation} className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-100 bg-primary-600 hover:bg-primary-700">
            Create new list
          </button>
        </aside>
        <main className="flex-1">
          main content
        </main>
      </div>
    </div>
  )
}