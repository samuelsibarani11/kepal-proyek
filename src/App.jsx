import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [processType, setProcessType] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [number, setNumber] = useState('');
  const [activeTab, setActiveTab] = useState('encryption');

  // Reset output when switching tabs
  useEffect(() => {
    setOutput('');
  }, [activeTab]);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProcessEncryption = async () => {
    if (!file || !key) {
      alert('Please upload a file and provide a key.');
      return;
    }

    if (![16, 24, 32].includes(key.length)) {
      alert('Key must be 16, 24, or 32 characters long.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    formData.append('process_type', processType);

    try {
      const response = await fetch('http://127.0.0.1:8000/process', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setOutput(result.result);
      } else {
        const error = await response.json();
        alert(error.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
    }
  };

  const handleProcessNumberTheory = async () => {
    if (!number) {
      alert('Please provide a number.');
      return;
    }

    const formData = new FormData();
    formData.append('number', number);

    try {
      const response = await fetch('http://127.0.0.1:8000/number-theory', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`GCD result: ${result.gcd_result}, Prime status: ${result.prime_status}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'encrypted_output.txt';
    link.click();
  };

  return (
    <div className="App">
      <h1 className="app-title">File Encryption and Number Theory</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'encryption' ? 'tab-active' : ''}
          onClick={() => setActiveTab('encryption')}
        >
          File Encryption
        </button>
        <button
          className={activeTab === 'numberTheory' ? 'tab-active' : ''}
          onClick={() => setActiveTab('numberTheory')}
        >
          Basic Number Theory
        </button>
      </div>

      {/* File Encryption Tab */}
      {activeTab === 'encryption' && (
        <div className="tab-content">
          <div className="input-group">
            <label htmlFor="fileInput" className="input-label">Upload File:</label>
            <input
              id="fileInput"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="keyInput" className="input-label">Enter Key:</label>
            <input
              id="keyInput"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Choose Process:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="encrypt"
                  checked={processType === 'encrypt'}
                  onChange={() => setProcessType('encrypt')}
                  className="radio-input"
                />
                Encrypt
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="decrypt"
                  checked={processType === 'decrypt'}
                  onChange={() => setProcessType('decrypt')}
                  className="radio-input"
                />
                Decrypt
              </label>
            </div>
          </div>

          <button onClick={handleProcessEncryption} className="process-button">Process</button>
        </div>
      )}

      {/* Basic Number Theory Tab */}
      {activeTab === 'numberTheory' && (
        <div className="tab-content">
          <div className="input-group">
            <label htmlFor="numberInput" className="input-label">Enter Number for GCD and Prime Check:</label>
            <input
              id="numberInput"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="text-input"
            />
          </div>

          <button onClick={handleProcessNumberTheory} className="process-button">Process Number Theory</button>
        </div>
      )}

      {/* Output */}
      {output && activeTab === 'encryption' && (
        <div className="output-group">
          <h2 className="output-title">Output:</h2>
          <textarea
            value={output}
            readOnly
            rows="10"
            cols="50"
            className="output-area"
          />
          <button onClick={handleDownload} className="download-button">Download Output</button>
        </div>
      )}
    </div>
  );
}

export default App;
