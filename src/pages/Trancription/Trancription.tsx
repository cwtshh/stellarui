import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { TranscriptionCard } from '../../components/TranscriptionCard/TranscriptionCard';
import { NotifyToast } from '../../components/Toast/Toast';
import axios from 'axios';
import chatbg from '../../assets/chatbg.jpeg';

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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ segments, setSegments ] = useState<any[]>([]);

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
        const response: any = await axios.post('http://0.0.0.0:8045/upload-video/', formData);

        console.log(response.data);

        // response.data.result.segments.map((item: any) => {
        //   console.log(item);
        //   setSegments([...segments, item]);
        // })

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

  return (
    <div className='h-full w-full flex flex-col p-5' style={{ backgroundImage: `url(${chatbg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className='flex items-start justify-center h-full gap-[95px]'>
        <div className='text-white p-6 h-vh w-[30%] rounded-xl flex flex-col gap-7'>
          <div className='bg-base-100 p-6 scroll-hidden h-[800px] w-[500px] rounded-xl flex flex-col gap-6 overflow-y-scroll shadow-xl'>
            {segments.map((item: any, index: number) => {
              return (
                <TranscriptionCard key={index} text={item.text} speaker='Speaker' />
              )
            })}
          </div>
          <div className='flex justify-center items-center w-[500px]'>
            <button className='btn btn-primary w-[300px] flex justify-center items-center text-white p-6 rounded-xl h-full'>
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
                onChange={handleFileChange}
                className="file-input file-input-bordered border-none w-full max-w-xs"
              />
            </div>
          )}

          {loading && (
            <>
              <div className="flex items-center flex-col justify-center h-64">
                <p className='text-white'>{file?.name}</p>
                <progress className="progress w-56 bg-secondary"></progress>
              </div>
            </>
          )}

          {videoUrl && !loading && (
            <video
              src={videoUrl}
              className='rounded-xl shadow-xl'
              style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
              controls
              preload="false"
              muted
            />
          )}
        </div>
      </div>
    </div>

  );
};

export default Trancription;
