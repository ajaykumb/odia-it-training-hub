import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ChatSupport() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          className="w-6 h-6 cursor-pointer text-blue-700"
          onClick={() => router.push("/student-dashboard")}
        />
        <h1 className="text-2xl font-bold text-blue-700">Chat Support</h1>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 h-[70vh] flex flex-col">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto border-b pb-4">
          <p className="text-gray-500 text-center mt-10">
            👋 Start chatting with your instructor...
          </p>
        </div>

        {/* Input Area */}
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
