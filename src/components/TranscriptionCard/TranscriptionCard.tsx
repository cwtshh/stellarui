import { useEffect } from 'react';
import { FaCirclePlay } from 'react-icons/fa6'

interface TranscriptionCardProps {
  TextInfo: any;
  onClick: (start: number) => void;
}

export const TranscriptionCard = ({ TextInfo, onClick }: TranscriptionCardProps) => {
  const time_span = (seconds: number) => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 3600 % 60);

    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const time_info = time_span(TextInfo.start) + ' - ' + time_span(TextInfo.end);

  return (
    <div role='button' onClick={() => onClick(TextInfo.start)} className='bg-[#005e15] p-5 flex rounded-xl hover:bg-[#01801d] transition-colors'>
        <div>
            <FaCirclePlay role='button' className="mr-2 text-3xl text-justify" />
        </div>
        <p className='text-justify'>
            <strong>{time_info}</strong> - {TextInfo.text}
        </p>
    </div>
  )
}
