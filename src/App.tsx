import React, { useState } from 'react';
import { Upload, Sparkles, Brain, Target, Zap, Bot, Star } from 'lucide-react';
import { analyzeResume } from './services/gemini';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { SkeletonLoader } from './components/SkeletonLoader';
import type { AnalysisResult } from './types';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-red-400" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your resume in seconds"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      title: "Skill Assessment",
      description: "Detailed analysis of technical and soft skills"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Career Insights",
      description: "Get actionable insights for career growth"
    }
  ];

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError('Please enter your resume text');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const analysisResult = await analyzeResume(resumeText);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <header className="glassmorphism sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold gradient-text">
              Rsumai
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="stats-card">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">115+ happy clients</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!result && (
          <div className="mb-12 text-center hero-glow">
            <h2 className="text-6xl font-bold mb-6 gradient-text leading-tight max-w-4xl mx-auto">
              Ready to Transform Your Resume with AI?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Unlock your career potential with our advanced AI-powered resume analysis. Get detailed insights and recommendations in seconds.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="acrylic-card p-6 rounded-xl hover-lift">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-white/5">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 gradient-text">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Resume Input */}
          <div className="acrylic-card rounded-lg p-6 gradient-border">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold gradient-text">Resume Text</h2>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-48 px-4 py-2 rounded-md acrylic-blur focus-ring resize-none placeholder:text-gray-500"
              aria-label="Resume text input"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="cta-button"
                aria-label={loading ? 'Analyzing resume...' : 'Analyze resume'}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              <button
                onClick={() => setResumeText('')}
                className="secondary-button"
                aria-label="Clear resume text"
              >
                Clear
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-md acrylic-card" role="alert">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Dashboard */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <AnalysisDashboard result={result} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
