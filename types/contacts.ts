export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  avatar: string;
  description: string;
  objectives: string[];
}

export const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    company: 'TechStart Inc',
    role: 'Procurement Manager',
    difficulty: 'easy',
    avatar: '👩‍💼',
    description: 'Friendly and open to new solutions. Looking for cost-effective tools.',
    objectives: ['Build rapport', 'Identify needs', 'Present solution']
  },
  {
    id: '2',
    name: 'James Rodriguez',
    company: 'Global Dynamics',
    role: 'VP of Operations',
    difficulty: 'medium',
    avatar: '👨‍💼',
    description: 'Experienced buyer. Will ask tough questions about ROI and implementation.',
    objectives: ['Handle objections', 'Prove ROI', 'Close deal']
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    company: 'Enterprise Solutions',
    role: 'Chief Technology Officer',
    difficulty: 'hard',
    avatar: '👩‍🔬',
    description: 'Highly technical and skeptical. Needs detailed technical specs and proof.',
    objectives: ['Technical deep-dive', 'Overcome skepticism', 'Negotiate terms']
  },
  {
    id: '4',
    name: 'Michael Thompson',
    company: 'StartUp Labs',
    role: 'Founder & CEO',
    difficulty: 'easy',
    avatar: '👨‍💻',
    description: 'Enthusiastic entrepreneur looking for growth tools. Budget conscious.',
    objectives: ['Show value', 'Address budget', 'Quick close']
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    company: 'Corporate Systems',
    role: 'Director of IT',
    difficulty: 'medium',
    avatar: '👩‍💼',
    description: 'Detail-oriented decision maker. Needs to see integration capabilities.',
    objectives: ['Demo features', 'Integration proof', 'Security assurance']
  },
  {
    id: '6',
    name: 'Robert Zhang',
    company: 'Fortune Enterprises',
    role: 'CFO',
    difficulty: 'hard',
    avatar: '👨‍💼',
    description: 'Numbers-focused executive. Will challenge every cost and benefit claim.',
    objectives: ['Financial justification', 'Risk mitigation', 'Contract negotiation']
  }
];
