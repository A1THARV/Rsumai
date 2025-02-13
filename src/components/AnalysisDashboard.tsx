import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Download,
  AlertCircle,
  Award,
  BookOpen,
  BrainCircuit,
  Building,
  FileSearch,
  GraduationCap,
  LineChart as LineChartIcon,
  ListChecks,
  MessageSquare,
  Target,
  Workflow,
} from 'lucide-react';
import type { AnalysisResult, ChartData } from '../types';

interface Props {
  result: AnalysisResult | null;
  loading: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function AnalysisDashboard({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>Upload a resume to see the analysis</p>
      </div>
    );
  }

  const handleExport = () => {
    const jsonString = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const overallMetrics = [
    { name: 'Technical Skills', value: result.technicalSkills.proficiencyLevels.overall },
    { name: 'Experience', value: result.experience.roleRelevance },
    { name: 'Education', value: result.education.relevance },
    { name: 'Soft Skills', value: result.softSkills.communication },
    { name: 'ATS Score', value: result.atsOptimization.compatibility },
  ];

  return (
    <div className="space-y-8">
      {/* Overall Score Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Overall Analysis</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-blue-500">{result.overallScore}</span>
                <span className="text-sm text-gray-500">Overall Score</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70 * result.overallScore / 100} ${2 * Math.PI * 70}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="col-span-2">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={overallMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Technical Skills Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Skill Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={result.technicalSkills.skillDistribution}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {result.technicalSkills.skillDistribution.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Programming Languages</h3>
              <div className="flex flex-wrap gap-2">
                {result.technicalSkills.programmingLanguages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {result.technicalSkills.frameworks.map((framework) => (
                  <span key={framework} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {framework}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {result.technicalSkills.tools.map((tool) => (
                  <span key={tool} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Missing Critical Skills</h3>
              <ul className="list-disc list-inside text-gray-600">
                {result.technicalSkills.missingCriticalSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Experience Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Role Relevance</span>
                  <span className="text-sm text-gray-600">{result.experience.roleRelevance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${result.experience.roleRelevance}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Industry Alignment</span>
                  <span className="text-sm text-gray-600">{result.experience.industryAlignment}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${result.experience.industryAlignment}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Career Growth</span>
                  <span className="text-sm text-gray-600">{result.experience.careerProgression.growthRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 rounded-full h-2"
                    style={{ width: `${result.experience.careerProgression.growthRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Key Achievements</h3>
            <div className="space-y-4">
              {result.experience.achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-800">{achievement.description}</p>
                  {achievement.metrics.length > 0 && (
                    <div className="mt-2">
                      {achievement.metrics.map((metric, mIndex) => (
                        <span
                          key={mIndex}
                          className="inline-block px-2 py-1 mr-2 mt-1 bg-blue-100 text-blue-800 text-sm rounded"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Education & Certifications</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Degrees</h3>
            <ul className="space-y-2">
              {result.education.degrees.map((degree, index) => (
                <li key={index} className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>{degree}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-4">Certifications</h3>
            <ul className="space-y-2">
              {result.education.certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Certification Impact</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={result.education.certificationImpact}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="impact" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>

            <h3 className="text-lg font-medium mt-6 mb-4">Recommended Certifications</h3>
            <ul className="space-y-2">
              {result.education.recommendedCertifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Soft Skills Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Soft Skills Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Skills Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={result.softSkills.distribution}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {result.softSkills.distribution.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Soft Skills Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Communication</span>
                  <span className="text-sm text-gray-600">{result.softSkills.communication}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${result.softSkills.communication}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Teamwork</span>
                  <span className="text-sm text-gray-600">{result.softSkills.teamwork}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${result.softSkills.teamwork}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Leadership Potential</span>
                  <span className="text-sm text-gray-600">{result.softSkills.leadershipPotential}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 rounded-full h-2"
                    style={{ width: `${result.softSkills.leadershipPotential}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Professional Tone</span>
                  <span className="text-sm text-gray-600">{result.softSkills.professionalTone}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 rounded-full h-2"
                    style={{ width: `${result.softSkills.professionalTone}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Trajectory Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <LineChartIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Career Trajectory</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Stability Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Stability Index</span>
                  <span className="text-sm text-gray-600">{result.careerTrajectory.stability.stabilityIndex}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${result.careerTrajectory.stability.stabilityIndex}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Growth Trend</span>
                  <span className="text-sm text-gray-600">{result.careerTrajectory.stability.growthTrend}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${Math.max(0, result.careerTrajectory.stability.growthTrend)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Next Career Moves</h3>
              <ul className="space-y-2">
                {result.careerTrajectory.nextMoveRecommendations.map((move, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span>{move}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Areas for Growth</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-2">Future Role Gaps</h4>
                <ul className="space-y-2">
                  {result.careerTrajectory.futureRoleGaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ListChecks className="w-5 h-5 text-red-500 mt-0.5" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-md font-medium mb-2">Growth Opportunities</h4>
                <ul className="space-y-2">
                  {result.careerTrajectory.growthOpportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Workflow className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Optimization Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <FileSearch className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">ATS Optimization</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Keyword Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={result.atsOptimization.keywordDensity}>
                <XAxis dataKey="keyword" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="density" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Action Verbs Usage</h3>
            <div className="space-y-2">
              {result.atsOptimization.actionVerbUsage.map((verb, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{verb.verb}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {verb.count} times
                  </span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {result.atsOptimization.missingKeywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Improvements Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <ListChecks className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Recommended Improvements</h2>
        </div>

        <ul className="space-y-3">
          {result.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
              </div>
              <span className="text-gray-700">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}