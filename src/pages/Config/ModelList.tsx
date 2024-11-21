import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import { NotifyToast } from "../../components/Toast/Toast";
import { LuPlusSquare } from "react-icons/lu";
import { FaTrash } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";


export default function ModelList() {
    const [models, setModels] = useState<string[]>([]);

    const fetchModels = async () => {
        try {
            const response: any = await axios.get(`${BASE_TRANSCRIPTION_API_URL}/list-models/`);
            setModels(response.data.models);
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    };

    const deleteModel = async (model: string) => {
        try {
            await axios.delete(`${BASE_TRANSCRIPTION_API_URL}/delete-models/${model}`);
            NotifyToast({ message: 'Modelo deletado com sucesso.', type: 'success' });
            fetchModels();
        } catch (error) {
            NotifyToast({ message: 'Erro ao deletar o modelo.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-green-50 border-b flex justify-between items-center border-green-700 pb-6">
                Modelos Carregados
                <Link to='/configuracoes/modelSelector' className='flex items-center gap-3 text-green-300 hover:text-green-100 transition-colors duration-300 ease-in-out'>
                    <p className='text-lg'>Adicionar</p>
                    <LuPlusSquare />
                </Link>
            </h2>
            <ul>
                {models && models.length > 0 ? (
                    models.map((model) => (
                        <li key={model} className="flex justify-between items-center mb-4 bg-green-800 p-3 rounded">
                            <span className="text-green-100">{model}</span>
                            <button
                                onClick={() => deleteModel(model)}
                                className="bg-red-600 text-green-50 py-1 px-3 rounded-md hover:bg-red-700 btn">
                                <FaTrash className="text-2xl" />
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-green-100 flex justify-center items-center">Nenhum modelo carregado.</li>
                )}
            </ul>
        </div>
    );
}
