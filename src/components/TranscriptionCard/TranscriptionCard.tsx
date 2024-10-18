import { forwardRef } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';

interface TranscriptionCardProps {
  TextInfo: any;
  onClick: (start: number) => void;
  className: string;
}

export const TranscriptionCard = forwardRef<HTMLDivElement, TranscriptionCardProps>(({ TextInfo, onClick, className }, ref) => {
  const time_span = (seconds: number) => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 3600 % 60);

    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const time_info = time_span(TextInfo.start) + ' - ' + time_span(TextInfo.end);

  return (
    <div role='button' onClick={() => onClick(TextInfo.start)} className={className} ref={ref}>
        <div>
            <FaCirclePlay role='button' className="text-[#6ea1f7] mr-2 text-3xl text-justify" />
        </div>
        <p className='text-justify'>
            <strong className='text-[#6ea1f7] hover:underline'>{time_info}</strong> - {TextInfo.text}
        </p>
    </div>
  );
});
