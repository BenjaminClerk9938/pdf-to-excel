import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processingResult, setProcessingResult] = useState(null);

    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append('pdf', selectedFile);

        axios.post('http://localhost:3000/upload', formData, {
            responseType: 'blob',
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'processed_issuer_data.json');
            document.body.appendChild(link);
            link.click();
            setProcessingResult('File processed successfully!');
        })
        .catch(error => {
            console.error('Error uploading the file:', error);
            setProcessingResult('Failed to process the file.');
        });
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>
                Upload and Process
            </button>
            {processingResult && <p>{processingResult}</p>}
        </div>
    );
}

export default UploadForm;
