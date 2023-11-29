import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center p-24 justify-center'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none'></div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <Image
            alt='spro'
            className='ml-4 cursor-pointer'
            src='/sprotect.png'
            width={32}
            height={32}
          />
          <Link className='cursor-pointer' href={'/upgrades'}>
            Set Upgrades
          </Link>
        </div>

        {/* <div className='flex gap-4'>
          <Image
            alt='apro'
            className='ml-4 cursor-pointer'
            src='/aprotect.png'
            width={32}
            height={32}
          />
          <Link className='cursor-pointer' href={'/accessory-upgrades'}>
            Accessory Upgrades
          </Link>
        </div> */}
      </div>
    </main>
  )
}
