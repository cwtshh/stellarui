import { FaCirclePlay } from 'react-icons/fa6'

interface TranscriptionCardProps {
    text: string,
    speaker: string
}

export const TranscriptionCard = ({ text, speaker }: TranscriptionCardProps) => {
  return (
    <div className='bg-[#005e15] p-5 flex rounded-xl hover:bg-[#01801d] transition-colors'>
        <div>
            <FaCirclePlay role='button' className="mr-2 text-3xl text-justify" />
        </div>
        <p className='text-justify'>
            <strong>{speaker}</strong> - {text}
        </p>
    </div>
  )
}
