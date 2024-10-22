import { TranscriptionCard } from '../../components/TranscriptionCard/TranscriptionCard';
import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import React, { useEffect, useRef, useState } from 'react';
import { NotifyToast } from '../../components/Toast/Toast';
import { downloadTranscriptionPDF } from './TranscriptPDF'
import { FaPlusCircle } from "react-icons/fa";
import chatbg from '../../assets/chatbg.jpeg';
import { FaDownload } from 'react-icons/fa';
import axios from 'axios';


interface SegmentsBody {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
}

interface ResultBody {
  text: string;
  segments: SegmentsBody[];
}

interface ResponseBody {
  filename: string;
  conversion_time: number;
  transcription_time: number;
  result: ResultBody;
}

const Trancription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [segments, setSegments] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [mouseOver, setMouseOver ] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const transcriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  }

  const handleTransciption = async() => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response: any = await axios.post(`${BASE_TRANSCRIPTION_API_URL}/upload-video/`, formData);

        let segment_list = [];
        for(let i = 0; i < response.data.result.segments.length; i++) {
          segment_list.push(response.data.result.segments[i]);
        }

        setSegments(segment_list);
        NotifyToast({ type: 'success', message: 'Arquivo transcrito com sucesso' });
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        NotifyToast({ type: 'error', message: 'Erro ao transcrever o arquivo' });
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      handleTransciption();
    }
  }, [file]);

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Number(videoRef.current.currentTime.toFixed(2)));
    }
  };

  useEffect(() => {
    const activeIndex = segments.findIndex(
      (item) => currentTime >= item.start && currentTime <= item.end
    );

    if (activeIndex !== -1 && transcriptionRefs.current[activeIndex] && !mouseOver) {
      transcriptionRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, segments]);

  const handleScroll = () => {
    if (mouseOver && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className='h-full w-full overflow-hidden flex flex-col p-5' style={{ backgroundImage: `url(${chatbg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className='flex items-start justify-center h-full gap-[95px]'>
        <div className='text-white p-6 h-vh w-[30%] rounded-xl flex flex-col gap-7'>
          <div onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} onScroll={handleScroll}
           className='bg-base-100 p-6 scroll-hidden h-[780px] w-[500px] rounded-xl flex flex-col gap-6 overflow-y-scroll shadow-xl'>
            {segments.map((item: any, index: number) => {
              return (
                <TranscriptionCard
                ref={(el) => (transcriptionRefs.current[index] = el)}
                key={index}
                className={
                  currentTime >= item.start &&
                  (index === segments.length - 1 || currentTime <= item.end)
                    ? 'bg-primary flex p-5 rounded-xl hover:bg-secondary transition-colors'
                    : 'bg-[#005e15] p-5 flex rounded-xl hover:bg-secondary transition-colors'
                }
                TextInfo={item}
                onClick={seekToTime}
              />
              
              )
            })}
          </div>
          <div className='flex justify-center items-center w-[500px]'>
            <button onClick={() => downloadTranscriptionPDF(file, segments)} disabled={loading || !videoUrl} className='btn btn-primary w-[300px] flex justify-center items-center text-white p-6 rounded-xl h-full'>
              Transcrição
              <FaDownload />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-5 w-[900px] h-[800px] items-center justify-center p-6'>
          {!file && (
            <div className='bg-transparent border-[2px] w-[335px] h-[60px] flex justify-center items-center rounded-xl'>
              <input
                type="file"
                accept='.mp4, .ogg, .mkv, .webm, .avi'
                onChange={handleFileChange}
                className="file-input file-input-bordered border-none w-full max-w-xs"
              />
            </div>
          )}

          {loading && (
              <>
              <div className="flex items-center flex-col justify-center h-64">
                <p className='text-white font-bold text-3xl'>Transcrevendo</p>
                {showMessage && (
                  <p className='text-white italic'>Isso pode levar algum tempo...</p>
                )}
                <span className="bg-white loading loading-dots loading-lg"></span>
                <p className='text-[#307bf8] font-bold'>{file?.name}</p>
              </div>
            </>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className={`${loading || !videoUrl ? 'hidden' : ''} rounded-xl shadow-xl`}
            style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
            controls
            preload="false"
            onTimeUpdate={handleTimeUpdate}
          />
          {videoUrl && !loading && (
            <>
              <div className='flex justify-center items-center w-[500px]'>
              <button onClick={() => {window.location.reload()}} className='btn btn-primary w-[300px] flex justify-center items-center text-white p-6 rounded-xl h-full'>
                Transcrever Novo
                <FaPlusCircle />
              </button>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trancription;
