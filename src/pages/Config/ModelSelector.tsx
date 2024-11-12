import { useState } from "react";
import ModelList from "./ModelList";
import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import axios from "axios";
import { toast } from 'react-toastify';

export default function ModelSelector() {
    const [ModelName, setModelName] = useState("");
    const [ModelType, setModelType] = useState("");
    const [ModelSize, setModelSize] = useState("");
    const [ComputerType, setComputerType] = useState("");
    const [Device, setDevice] = useState("");

    // Função para chamar a API do Pulsares
    const loadModel = async () => {
        if (!ModelName || !ModelType || !ModelSize || !ComputerType || !Device) {
            toast.error("Por favor, selecione todas as opções antes de salvar.");
            return;
        }

        try {
            const response = await axios.post<{ message: string }>(`${BASE_TRANSCRIPTION_API_URL}/define-model/`, {
                model_name: ModelName,
                model_size: ModelSize,
                compute_type: ComputerType,
                device: Device,
                model_type: ModelType,
            });
            if (response.status === 200) {
                toast.success("Modelo carregado com sucesso!");
            } else {
                toast.error("Erro ao carregar o modelo. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao carregar o modelo:", error);
            toast.error("Falha ao carregar o modelo. Tente novamente.");
        }
    };

    return (
        <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">
                Configurações do Modelo
            </h2>

            {/* Formulário de Configurações */}
            <div className="mb-4">
                <label htmlFor="modelName" className="block text-sm font-medium text-green-200 mb-2">
                    Nome do Modelo
                </label>
                <input
                    id="modelName"
                    type="text"
                    value={ModelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Digite o nome do modelo"
                    className="block w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
                />
            </div>

            {/* Seletor de Tamanho do Modelo */}
            <div className="mb-4">
                <label htmlFor="size" className="block text-sm font-medium text-green-200 mb-2">
                    Tamanho do Modelo
                </label>
                <select
                    id="size"
                    value={ModelSize}
                    onChange={(e) => setModelSize(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Selecione um Tamanho</option>
                    <option value="tiny">Tiny</option>
                    <option value="base">Base</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="turbo">Turbo</option>
                </select>
            </div>

            {/* Seletor de Tipo de Computador */}
            <div className="mb-4">
                <label htmlFor="computertype" className="block text-sm font-medium text-green-200 mb-2">
                    Tipo de Computador
                </label>
                <select
                    id="computertype"
                    value={ComputerType}
                    onChange={(e) => setComputerType(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Selecione um Tipo</option>
                    <option value="int8">Integer 8 bits</option>
                    <option value="float16">Float 16 bits</option>
                    <option value="float32">Float 32 bits</option>
                </select>
            </div>

            {/* Seletor de Dispositivo */}
            <div className="mb-4">
                <label htmlFor="device" className="block text-sm font-medium text-green-200 mb-2">
                    Dispositivo
                </label>
                <select
                    id="device"
                    value={Device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Selecione um Dispositivo</option>
                    <option value="cpu">CPU</option>
                    <option value="gpu">GPU</option>
                    <option value="cuda">Cuda</option>
                </select>
            </div>

            {/* Seletor de Tipo de Modelo */}
            <div className="mb-4">
                <label htmlFor="modeltype" className="block text-sm font-medium text-green-200 mb-2">
                    Tipo de Modelo
                </label>
                <select
                    id="modeltype"
                    value={ModelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Selecione um Tipo de Modelo</option>
                    <option value="faster_whisper">Faster Whisper</option>
                    <option value="whisperx">WhisperX</option>
                </select>
            </div>

            {/* Botão Salvar */}
            <button
                onClick={loadModel}
                className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
                Salvar
            </button>

            {/* Componente ModelList para listar e deletar modelos */}
            <ModelList />
        </div>
    );
}
