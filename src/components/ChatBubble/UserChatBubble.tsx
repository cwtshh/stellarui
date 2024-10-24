import HighlightText from '../HighlightText/HighlightText';

const UserChatBubble = ({ message }: any) => {
  const date = new Date(message.created_at).toLocaleString('pt-br');

  let file_name = message.file_attachment.file_name
  let file_path = message.file_attachment.file_path

    return (
        <div className="chat chat-end">
            <div className="chat-bubble  bg-secondary max-w-[90rem] break-words whitespace-pre-wrap">
            {file_name || file_path ? (
              <>
                <div>{file_name}</div>
              </>
            ) : (
              <>
              
              </>
            )}
              <HighlightText text={message.content} />
            </div>
            <div className="chat-footer text-white opacity-50">{date.replaceAll(',', ' | ')}</div>
        </div>
    )
}

export default UserChatBubble;
