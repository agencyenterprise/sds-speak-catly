import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useHandleSet } from '@/hooks/useHandleSet'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { SetsAtom } from '@/atoms/SetsAtom'
import { CurrentActiveSet } from '@/atoms/CurrentActiveSet'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { FaCheck, FaX } from 'react-icons/fa6'
import SetComponent from '@/components/SetList'
import Button from '@/components/Button'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SlidePanel(props: Props) {
  const { open, setOpen } = props

  const [isCreating, setIsCreating] = useState(false)
  const [clickedFirstSet, setClickedFirstSet] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleSet = useHandleSet()
  const [sets, setSets] = useRecoilState(SetsAtom)
  const setCurrentActiveSet = useSetRecoilState(CurrentActiveSet)

  const { data: session } = useSession()


  useEffect(() => {
    const localClickedFirstSet = localStorage.getItem('clickedFirstSet')
    if (localClickedFirstSet) {
      setClickedFirstSet(true)
    }

  }, [])


  function handleSelectSet(setId: string) {
    const set = sets.find((set) => set.id === setId)
    if (!set) return

    localStorage.setItem('clickedFirstSet', 'true')
    setClickedFirstSet(true)
    setCurrentActiveSet(set)
    setOpen(false)
  }

  async function handleCreateSet() {
    const data = await handleSet.handleCreateSet(
      session?.user?.id,
      textAreaRef.current?.value,
    )

    if (!data) {
      toast('Something went wrong', { type: 'error' })
      return
    }

    setIsCreating(false)
    setSets((prev) => {
      return [...prev, data]
    })
  }

  function handleReturn(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateSet()
    }
  }

  function CreateSet() {
    return (
      <div className='relative w-full'>
        <div className='top-0 z-10 flex gap-4 rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-2 '>
          <textarea
            className='input leading-[0.95rem]'
            placeholder='Enter the word set title...'
            autoFocus
            rows={1}
            ref={textAreaRef}
            onKeyDown={handleReturn}
          />
          <div className='flex flex-row items-center gap-3 rounded-lg bg-white px-2'>
            <span
              onClick={handleCreateSet}
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Panel title
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-row justify-between'>
                          <h1 className='text-primary-500 font-bold'>
                            Your sets
                          </h1>
                          <Button outlined onClick={() => setIsCreating(true)}>
                            <span className='mr-1 h-5 w-5'>
                              <PlusIcon />
                            </span>
                            Create New
                          </Button>
                        </div>
                        <div className='gap-1'>
                          {!clickedFirstSet && (
                            <p className="text-sm text-primary-500">
                              This is the set you just created. Click on it
                            </p>
                          )}
                          {isCreating && <CreateSet />}
                          {
                            sets.map((set) => (
                              <SetComponent key={'set' + set.id} set={set} onClick={handleSelectSet} />
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
