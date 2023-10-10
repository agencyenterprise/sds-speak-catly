'use client'
import { ListWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import { Footer } from '@/components/Footer'
import ListComponent from '@/components/List'
import { Spinner } from '@/components/Spinner'
import { PlusIcon } from '@heroicons/react/20/solid'
import axios, { AxiosResponse } from 'axios'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

export default function Home() {
  const setLists = useSetRecoilState(ListsAtom)
  const [loading, setLoading] = useState(true)
  const { status, data: session } = useSession()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (status === 'unauthenticated') {
      redirect('/login')
    }
  }, [status])

  useEffect(() => {
    if (!session?.user?.id) return

    axios
      .get(`/api/list/user/${session.user.id}`)
      .then(({ data }) => {
        setLists(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [session])

  async function handleListCreation() {
    if (!session?.user?.id) return

    const title = prompt('Enter the title of your list')
    if (!title) return

    const { data } = await axios.post<AxiosResponse<ListWithItemsAndMetrics>>(
      `/api/list`,
      {
        title,
        userId: session.user.id,
        items: [],
      },
    )

    setLists((prev) => {
      return [...prev, data.data]
    })
  }

  return (
    <>
      {loading && <Spinner useLogo={true} message={''} />}
      <div className='flex min-h-full flex-col justify-between bg-primary-100'>
        <div className='mx-auto flex w-full items-start gap-x-8 p-4'>
          <main className='flex-1'>
            <button
              onClick={handleListCreation}
              className='flex items-center rounded-full border border-primary-500 bg-transparent px-3 py-2 font-bold text-primary-500 hover:bg-primary-500 hover:text-white'
            >
              <span className='mr-1 h-5 w-5'>
                <PlusIcon />
              </span>
              Create new list
            </button>
            <ListComponent />
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}
