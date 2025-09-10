import { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    if (!window.botpressWebChat?.isInitialized) {
      window.botpressWebChat.init({
        composerPlaceholder: "Escribe tu mensaje...",
        botConversationDescription: "Asistente virtual",
        clientId: "154b8b7b-d15f-4d47-9b5d-00dc3ca7c0fa",
        botId: "8400a4b7-6d0a-464c-8805-0f62e9881ecb",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        lazySocket: true,
        themeName: "prism",
        enableConversationDeletion: true,
        showPoweredBy: false,
      });
    }
  }, []);

  return <div />;
}

export default Chatbot;
