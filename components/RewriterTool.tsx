import React, { useState } from 'react';
import { AudienceType, StyleType, ToneType, RewriterOptions } from '../types';
import { rewriteAnnouncement } from '../services/geminiService';
import { EXAMPLE_INPUT } from '../constants';
import { HTMLPreview } from './HTMLPreview';
import { Sparkles, Code, Eye, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';

export const RewriterTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [options, setOptions] = useState<RewriterOptions>({
    audience: 'Students',
    style: 'Engaging',
    tone: 'Friendly'
  });
  const [outputHtml, setOutputHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setOutputHtml(null);

    try {
      const result = await rewriteAnnouncement(inputText, options);
      setOutputHtml(result);
    } catch (err: any) {
      console.error("Rewrite error details:", err);
      
      let message = "An unexpected error occurred.";
      if (err.message) {
        message = err.message;
      }
      
      // Specifically handle common API and environment issues
      if (message.includes("API Key missing") || message.includes("API_KEY")) {
        setError("Configuration Error: The API_KEY environment variable is not set. Please add it to your Netlify Site Settings (Environment Variables) and redeploy.");
      } else if (message.includes("API key not found") || message.includes("403") || message.includes("401") || message.includes("invalid")) {
        setError("Authentication Error: The provided API key is invalid or unauthorized. Please verify your key in Google AI Studio.");
      } else if (message.includes("quota") || message.includes("429")) {
        setError("Rate Limit Error: You have exceeded your Gemini API quota. Please wait a moment before trying again.");
      } else {
        setError(`Failed to generate: ${message}. Please check the browser console for details.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (outputHtml) {
      navigator.clipboard.writeText(outputHtml);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const loadExample = () => {
    setInputText(EXAMPLE_INPUT);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Input and Controls */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">1. Draft Message</h3>
            <button 
              onClick={loadExample}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Load Example
            </button>
          </div>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none bg-gray-900 text-yellow-400 placeholder-gray-500"
            placeholder="Paste your rough draft here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Customize</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Students', 'Staff', 'Faculty'] as AudienceType[]).map((audi) => (
                  <button
                    key={audi}
                    onClick={() => setOptions({ ...options, audience: audi })}
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      options.audience === audi
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {audi}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Regular', 'Engaging', 'Social Media'] as StyleType[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setOptions({ ...options, style: style })}
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      options.style === style
                        ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <div className="flex gap-3">
                {(['Formal', 'Friendly'] as ToneType[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setOptions({ ...options, tone: tone })}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all ${
                      options.tone === tone
                        ? 'bg-green-50 border-green-500 text-green-700 font-medium'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRewrite}
          disabled={!inputText.trim() || isGenerating}
          className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-lg shadow-md transition-all ${
            !inputText.trim() || isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isGenerating ? (
            <>
              <RotateCcw className="animate-spin w-5 h-5" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate
            </>
          )}
        </button>

        {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Error Details:</p>
                  <p>{error}</p>
                </div>
            </div>
        )}
      </div>

      {/* Right Column: Output */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye size={16} /> Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'code'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code size={16} /> Code
            </button>
          </div>
          
          {outputHtml && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                 isCopied 
                 ? 'bg-green-100 text-green-700 border border-green-200' 
                 : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
              {isCopied ? 'Copied!' : 'Copy HTML'}
            </button>
          )}
        </div>

        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          {outputHtml ? (
            activeTab === 'preview' ? (
              <HTMLPreview html={outputHtml} />
            ) : (
              <div className="w-full h-full relative">
                <textarea
                    readOnly
                    value={outputHtml}
                    className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-gray-900 text-gray-300 rounded-lg focus:outline-none resize-none"
                />
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p>Generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};