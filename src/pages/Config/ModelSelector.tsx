import { useState, useEffect } from "react";
import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import axios from "axios";

export default function ModelSelector() {
    const [ModelName, setModelName] = useState("");
    const [ModelType, setModelType] = useState("");
    const [ModelSize, setModelSize] = useState("");
    const [ComputerType, setComputerType] = useState("");
    const [Device, setDevice] = useState("");

    // Function to call the Pulsares API
    const loadModel = async () => {
        try {
            const response = await axios.post<{ message: string }>(`${BASE_TRANSCRIPTION_API_URL}/define-model/`, {
                model_name: ModelName,
                model_size: ModelSize,
                compute_type: ComputerType,
                device: Device,
                model_type: ModelType,
            });
            console.log(response.data.message);
        } catch (error) {
            console.error("Error loading model:", error);
        }
    };

    useEffect(() => {
        if (ModelName && ModelType && ModelSize && ComputerType && Device) {
            loadModel();
        }
    }, [ModelName, ModelType, ModelSize, ComputerType, Device]);

    return (
        <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">
                Model Settings
            </h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-green-200 mb-2">
                    Model Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Type Modal Name"
                    value={ModelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full p-[11px] text-[15px] placeholder-green-100 input bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"/>
            </div>

            <div className="mb-4">
                <label htmlFor="size" className="block text-sm font-medium text-green-200 mb-2">
                    Model Size
                </label>
                <select
                    id="size"
                    value={ModelSize}
                    onChange={(e) => setModelSize(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Select a Size</option>
                    <option value="tiny">Tiny</option>
                    <option value="base">Base</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="turbo">Turbo</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="computertype" className="block text-sm font-medium text-green-200 mb-2">
                    Computer Type
                </label>
                <select
                    id="computertype"
                    value={ComputerType}
                    onChange={(e) => setComputerType(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Select a Type</option>
                    <option value="int8">Integer 8 bits</option>
                    <option value="float16">Float 16 bits</option>
                    <option value="float32">Float 32 bits</option>
                </select>
            </div>

            {/* Device Selector */}
            <div className="mb-4">
                <label htmlFor="device" className="block text-sm font-medium text-green-200 mb-2">
                    Device
                </label>
                <select
                    id="device"
                    value={Device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Select a Device</option>
                    <option value="cpu">CPU</option>
                    <option value="gpu">GPU</option>
                    <option value="cuda">Cuda</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="modeltype" className="block text-sm font-medium text-green-200 mb-2">
                    Model Type
                </label>
                <select
                    id="modeltype"
                    value={ModelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="select select-bordered cursor-pointer w-full bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400">
                    <option hidden value="">Select a Model Type</option>
                    <option value="faster_whisper">Faster Whisper</option>
                    <option value="whisperx">WhisperX</option>
                </select>
            </div>
            <button onClick={loadModel} className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">Salvar</button>
        </div>
    );
}
