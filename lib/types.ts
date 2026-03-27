export type IdeaSectionMap = {
  coreIdea: string;
  structure: string;
  humanSignal: string;
};

export type IdeaItem = {
  id: string;
  slug: string;
  title: string;
  path: string[];
  categoryTrail: string[];
  categoryKey: string;
  content: IdeaSectionMap;
  raw: string;
};

export type IdeaIndex = {
  generatedAt: string;
  count: number;
  ideas: IdeaItem[];
};