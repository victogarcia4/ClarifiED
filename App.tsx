import React from 'react';
import { RewriterTool } from './components/RewriterTool';
import { ChatBot } from './components/ChatBot';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clarifi<span className="text-blue-600">ED</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini 3 Pro
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Ideas, Expertly Formatted.</h2>
            <p className="text-gray-600 max-w-3xl">
              Turn simple text into professional, structured announcements in seconds. We bridge the gap between "plain" and "powerful" with AI-driven tone and formatting control.
            </p>
          </div>
          
          <RewriterTool />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 All rights reserved.</p>
          <p className="font-medium text-gray-700">By Dr. Victor Garcia Martinez</p>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <ChatBot />
    </div>
  );
};

export default App;