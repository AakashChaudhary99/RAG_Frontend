import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ChatBox from './components/ChatBox'

function App() {

  const [fileUploaded, setFileUploaded] = useState(false)

  const handleFileUpload = () => {
    setFileUploaded(true)
  }

  return (
    <>
      <div className='flex flex-col items-center gap-2 min-h-screen'>
        <h3 className='text-orange-600 text-xl md:text-4xl bg-black text-center p-5 w-[97%] rounded-3xl custom-font'>
          Reading PDFs made Easy
        </h3>

        <div className='flex flex-1 w-full px-4 py-3 gap-2 min-h-0'>
          <div className='w-[20%]'>
            <FileUpload cb={handleFileUpload}/>
          </div>
          <div className={`bg-white shadow-lg rounded-xl w-[79%] ${!fileUploaded?'hidden':'block'}`}>
            <ChatBox />
          </div>
        </div>
        
      </div>
    </>
  )
}

export default App
