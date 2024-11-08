import { useChat } from "../../context/ChatContext";
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from "react";

export default function ArchivedChats() {
  const { user } = useAuth();
  const { setArchivedChats, get_archived_chats, delete_chat } = useChat();
  
  useEffect(() => {
    if (user) {
      get_archived_chats(user._id); // Ou qualquer outro valor que seja necessário para o user_id
    }
  }, [user, get_archived_chats]);

  // Função para retirar o chat do arquivado
  // const handleUnarchive = async (chatId: string) => {
  //   try {
  //     await unarchive_chat(chatId);
  //     setArchivedChats((prev) => prev.filter((chat) => chat._id !== chatId));
  //   } catch (error) {
  //     console.error("Erro ao retirar do arquivado", error);
  //   }
  // };

  // Função para excluir o chat
  // const handleDelete = async (chatId: string) => {
  //   try {
  //     await delete_chat(chatId);
  //     // Após a exclusão, o chat é removido do estado automaticamente na função `delete_chat`
  //   } catch (error) {
  //     console.error("Erro ao excluir chat", error);
  //   }
  // };

  return (
    <div>
      {archivedChats.length > 0 ? (
        archivedChats.map((chat) => (
          <div key={chat._id} className="chat-item">
            <div className="chat-info">
              <p><strong>Nome:</strong> {chat.name}</p>
              <p><strong>Data de criação:</strong> {new Date(chat.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="chat-actions">
              {/* <button onClick={() => handleUnarchive(chat._id)}>Retirar dos Arquivados</button> */}
              <button onClick={() => handleDelete(chat._id)}>Excluir Chat</button>
            </div>
          </div>
        ))
      ):(
        <p>Não há chats arquivados</p>
      )}
    </div>
  );
}
