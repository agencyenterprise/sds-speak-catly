'use client'
import { SetsAtom } from '@/atoms/SetsAtom';
import Button from '@/components/Button';
import { useHandleSet } from '@/hooks/useHandleSet';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { useSetRecoilState } from 'recoil';

export default function FirstTimeCreateSet({ onCreate }: { onCreate: () => void }) {
  const handleSet = useHandleSet()
  const setSets = useSetRecoilState(SetsAtom)
  const { data } = useSession()

  useEffect(() => {
    if (!data?.user?.id) return;

    handleSet.handleGetSet(data?.user?.id)
      .then((data) => {
        if (data) {
          setSets(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [data])

  async function handleCreateSet() {
    if (!data?.user?.id) return;

    const newSet = await handleSet.handleCreateSet(data?.user?.id, 'My first set')

    if (!newSet) return;

    onCreate()
    localStorage.setItem('createdFirstSet', 'true')
    setSets((sets) => [...sets, newSet])
  }

  return (
    <>
      <div className='gap-4 flex flex-col justify-center items-center h-full'>
        <span className='flex flex-row gap-2'>
          First of, let's create a set
          <Tooltip id="my-tooltip" />
          <div data-tooltip-id="my-tooltip" data-tooltip-content="A set is a collection of words or sentences grouped together due to their similar sound or pronunciation." className=" flex items-center">
            <QuestionMarkCircleIcon className="h-5 w-5 text-primary-400" aria-hidden="true" />
          </div>
        </span>
        <Button onClick={handleCreateSet}>
          Create a new Set
        </Button>
      </div >
      <div className='flex justify-center items-end fixed bottom-0 w-full'></div>
    </>
  )
}