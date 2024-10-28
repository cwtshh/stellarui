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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSearchTerm(term);

    const index = segments.findIndex((segment) =>
      segment.text.toLowerCase().includes(term.toLowerCase())
    );
    setHighlightedIndex(index);

    if (index !== -1 && transcriptionRefs.current[index]) {
      transcriptionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTransciption = async() => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = {
          data: {
            result: {
              segments: [
                { id: 1, seek: 0, start: 0.0, end: 5.0, text: "Segmento 1" },
                { id: 2, seek: 5, start: 5.0, end: 10.0, text: "Segmento 2" },
                { id: 3, seek: 10, start: 10.0, end: 15.0, text: "Segmento 3" },
                { id: 4, seek: 15, start: 15.0, end: 20.0, text: "Segmento 4" },
                { id: 5, seek: 20, start: 20.0, end: 25.0, text: "Segmento 5" },
                { id: 6, seek: 25, start: 25.0, end: 30.0, text: "Segmento 6" },
                { id: 7, seek: 30, start: 30.0, end: 35.0, text: "Segmento 7" },
                { id: 8, seek: 35, start: 35.0, end: 40.0, text: "Segmento 8" },
                { id: 9, seek: 40, start: 40.0, end: 45.0, text: "Segmento 9" },
                { id: 10, seek: 45, start: 45.0, end: 50.0, text: "Segmento 10" },
                { id: 11, seek: 50, start: 50.0, end: 55.0, text: "Segmento 11" },
                { id: 12, seek: 55, start: 55.0, end: 60.0, text: "Segmento 12" },
                { id: 13, seek: 60, start: 60.0, end: 65.0, text: "Segmento 13" },
                { id: 14, seek: 65, start: 65.0, end: 70.0, text: "Segmento 14" },
                { id: 15, seek: 70, start: 70.0, end: 75.0, text: "Segmento 15" },
                { id: 16, seek: 75, start: 75.0, end: 80.0, text: "Segmento 16" },
                { id: 17, seek: 80, start: 80.0, end: 85.0, text: "Segmento 17" },
                { id: 18, seek: 85, start: 85.0, end: 90.0, text: "Segmento 18" },
                { id: 19, seek: 90, start: 90.0, end: 95.0, text: "Segmento 19" },
                { id: 20, seek: 95, start: 95.0, end: 100.0, text: "Segmento 20" },
                { id: 21, seek: 100, start: 100.0, end: 105.0, text: "Segmento 21" },
                { id: 22, seek: 105, start: 105.0, end: 110.0, text: "Segmento 22" },
                { id: 23, seek: 110, start: 110.0, end: 115.0, text: "Segmento 23" },
                { id: 24, seek: 115, start: 115.0, end: 120.0, text: "Segmento 24" },
                { id: 25, seek: 120, start: 120.0, end: 125.0, text: "Segmento 25" },
                { id: 26, seek: 125, start: 125.0, end: 130.0, text: "Segmento 26" },
                { id: 27, seek: 130, start: 130.0, end: 135.0, text: "Segmento 27" },
                { id: 28, seek: 135, start: 135.0, end: 140.0, text: "Segmento 28" },
                { id: 29, seek: 140, start: 140.0, end: 145.0, text: "Segmento 29" },
                { id: 30, seek: 145, start: 145.0, end: 150.0, text: "Segmento 30" },
                { id: 31, seek: 150, start: 150.0, end: 155.0, text: "Segmento 31" },
                { id: 32, seek: 155, start: 155.0, end: 160.0, text: "Segmento 32" },
                { id: 33, seek: 160, start: 160.0, end: 165.0, text: "Segmento 33" },
                { id: 34, seek: 165, start: 165.0, end: 170.0, text: "Segmento 34" },
                { id: 35, seek: 170, start: 170.0, end: 175.0, text: "Segmento 35" },
                { id: 36, seek: 175, start: 175.0, end: 180.0, text: "Segmento 36" },
                { id: 37, seek: 180, start: 180.0, end: 185.0, text: "Segmento 37" },
                { id: 38, seek: 185, start: 185.0, end: 190.0, text: "Segmento 38" },
                { id: 39, seek: 190, start: 190.0, end: 195.0, text: "Segmento 39" },
                { id: 40, seek: 195, start: 195.0, end: 200.0, text: "Segmento 40" },
              ]
            }
          }
        };
        
        let segment_list: Array<{id: number, seek: number, start: number, end: number, text: string}> = [];
        
        for(let i = 0; i < response.data.result.segments.length; i++) {
          segment_list.push(response.data.result.segments[i]);
        }
        // const response: any = await axios.post(`${BASE_TRANSCRIPTION_API_URL}/upload-video/`, formData);

        // let segment_list = [];
        // for(let i = 0; i < response.data.result.segments.length; i++) {
        //   segment_list.push(response.data.result.segments[i]);
        // }

        setSegments(segment_list);
        NotifyToast({ type: 'success', message: 'Arquivo transcrito com sucesso' });
        
        setLoading(false);
      } catch (error) {
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
    <div className='h-full w-full overflow-hidden flex flex-col p-5' style={{
      backgroundImage: `url(${chatbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div className='flex items-start justify-center h-full gap-[95px]'>
        <div className='text-white p-6 h-vh w-[30%] rounded-xl flex flex-col gap-7'>
        <input 
            type="text" 
            placeholder="Pesquisar segmento..." 
            className='input input-bordere text-black input-accent w-[500px]' 
            style={{ display: loading || !videoUrl ? 'none' : 'block' }}
            onChange={handleSearchChange}
            value={searchTerm}
          />
          <div onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} onScroll={handleScroll}
           className='bg-base-100 p-6 scroll-hidden h-[780px] w-[500px] rounded-xl flex flex-col gap-6 overflow-y-scroll shadow-xl'>
            {segments.map((item: any, index: number) => {
              const isActiveSegment = currentTime >= item.start && (index === segments.length - 1 || currentTime <= item.end);
              const isHighlighted = index === highlightedIndex;

              return (
                <TranscriptionCard
                  ref={(el) => (transcriptionRefs.current[index] = el)}
                  key={index}
                  className={`p-5 flex rounded-xl transition-colors ${isActiveSegment || isHighlighted ? 'bg-primary hover:bg-secondary' : 'bg-[#005e15] hover:bg-secondary'}`}
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
