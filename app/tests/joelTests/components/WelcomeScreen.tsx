import React from 'react'
import Link from 'next/link'

const WelcomeScreen = () => {
  const [isCowriter, setIsCowriter] = React.useState(false)

  return (
    <div className="flex flex-col items-center justify-center w-full border-opacity-50 bg-zinc-50">
      <div id="coWriterGroup" className="w-full">
        {!isCowriter ? (
          <div id="isNotCowriterGroup" className="w-full">
            <button 
              className="btn bg-zinc-50 md:btn-lg md:text-lg hover:bg-zinc-50 text-[#17123D] border-[#17123D] w-full"
              onClick={() => {
                const modal = document.getElementById('coWriterModal') as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                }
              }}>
                Experience Cowriter
            </button>
            <dialog id="coWriterModal" className="modal">
              <div className="modal-box">
              <p className="text-[#17123D] text-md font-semibold text-center">Sorry!  You must have keys 🔑 to access Cowriter.  Contact us <a href="mailto:Joel.Kaiser@firstrule.ai" className="text-blue-800">here </a> to learn more.</p>
              <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          ) : (
          <div id="isCowriterGroup">
            <Link href="/tests" className='w-full'>
              <button className="btn bg-zinc-50 md:btn-lg md:text-lg w-full hover:bg-zinc-50 text-[#17123D] border-[#17123D]" hidden={!isCowriter}>Experience Cowriter</button>
            </Link>
          </div>
        )}
      </div>
      <div className="divider w-full">OR</div>
      <Link href="/tests/joelTests/uploadFiles" className='w-full'>
        <button className="btn bg-zinc-50 md:btn-lg md:text-lg w-full hover:bg-zinc-50 text-[#17123D] border-[#17123D]">Clone Vocals</button>
      </Link>
    </div>
  )
}

export default WelcomeScreen