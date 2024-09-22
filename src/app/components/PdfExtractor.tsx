'use client';

import React, { useState } from 'react';

const PdfExtractor: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractText = async (file: File) => {
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setText(data.text || 'No text extracted');
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      setError('Failed to extract text from PDF: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => e.target.files && extractText(e.target.files[0])}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {text}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PdfExtractor;