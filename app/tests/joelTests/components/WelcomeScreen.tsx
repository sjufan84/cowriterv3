import React from 'react'
import Link from 'next/link'

const WelcomeScreen = () => {
  return (
    <div>
      <div className="flex flex-col items-center w-full border-opacity-50">
        {/*<Link href="/tests/joelTests/recordAudio" className='w-full'>
          <button className="btn md:btn-lg md:text-lg bg-base-50 border-[#17123D] text-[#17123D] w-full">Record Audio</button>
        </Link>*/}
        <div className="divider w-full">OR</div>
        <Link href="/tests/joelTests/uploadFiles" className='w-full'>
          <button className="btn bg-base-50 md:btn-lg md:text-lg w-full text-[#17123D] border-[#17123D]">Upload Files</button>
        </Link>
      </div>
    </div>
  )
}

export default WelcomeScreen