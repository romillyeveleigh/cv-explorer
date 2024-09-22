"use client";

const pdfToText = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.text) {
      throw new Error("No text extracted");
    }

    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    //   setError('Failed to extract text from PDF: ' + (error as Error).message)
    throw error;
  }
};

//   return { pdfToText };

//   //   return (
//   //     <div>
//   //       <input
//   //         type="file"
//   //         accept=".pdf"
//   //         onChange={(e) => e.target.files && extractText(e.target.files[0])}
//   //       />
//   //       {isLoading && <p>Loading...</p>}
//   //       {error && <p style={{ color: 'red' }}>{error}</p>}
//   //       {text && (
//   //         <div>
//   //           <h3>Extracted Text:</h3>
//   //           <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
//   //             {text}
//   //           </pre>
//   //         </div>
//   //       )}
//   //     </div>
//   //   );
// };

export default pdfToText;
