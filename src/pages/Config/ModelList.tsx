import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_TRANSCRIPTION_API_URL } from '../../utils/constants';
import { NotifyToast } from "../../components/Toast/Toast";

export default function ModelList() {
    const [models, setModels] = useState<{ id: string; name: string }[]>([]);

    const fetchModels = async () => {
        try {
            const response: any = await axios.get(`${BASE_TRANSCRIPTION_API_URL}/list-models/`);
            // console.log("Dados da API:", response.data);
            setModels(response.data.models);
        } catch (error) {
            console.error("Erro ao carregar os modelos:", error);
            NotifyToast({ message: 'Erro ao carregar os modelos.', type: 'error' });
        }
    };

    const deleteModel = async (model: any) => {
        try {
            await axios.delete(`${BASE_TRANSCRIPTION_API_URL}/delete-models/${model}`);
            NotifyToast({ message: 'Modelo deletado com sucesso.', type: 'success' });
            fetchModels();
        } catch (error) {
            console.error("Erro ao deletar o modelo:", error);
            NotifyToast({ message: 'Erro ao deletar o modelo.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    // Verificação de models após carregamento
    useEffect(() => {
        console.log("Models após o fetch:", models);
    }, [models]);

    return (
        <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">
                Modelos Carregados
            </h2>
            <ul>
    {models && Array.isArray(models) && models.length > 0 ? (
        models.map((model) => (
            <li key={model.id} className="flex justify-between items-center mb-4 bg-green-800 p-3 rounded">
                <span className="text-green-100">{model.name}</span>
                <button
                    onClick={() => deleteModel(model)}
                    className="bg-red-600 text-green-50 py-1 px-3 rounded-md hover:bg-red-700"
                >
                    Deletar
                </button>
            </li>
        ))
    ) : (
        <li className="text-green-100">Nenhum modelo carregado.</li>
    )}
</ul>

        </div>
    );
}
