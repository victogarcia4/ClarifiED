import React from 'react';

interface HTMLPreviewProps {
  html: string;
}

export const HTMLPreview: React.FC<HTMLPreviewProps> = ({ html }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-inner">
        <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200 uppercase tracking-wider">
            Preview
        </div>
      <div 
        className="p-6 overflow-auto max-h-[600px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
