import { TranscriptionCard } from '../../components/TranscriptionCard/TranscriptionCard';
import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import React, { useEffect, useRef, useState } from 'react';
import { NotifyToast } from '../../components/Toast/Toast';
import { downloadTranscriptionPDF } from './TranscriptPDF'
import { FaPlusCircle } from "react-icons/fa";
import chatbg from '../../assets/chatbg.jpeg';
import { FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { FaPencil } from 'react-icons/fa6';

const Trancription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [segments, setSegments] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [speakerMap, setSpeakerMap] = useState<{ [key: string]: string }>({});
  const [filteredSegments, setFilteredSegments] = useState<any[]>([]);
  
  const [timeSearchTerm, setTimeSearchTerm] = useState<string>('');
  const [textSearchTerm, setTextSearchTerm] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove tudo que não é número
    let formattedValue = '';

    // Adiciona ":" automaticamente
    if (value.length > 0) formattedValue += value.substring(0, 2); // Horas
    if (value.length > 2) formattedValue += ':' + value.substring(2, 4); // Minutos
    if (value.length > 4) formattedValue += ':' + value.substring(4, 6); // Segundos

    setTimeSearchTerm(formattedValue);

    // Regex para validar o tempo
    const regex = /^(?:([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)?)$/;
    const matches = formattedValue.match(regex);

    if (matches) {
      const hours = matches[1] ? parseInt(matches[1], 10) : 0;
      const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
      const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

      const timeInSeconds = hours * 3600 + minutes * 60 + seconds;

      const index = segments.findIndex((segment) => {
        return (
          segment.start <= timeInSeconds &&
          (segment.end ? segment.end >= timeInSeconds : true)
        );
      });

      if (index !== -1) {
        setHighlightedIndex(index);
        transcriptionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setHighlightedIndex(null);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextSearchTerm(value);
  
    // Pesquisa por texto
    const normalizedTerm = value.toLowerCase().replace(/[.,!?;]*/g, '').trim();
    const searchWords = normalizedTerm.split(/\s+/); // Divide em palavras
  
    const index = segments.findIndex((segment) => {
      const normalizedSegmentText = segment.text.toLowerCase().replace(/[.,!?;]*/g, '').trim();
      return searchWords.every(word => normalizedSegmentText.includes(word));
    });
  
    setHighlightedIndex(index);
  
    if (index !== -1 && transcriptionRefs.current[index]) {
      transcriptionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerson(e.target.value);
    // Aqui você pode adicionar lógica para filtrar segments por falante, se necessário.
  };

  const handleTransciption = async() => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        
        const response: any = await axios.post(`${BASE_TRANSCRIPTION_API_URL}/upload-video/`, formData);

        let segment_list = [];
        let speakers_list: any = [];
        for(let i = 0; i < response.data.result.segments.length; i++) {
          segment_list.push(response.data.result.segments[i]);
          if(!speakers_list[response.data.result.segments[i].speaker]) {
            speakers_list[response.data.result.segments[i].speaker] = response.data.result.segments[i].speaker;
          }
        }
        setSegments(segment_list);
        setFilteredSegments(segment_list);
        setSpeakerMap(speakers_list);
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

  const handleSpeakerChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputs = e.currentTarget.querySelectorAll('input');
    const newSpeakerMap: any = {};
    inputs.forEach((input: HTMLInputElement) => {
      newSpeakerMap[input.placeholder] = input.value;
    });

    setSpeakerMap(newSpeakerMap);
    (document.getElementById('speaker_modal') as HTMLDialogElement).close();
  }

  useEffect(() => {
    let filtered = segments;
  
    if (textSearchTerm) {
      const normalizedTerm = textSearchTerm.toLowerCase().replace(/[.,!?;]*/g, '').trim();
      filtered = filtered.filter(segment => segment.text.toLowerCase().includes(normalizedTerm));
    }
  
    if (selectedPerson) {
      filtered = filtered.filter(segment => segment.speaker === selectedPerson);
    }
  
    setFilteredSegments(filtered);
  }, [textSearchTerm, selectedPerson, segments]);

  return (
    <div className='h-full w-full overflow-hidden flex flex-col p-5' style={{
      backgroundImage: `url(${chatbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div className='flex items-start justify-center h-full gap-[95px]'>
        <div className=' flex text-white p-6 h-vh w-[30%] rounded-xl flex-col gap-7'>
          <div className='flex gap-2'>
            <input 
              type="text" 
              placeholder="00:00:00"
              maxLength={8}
              className='input input-bordere text-black input-accent w-[100px]' 
              onChange={handleTimeChange}
              value={timeSearchTerm}/>

            <input 
              type="text" 
              placeholder="Segmento..." 
              className='input input-bordere text-black input-accent w-[260px]' 

              onChange={handleTextChange}
              value={textSearchTerm}
            />

            <select 
              className='text-black select select-bordered w-[130px]' 
              onChange={handlePersonChange}
              value={selectedPerson}>
              <option hidden value="">Falante</option>
              <option>Nenhum</option>
              {Object.keys(speakerMap).map((person, index) => (
                <>
                  <option key={index} value={person}>{speakerMap[person]}</option>
                </>
              ))}
            </select>
          </div>
          <div onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} onScroll={handleScroll}
           className='bg-base-100 p-6 scroll-hidden h-[700px] w-[500px] rounded-xl flex flex-col gap-6 overflow-y-scroll shadow-xl'>
            {(filteredSegments.length > 0 ? filteredSegments : segments).map((item: any, index: number) => {
              const isActiveSegment = currentTime >= item.start && (index === segments.length - 1 || currentTime <= item.end);
              const isHighlighted = index === highlightedIndex;

              return (
                <TranscriptionCard
                  speaker={speakerMap[item.speaker]}
                  ref={(el) => (transcriptionRefs.current[index] = el)}
                  key={index}
                  className={`p-5 flex rounded-xl transition-colors ${isActiveSegment || isHighlighted ? 'bg-primary hover:bg-secondary' : 'bg-[#005e15] hover:bg-secondary'}`}
                  TextInfo={item}
                  onClick={seekToTime}
                />
              )
            })}
          </div>

          <div className='flex justify-center items-center w-[500px] gap-4'>
            <button onClick={() => downloadTranscriptionPDF(file, segments, speakerMap)} disabled={loading || !videoUrl} className='btn btn-primary w-[300px] flex justify-center items-center text-white p-6 rounded-xl h-full'>
              Transcrição
              <FaDownload />
            </button>
            <button onClick={() => (document.getElementById('speaker_modal') as HTMLDialogElement).showModal()} disabled={loading || !videoUrl} className='btn btn-primary flex justify-center items-center text-white p-6 rounded-xl h-full' >
              <FaPencil />
              Editar Locutores
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
      <dialog id="speaker_modal" className="modal">
        <div className="modal-box flex flex-col w-full items-center justify-center ">
          <h3 className="font-bold text-lg">Locutores</h3>
          <p className='italic'>Altere o nome de cada locutor presente na transcrição</p>
          <br />
          <form onSubmit={handleSpeakerChange} className='flex flex-col w-full items-center justify-center'>
            <p>Locutores identificados:</p>
            <div className='flex flex-col gap-5'>
              {Object.keys(speakerMap).map((speaker, index) => (
                <input key={index} type='text' placeholder={speaker} className='input input-bordered w-full max-w-xs' />
              ))}
            </div>
            <br />
            <button className='btn btn-primary mt-4'>Salvar Alterações</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Trancription;
