export type WorkstreamType =
  | 'Technical Skills'
  | 'MBA & GMAT/GRE'
  | 'Career & Recruiting'
  | 'Honors Research'
  | 'MITx MicroMasters'
  | 'Leadership & Entrepreneurship'
  | 'Academics';

export type Priority = 'Essential' | 'Important' | 'Optional';
export type Status = 'Not Started' | 'In Progress' | 'Blocked' | 'On Hold' | 'Completed';

export interface Profile {
  id: string;
  full_name: string;
  graduation_date: string;
  theme: 'dark' | 'light';
  north_star_goal: string;
  updated_at: string;
}

export interface StrategicGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  workstream: WorkstreamType;
  progress_percent: number;
  target_date: string;
  is_completed: boolean;
  created_at: string;
}

export interface Milestone {
  id: string;
  strategic_goal_id: string;
  title: string;
  description: string;
  target_date: string;
  status: Status;
  progress_percent: number;
  is_essential: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Task {
  id: string;
  milestone_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
  status: Status;
  estimated_effort_hours: number;
  actual_effort_hours: number;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface WeeklyPlan {
  id: string;
  user_id: string;
  start_date: string; // Monday
  end_date: string; // Sunday
  primary_objectives: string[];
  is_completed: boolean;
}

export interface Reflection {
  id: string;
  weekly_plan_id: string;
  accomplishments: string;
  struggles: string;
  learnings: string;
  changes: string;
  next_week_priorities: string;
  created_at: string;
}

export interface TechnicalSkill {
  id: string;
  user_id: string;
  name: string;
  proficiency: number; // 0-5
  status: Status;
  learning_resources: string[];
  practice_hours: number;
  projects_completed: number;
  last_practiced_date: string;
  next_practice_goal: string;
  notes: string;
}

export interface CodingProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  skills_used: string[];
  start_date: string;
  target_date: string;
  github_url?: string;
  deployment_url?: string;
  progress_percent: number;
  lessons_learned: string;
  status: Status;
}

export interface MBAProgram {
  id: string;
  university: string;
  business_school: string;
  program_name: string;
  website: string;
  deadline: string;
  deadline_verified: boolean;
  requirements: string[];
  deferral_period: string;
}

export interface MBAApplication {
  id: string;
  user_id: string;
  program_id: string;
  status: 'Researching' | 'Planning to Apply' | 'In Progress' | 'Submitted' | 'Interview Invited' | 'Interview Complete' | 'Accepted' | 'Waitlisted' | 'Rejected' | 'Withdrawn';
  interest_level: number; // 1-5
  priority: Priority;
  gmat_gre_score?: number;
  essays_completed: boolean;
  recommendations_secured: boolean;
  notes: string;
}

export interface TestScore {
  id: string;
  user_id: string;
  test_type: 'GMAT' | 'GRE';
  attempt_date: string;
  score: number;
  resources: string[];
  notes: string;
}

export interface ResearchEntry {
  id: string;
  user_id: string;
  course_code: string; // e.g., CSE 4998H
  topic: string;
  mentor: string;
  proposal: string;
  research_questions: string[];
  methodology: string;
  status: Status;
  deliverables: string[];
  created_at: string;
}

export interface CareerApplication {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string;
  url: string;
  application_date: string;
  status: 'Interested' | 'Applied' | 'Assessment' | 'Interviewing' | 'Offer' | 'Rejected' | 'Withdrawn';
  interview_dates: string[];
  recruiter_contact: string;
  notes: string;
  follow_up_date: string;
  offer_details?: string;
}

export interface InternshipJournal {
  id: string;
  user_id: string;
  company: string;
  project_name: string;
  contribution: string;
  quantitative_results: string;
  leadership_example: string;
  star_example: string;
  recommender: string;
}

export interface MITxCourse {
  id: string;
  user_id: string;
  course_name: string;
  start_date: string;
  end_date: string;
  progress_percent: number;
  grade: string;
  certificate_status: 'Pending' | 'Earned' | 'N/A';
  notes: string;
}

export interface LeadershipInitiative {
  id: string;
  user_id: string;
  title: string;
  problem: string;
  motivation: string;
  actions_taken: string;
  outcome: string;
  evidence_link?: string;
  status: Status;
}

export interface EntrepreneurshipIdea {
  id: string;
  user_id: string;
  problem: string;
  target_audience: string;
  proposed_solution: string;
  validation_evidence: string;
  next_experiment: string;
  status: Status;
}

export interface ContingencyPlan {
  id: string;
  user_id: string;
  path_type: 'Full-time Employment' | 'Specialized Master\'s' | 'Deferred MBA';
  priority: number;
  requirements: string[];
  pros: string[];
  cons: string[];
  status: Status;
}
