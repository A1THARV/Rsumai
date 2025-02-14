import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '../types';

const ANALYSIS_PROMPT = `You are an expert resume analyzer. Analyze the provided resume text and return a comprehensive JSON object that EXACTLY matches this schema. The analysis must be detailed and actionable.

{
  "overallScore": number, // 0-100 comprehensive score
  "technicalSkills": {
    "programmingLanguages": string[],
    "frameworks": string[],
    "tools": string[],
    "proficiencyLevels": {
      "overall": number,
      "languages": number,
      "frameworks": number,
      "tools": number
    },
    "skillDistribution": [
      {
        "category": string, // skill category
        "percentage": number // 0-100
      }
    ],
    "missingCriticalSkills": string[],
    "industryDemandAlignment": number // 0-100
  },
  "experience": {
    "totalYears": number,
    "roleRelevance": number,
    "industryAlignment": number,
    "achievements": [
      {
        "description": string,
        "impact": number, // 0-100
        "metrics": string[]
      }
    ],
    "careerProgression": {
      "logic": number, // 0-100
      "growthRate": number, // 0-100
      "nextLevelGap": string[]
    }
  },
  "education": {
    "degrees": string[],
    "certifications": string[],
    "relevance": number,
    "certificationImpact": [
      {
        "name": string,
        "impact": number // 0-100
      }
    ],
    "recommendedCertifications": string[],
    "educationStrength": number // 0-100
  },
  "softSkills": {
    "skills": string[],
    "distribution": [
      {
        "category": string,
        "percentage": number // 0-100
      }
    ],
    "communication": number, // 0-100
    "teamwork": number, // 0-100
    "leadershipPotential": number, // 0-100
    "professionalTone": number // 0-100
  },
  "leadership": string[],
  "projectHighlights": [
    {
      "name": string,
      "impact": number, // 0-100
      "technologies": string[],
      "keyAchievements": string[]
    }
  ],
  "careerTrajectory": {
    "stability": {
      "stabilityIndex": number, // 0-100
      "averageJobDuration": number,
      "jobChanges": number,
      "growthTrend": number // -100 to 100
    },
    "nextMoveRecommendations": string[],
    "futureRoleGaps": string[],
    "growthOpportunities": string[]
  },
  "documentStructure": {
    "lengthScore": number, // 0-100
    "contentSpaceRatio": number, // 0-100
    "sectionOrganization": number, // 0-100
    "readabilityScore": number, // 0-100
    "formatCompliance": number // 0-100
  },
  "atsOptimization": {
    "compatibility": number, // 0-100
    "keywordDensity": [
      {
        "keyword": string,
        "count": number,
        "density": number // percentage
      }
    ],
    "actionVerbUsage": [
      {
        "verb": string,
        "count": number
      }
    ],
    "missingKeywords": string[]
  },
  "improvements": string[],
  "keywords": string[]
}

CRITICAL ANALYSIS REQUIREMENTS:
1. Technical Skills Assessment:
   - Evaluate all technical skills mentioned
   - Compare against current industry standards
   - Identify skill gaps
   - Calculate proficiency scores based on context

2. Experience Analysis:
   - Quantify achievements with metrics where possible
   - Evaluate career progression logic
   - Assess industry alignment
   - Calculate impact scores for achievements

3. Education & Certification Review:
   - Evaluate relevance to career goals
   - Assess certification impact
   - Recommend valuable certifications
   - Calculate education strength

4. Soft Skills Evaluation:
   - Identify communication patterns
   - Assess leadership indicators
   - Evaluate teamwork mentions
   - Calculate professional tone

5. ATS Optimization:
   - Check keyword optimization
   - Analyze action verb usage
   - Assess format compliance
   - Calculate ATS compatibility score

6. Career Trajectory:
   - Analyze job stability
   - Evaluate growth patterns
   - Identify future role requirements
   - Recommend next career moves

7. Document Structure:
   - Assess length optimization
   - Evaluate content distribution
   - Check section organization
   - Calculate readability scores

CRITICAL INSTRUCTIONS:
1. Return ONLY the JSON object, no additional text
2. Response MUST be valid JSON
3. ALL number values MUST be within specified ranges
4. ALL arrays MUST contain at least one item
5. ALL fields are REQUIRED
6. Do NOT add fields not in the schema
7. Do NOT include comments
8. Format with proper indentation

Analyze this resume text and provide the analysis in the EXACT format specified above:`;

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not found in environment variables');
  }

  if (!resumeText.trim()) {
    throw new Error('Resume text is required');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        text: ANALYSIS_PROMPT
      },
      {
        text: resumeText
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const parsedResult = JSON.parse(cleanedText);
      
      // Validate the complete structure
      validateAnalysisResult(parsedResult);

      return parsedResult as AnalysisResult;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error(
        `Failed to parse the AI response: ${parseError instanceof Error ? parseError.message : 'Invalid format'}. ` +
        'Please try again with a different resume or contact support if the issue persists.'
      );
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze resume: ${error.message}`);
    }
    throw new Error('Failed to analyze resume. Please check the environment variables and try again.');
  }
}

function validateAnalysisResult(result: any) {
  // Validate top-level structure
  const requiredFields = [
    'overallScore',
    'technicalSkills',
    'experience',
    'education',
    'softSkills',
    'leadership',
    'projectHighlights',
    'careerTrajectory',
    'documentStructure',
    'atsOptimization',
    'improvements',
    'keywords'
  ];

  const missingFields = requiredFields.filter(field => !(field in result));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate score ranges
  validateScoreRange(result.overallScore, 'overallScore');
  validateScoreRange(result.technicalSkills.proficiencyLevels.overall, 'technical skills overall');
  validateScoreRange(result.experience.roleRelevance, 'role relevance');
  validateScoreRange(result.education.relevance, 'education relevance');
  validateScoreRange(result.softSkills.communication, 'communication');
  validateScoreRange(result.documentStructure.readabilityScore, 'readability');
  validateScoreRange(result.atsOptimization.compatibility, 'ATS compatibility');

  // Validate arrays
  validateArray(result.technicalSkills.programmingLanguages, 'programming languages');
  validateArray(result.experience.achievements, 'achievements');
  validateArray(result.education.degrees, 'degrees');
  validateArray(result.softSkills.skills, 'soft skills');
  validateArray(result.leadership, 'leadership');
  validateArray(result.projectHighlights, 'project highlights');
  validateArray(result.improvements, 'improvements');
  validateArray(result.keywords, 'keywords');
}

function validateScoreRange(value: number, fieldName: string) {
  if (typeof value !== 'number' || value < 0 || value > 100) {
    throw new Error(`Invalid score range for ${fieldName}: ${value}. Must be between 0 and 100`);
  }
}

function validateArray(arr: any[], fieldName: string) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`Invalid ${fieldName}: must be a non-empty array`);
  }
}
