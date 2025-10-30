import { useState } from "react";
import ChatBot from "react-chatbotify";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Enhanced settings with more visually appealing options
  const settings = {
    isOpen: isOpen,
    toggleChat: () => setIsOpen(!isOpen),
    general: {
      primaryColor: "#4D8AFF", // Modern blue
      secondaryColor: "#6C4DFF", // Complementary purple
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      embedded: true,
      borderRadius: 12,
      width: 360,
      height: 520,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
    header: {
      title: "React ChatBotify Assistant",
      subtitle: "Here to help you build awesome chatbots",
      showCloseButton: true, // Use built-in close button
      avatar: {
        src: "/api/placeholder/40/40",
        alt: "Bot Avatar",
      },
      backgroundColor: "#4D8AFF",
      titleColor: "#FFFFFF",
      subtitleColor: "rgba(255,255,255,0.8)",
      closeButtonColor: "#FFFFFF",
    },
    launcher: {
      shape: "round", // Options: round, square, rectangle
      backgroundColor: "#4D8AFF",
      iconColor: "#FFFFFF",
      showText: true,
      text: "Chat with us",
      iconType: "chat", // Options: chat, help, support
      animation: "bounce", // Options: fade, bounce, slide
      position: {
        horizontal: "right",
        vertical: "bottom",
      },
    },
    input: {
      placeholder: "Type a message or select an option...",
      borderRadius: 20,
      backgroundColor: "#F5F8FF",
      textColor: "#333333",
      sendButtonColor: "#4D8AFF",
      placeholderColor: "#AAAAAA",
      focusColor: "#4D8AFF",
    },
    messages: {
      botMessageBackgroundColor: "#F0F7FF",
      botMessageTextColor: "#333333",
      userMessageBackgroundColor: "#4D8AFF",
      userMessageTextColor: "#FFFFFF",
      timestampColor: "#AAAAAA",
      showTimestamp: true,
      messageSpacing: 12,
      avatarSize: 36,
    },
    options: {
      backgroundColor: "#F0F7FF",
      hoverBackgroundColor: "#E0EDFF",
      textColor: "#4D8AFF",
      borderRadius: 8,
      borderColor: "#E0EDFF",
      marginTop: 12,
      marginBottom: 12,
    },
    audio: {
      disabled: false,
      volume: 0.5,
      playSound: true,
    },
    chatHistory: {
      storageKey: "concepts_settings",
      maxMessages: 50,
    },
    animations: {
      typing: {
        enabled: true,
        speed: 0.05,
      },
      messageTransition: {
        duration: 400,
        timingFunction: "ease-out",
      },
    },
  };

  // Enhanced help options with emojis
  const helpOptions = [
    "🚀 Quickstart",
    "📚 API Docs",
    "🔍 Examples",
    "💻 Github",
    "🤝 Discord",
  ];

  // Enhanced flow with better messages and transitions
  const flow = {
    start: {
      message:
        "Hello there! 👋 I'm your React ChatBotify assistant! Welcome to this powerful chatbot framework.",
      transition: { duration: 800, animation: "fade" },
      path: "introduction",
    },
    introduction: {
      message:
        "I'm here to help you build amazing conversational experiences for your users. What would you like to know?",
      transition: { duration: 800, animation: "fade" },
      path: "show_options",
    },
    show_options: {
      message:
        "Here are some helpful resources to get you started with React ChatBotify:",
      options: helpOptions,
      path: "process_options",
    },
    prompt_again: {
      message: "Is there anything else I can help you with?",
      options: helpOptions,
      path: "process_options",
    },
    unknown_input: {
      message:
        "I'm sorry, I don't understand that request. Please select one of the options below or ask a different question.",
      options: helpOptions,
      path: "process_options",
    },
    process_options: {
      transition: { duration: 300, animation: "fade" },
      chatDisabled: true,
      path: async (params) => {
        let link = "";
        switch (params.userInput) {
          case "🚀 Quickstart":
            link = "https://react-chatbotify.com/docs/introduction/quickstart/";
            break;
          case "📚 API Docs":
            link = "https://react-chatbotify.com/docs/api/settings";
            break;
          case "🔍 Examples":
            link = "https://react-chatbotify.com/docs/examples/basic_form";
            break;
          case "💻 Github":
            link = "https://github.com/tjtanjin/react-chatbotify/";
            break;
          case "🤝 Discord":
            link = "https://discord.gg/6R4DK4G5Zh";
            break;
          default:
            return "unknown_input";
        }
        await params.injectMessage("Opening link for you momentarily...");
        setTimeout(() => {
          window.open(link);
        }, 1000);
        return "repeat";
      },
    },
    repeat: {
      transition: { duration: 1500, animation: "fade" },
      path: "prompt_again",
    },
  };

  return (
    <div className="relative max-w-md mx-auto">
      <ChatBot settings={settings} flow={flow} />
    </div>
  );
};

export default Bot;
