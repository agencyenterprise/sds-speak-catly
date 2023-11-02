import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, MouseEvent } from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

interface ElispsisMenuProps {
  handleEdit?: (event: MouseEvent) => void
  handleRemove?: (event: MouseEvent) => void
  handleRecordAgain?: (event: MouseEvent) => void
  color?: string
}

export default function ElipsisMenu(props: ElispsisMenuProps) {
  const { handleEdit, handleRemove, color, handleRecordAgain } = props

  return (
    <Menu as='div' className='relative flex-none'>
      <Menu.Button
        onClick={(e) => e.stopPropagation()}
        className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'
      >
        <span className='sr-only'>Open options</span>

        <EllipsisVerticalIcon
          color={color ?? 'currentColor'}
          className='h-5 w-5'
          aria-hidden='true'
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
          {handleRecordAgain && (
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRecordAgain(e)
                  }}
                  className={classNames(
                    active ? 'bg-gray-50' : '',
                    'block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900',
                  )}
                >
                  Record Again
                </a>
              )}
            </Menu.Item>
          )}
          {handleEdit && (
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(e)
                  }}
                  className={classNames(
                    active ? 'bg-gray-50' : '',
                    'block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900',
                  )}
                >
                  Edit
                </a>
              )}
            </Menu.Item>
          )}
          {handleRemove && (
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(e)
                  }}
                  className={classNames(
                    active ? 'bg-gray-50' : '',
                    'block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900',
                  )}
                >
                  Delete
                </a>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
