'use client'
import { CurrentActiveSet } from '@/atoms/CurrentActiveSet'
import { SetsAtom } from '@/atoms/SetsAtom'
import Button from '@/components/Button'
import Card from '@/components/Card'
import FirstTimeCreateSet from '@/components/FirstTimeCreateSet'
import { Footer } from '@/components/Footer'
import SlidePanel from '@/components/SlidePanel'
import { Spinner } from '@/components/Spinner'
import WordItemComponent from '@/components/WordItem'
import { useHandleItem } from '@/hooks/useHandleItem'
import { useHandleSet } from '@/hooks/useHandleSet'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { useRecoilState, useSetRecoilState } from 'recoil'
export default function Home() {
  const setSets = useSetRecoilState(SetsAtom)

  const [loading, setLoading] = useState(true)
  const { status, data: session } = useSession()
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false)
  const [createdFirstSet, setCreatedFirstSet] = useState(false)
  const [isCreatingItem, setIsCreatingItem] = useState(false)
  const [createdFirstWord, setCreatedFirstWord] = useState(false)
  const [currentActiveSet, setCurrentActiveSet] = useRecoilState(CurrentActiveSet)
  const mainButtonRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleSet = useHandleSet()
  const handleItem = useHandleItem()

  useEffect(() => {
    const localCreatedFirstSet = localStorage.getItem('createdFirstSet')

    if (localCreatedFirstSet) {
      setCreatedFirstSet(true)
    }
  }, [])

  useEffect(() => {
    const localCreatedFirstWord = localStorage.getItem('createdFirstWord')

    if (localCreatedFirstWord) {
      setCreatedFirstWord(true)
    }
  }, [])


  useEffect(() => {
    console.log(currentActiveSet)
  }, [currentActiveSet])
  // recordedFirstWord

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

    handleSet
      .handleGetSet(session?.user?.id)
      .then((data) => {
        setSets(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [session])

  function handleFirstCreate() {
    setIsSlidePanelOpen(true)
  }

  async function handleCreateItem() {
    if (!currentActiveSet) return;
    if (!textAreaRef.current) return;

    const data = await handleItem.handleCreateItem(
      currentActiveSet?.id,
      textAreaRef.current?.value,
    )

    if (!data) return
    //TODO: adicionar toast de erro

    setIsCreatingItem(false)
    setCurrentActiveSet(data.find((set) => set.id === currentActiveSet?.id)!)
    setSets(data)
  }

  function handleReturn(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateItem()
    }
  }

  function CreateItem() {
    return (
      <Card>
        <div className='flex flex-col gap-4'>
          <textarea
            className='input leading-[0.95rem] border-none'
            placeholder='Enter a short sentence or word'
            autoFocus
            rows={1}
            ref={textAreaRef}
            onKeyDown={handleReturn}
          />
          <div className='flex flex-row justify-end items-center gap-3 rounded-lg bg-transparent px-2'>
            <span>
              <Tooltip id="new-item-explanation" />
              <div data-tooltip-id="new-item-explanation" data-tooltip-content="This sentence will be added to your set and you will be able to practice the pronunciation on it" className=" flex items-center">
                <QuestionMarkCircleIcon className="h-5 w-5 text-primary-400" aria-hidden="true" />
              </div>
            </span>
            <span
              className='cursor-pointer text-xl text-red-500'
              onClick={() => setIsCreatingItem(false)}
            >
              <Button size='sm' outlined className='border-critical-500 text-critical-500 hover:bg-critical-500 focus-visible:outline-critical-500'>
                Discard
              </Button>
            </span>
            <span
              onClick={handleCreateItem}
              className='cursor-pointer text-2xl text-green-500'
            >
              <Button size='sm' className='bg-success-500 hover:bg-success-600'  >
                Create
              </Button>
            </span>
          </div>
        </div>

      </Card>
    )
  }


  return (
    <div className='p-4 h-full relative'>
      <SlidePanel open={isSlidePanelOpen} setOpen={setIsSlidePanelOpen} />
      {loading && <Spinner useLogo={true} message={''} />}
      {!createdFirstSet ? (
        <div className='h-full flex justify-center items-center' ref={mainButtonRef}>
          <FirstTimeCreateSet onCreate={handleFirstCreate} />
        </div>
      ) : (
        <div>
          <div className='flex justify-between flex-row-reverse mb-8'>
            <Button className='min-w-[100px]' onClick={() => setIsSlidePanelOpen(true)}>
              Your Sets
            </Button>
            {currentActiveSet && (
              <Button className='min-w-[100px]' onClick={() => setIsCreatingItem(true)}>
                Add Word/Phrase
              </Button>
            )}
          </div>

          {currentActiveSet && (
            <div className='flex flex-col gap-4'>
              <h1 className='text-primary-500 text-2xl font-semibold text-center'>
                {currentActiveSet.title}
              </h1>
              {isCreatingItem && <CreateItem />}
              <div className='flex flex-col gap-4'>
                {currentActiveSet.items.map((item) => (
                  <WordItemComponent item={item} />
                ))}
              </div>
            </div>
          )}
          <span className='fixed bottom-0 ml-[-5rem] flex justify-center flex-row w-full'>
            <Footer />
          </span>
        </div>
      )}
    </div>

  )
}
