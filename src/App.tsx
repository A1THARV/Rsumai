import React, { useState } from 'react';
import { Upload, Key } from 'lucide-react';
import { analyzeResume } from './services/gemini';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import type { AnalysisResult } from './types';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (!resumeText) {
      setError('Please enter your resume text');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const analysisResult = await analyzeResume(apiKey, resumeText);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Resume Analysis System</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* API Key Input */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Gemini API Key</h2>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Resume Input */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Resume Text</h2>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-48 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Dashboard */}
          <AnalysisDashboard result={result} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;