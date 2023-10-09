'use client'
import { ListsAtom } from '@/atoms/ListsAtom'
import { Button } from '@/components/Button'
import ListComponent from '@/components/List'
import ResultsModalComponent from '@/components/ResultsModal'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

export default function Home() {
  const setLists = useSetRecoilState(ListsAtom)
  const { status, data: session } = useSession()

  useEffect(() => {
    console.log({ status })
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
        console.log(data)
        setLists(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [session])

  async function handleListCreation() {
    if (!session?.user?.id) return

    const title = prompt('Enter the title of your list')
    if (!title) return

    const data = await axios.post(
      `/api/list`,
      {
        title,
        userId: session.user.id,
        items: [],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    setLists((prev) => [...prev, data.data])
  }

  return (
    <>
      <div className='flex min-h-full flex-col bg-primary-100'>
        <div className='mx-auto flex w-full items-start gap-x-8 p-4'>
          <main className='flex-1'>
            <Button
              onClick={handleListCreation}
              color='primary'
              variant='solid'
            >
              Create new list
            </Button>
            <ListComponent />
          </main>
        </div>
      </div>
    </>
  )
}
