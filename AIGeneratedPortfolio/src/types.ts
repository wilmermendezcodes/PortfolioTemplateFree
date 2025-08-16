export type SkillCategory =
  | "Web Development"
  | "Backend & APIs"
  | "Tools & Platforms"
  | "Other";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  experience: string;
};