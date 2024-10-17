import { FaCirclePlay } from 'react-icons/fa6'
import crazyFrog from '../../video/Crazy Frog - Axel F (Official Video).mp4'
import { FaDownload } from 'react-icons/fa'
import { TranscriptionCard } from '../../components/TranscriptionCard/TranscriptionCard'


const ding_ding = [
  {
    speaker: 'CRAZYFROG',
    text: 'DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING'
  },
  { 
    speaker: 'CRAZYFROG',
    text: 'DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING'
  },
  { 
    speaker: 'CRAZYFROG',
    text: 'DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING'
  },
  {
    speaker: 'CRAZYFROG',
    text: 'DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING'
  }
]

const Trancription = () => {
  return (
    <div className='h-full w-full flex flex-col  p-5'>

      <div className='flex items-center justify-center h-full'>
        <div className='bg-primary text-white p-6 h-[50rem] w-[30%] rounded-xl flex flex-col gap-6 overflow-y-scroll shadow-xl'>
          
          {ding_ding.map((item, index) => {
            return <TranscriptionCard key={index} speaker={item.speaker} text={item.text} />
          })}

          {/* <div className='bg-[#005e15] p-5 flex rounded-xl'>
            <div>
              <FaCirclePlay role='button' className="mr-2 text-3xl text-justify" />
            </div>
            <p className='flex items-center justify-center'>
              CRAZYFROG - DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING  
            </p>
          </div>

          <div className='bg-[#005e15] p-5 flex rounded-xl'>
            <div>
              <FaCirclePlay role='button' className="mr-2 text-3xl text-justify" />
            </div>
            <p className='flex items-center justify-center'>
              CRAZYFROG - DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING DING
            </p>
          </div> */}




        </div>
        <div className='flex flex-col gap-5 h-full items-center justify-center p-6'>
          <video src={crazyFrog} className='w-full rounded-xl shadow-xl' controls></video>
        </div>
      </div>

      <div>
        <button className='btn btn-primary text-white p-6 rounded-xl h-full'>
          Transcrição
          <FaDownload />  
        </button>
      </div>

    </div>
  )
}

export default Trancription