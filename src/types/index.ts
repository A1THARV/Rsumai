export interface SkillDistribution {
  category: string;
  percentage: number;
}

export interface Achievement {
  description: string;
  impact: number; // 0-100 impact score
  metrics: string[];
}

export interface CareerStability {
  stabilityIndex: number; // 0-100
  averageJobDuration: number; // in years
  jobChanges: number;
  growthTrend: number; // -100 to 100, negative indicates decline
}

export interface DocumentStructure {
  lengthScore: number; // 0-100
  contentSpaceRatio: number; // 0-100
  sectionOrganization: number; // 0-100
  readabilityScore: number; // 0-100
  formatCompliance: number; // 0-100
}

export interface ATSAnalysis {
  compatibility: number; // 0-100
  keywordDensity: {
    keyword: string;
    count: number;
    density: number; // percentage
  }[];
  actionVerbUsage: {
    verb: string;
    count: number;
  }[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  overallScore: number;
  technicalSkills: {
    programmingLanguages: string[];
    frameworks: string[];
    tools: string[];
    proficiencyLevels: {
      overall: number;
      languages: number;
      frameworks: number;
      tools: number;
    };
    skillDistribution: SkillDistribution[];
    missingCriticalSkills: string[];
    industryDemandAlignment: number; // 0-100
  };
  experience: {
    totalYears: number;
    roleRelevance: number;
    industryAlignment: number;
    achievements: Achievement[];
    careerProgression: {
      logic: number; // 0-100 score for progression logic
      growthRate: number; // 0-100
      nextLevelGap: string[];
    };
  };
  education: {
    degrees: string[];
    certifications: string[];
    relevance: number;
    certificationImpact: {
      name: string;
      impact: number; // 0-100
    }[];
    recommendedCertifications: string[];
    educationStrength: number; // 0-100
  };
  softSkills: {
    skills: string[];
    distribution: SkillDistribution[];
    communication: number; // 0-100
    teamwork: number; // 0-100
    leadershipPotential: number; // 0-100
    professionalTone: number; // 0-100
  };
  leadership: string[];
  projectHighlights: {
    name: string;
    impact: number; // 0-100
    technologies: string[];
    keyAchievements: string[];
  }[];
  careerTrajectory: {
    stability: CareerStability;
    nextMoveRecommendations: string[];
    futureRoleGaps: string[];
    growthOpportunities: string[];
  };
  documentStructure: DocumentStructure;
  atsOptimization: ATSAnalysis;
  improvements: string[];
  keywords: string[];
}

export interface ChartData {
  name: string;
  value: number;
}