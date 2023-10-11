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
import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useRecoilState } from 'recoil'

export default function Home() {
  const [lists, setLists] = useRecoilState(ListsAtom)
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
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

  async function handleCreateList() {
    if (!session?.user?.id) return
    if (!textAreaRef.current?.value) return
    setIsCreating(false)

    const title = textAreaRef.current.value

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

  function handleReturn(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateList()
    }
  }

  function CreatingList() {
    if (!isCreating) {
      return (
        <div className='relative min-w-[25%] max-w-[33%] flex-grow'>
          <div className='top-0 z-10 flex h-[50px] justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-1.5 '>
            <button
              onClick={() => setIsCreating(true)}
              className='flex items-center rounded-full border border-white bg-primary-500 px-4 py-1 font-bold text-white hover:bg-primary-300'
            >
              <span className='mr-1 h-5 w-5'>
                <PlusIcon />
              </span>
              Create new list
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className='relative min-w-[25%] max-w-[33%] flex-grow '>
        <div className='top-0 z-10 flex gap-4 rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-1 '>
          <textarea
            className='input w-1/2 leading-[0.95rem]'
            placeholder='Enter the list title...'
            autoFocus
            rows={1}
            ref={textAreaRef}
            onKeyDown={handleReturn}
          />
          <div className='flex flex-row items-center gap-3 rounded-lg bg-white px-2'>
            <span
              onClick={handleCreateList}
              className='cursor-pointer text-2xl text-green-500'
            >
              <FaCheck />
            </span>
            <span
              className='cursor-pointer text-xl text-red-500'
              onClick={() => setIsCreating(false)}
            >
              <FaX />
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {loading && <Spinner useLogo={true} message={''} />}
      <div className='flex min-h-full flex-col justify-between bg-primary-50'>
        <div className='mx-auto flex w-full items-start gap-x-8 p-4'>
          <main className='flex-1'>
            <div className='flex max-h-[89vh] flex-row flex-wrap gap-4'>
              {lists.map((list) => (
                <ListComponent list={list} />
              ))}
              <CreatingList />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}
