export interface Education {
  id: string;
  degree: string;
  course: string;
  institution: string;
  year: string;
  period: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ProjectOrAchievement {
  id: string;
  title: string;
  description: string;
  link?: string;
  year?: string;
  pdfFileName?: string;
  pdfData?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
}

export interface ResumeDesign {
  template: 'modern' | 'jobseeker' | 'elegant' | 'executive' | 'minimalist';
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'normal' | 'spacious';
  layoutMode?: 'compact' | 'full';
}

export interface EnabledSections {
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  technologies: boolean;
  languages: boolean;
  certifications: boolean;
  projects: boolean;
  custom: boolean;
}

export interface EnabledPersonalFields {
  birthDate: boolean;
  maritalStatus: boolean;
  driverLicense: boolean;
  linkedin: boolean;
  github: boolean;
  portfolio: boolean;
  nationality: boolean;
  photo: boolean;
  videoUrl: boolean;
}

export interface ResumeData {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  state: string;
  city: string;

  // Optional personal fields
  photo?: string;
  videoUrl?: string;
  birthDate?: string;
  maritalStatus?: string;
  driverLicense?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  nationality?: string;

  summary: string;
  education: Education[];
  experience: Experience[];
  hardSkills: string[];
  softSkills: string[];
  technologies: string[];
  languages: Language[];
  certifications: Certification[];
  projects: ProjectOrAchievement[];
  customSections: CustomSectionItem[];

  enabledSections: EnabledSections;
  enabledPersonalFields: EnabledPersonalFields;
  design: ResumeDesign;
}

export type TabType = 'content' | 'design' | 'preview';

export type ModalType =
  | 'synthesis'
  | 'star'
  | 'review'
  | 'ats'
  | 'export'
  | 'import'
  | 'translate'
  | 'canva'
  | 'videoExplainer'
  | 'skillsExplainer'
  | null;

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
