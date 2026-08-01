export type ToolCategory =
  | 'ai'
  | 'pdf'
  | 'image'
  | 'text'
  | 'calculator'
  | 'developer';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  description: string;
  longDescription: string;
  iconName: string;
  isPopular?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  tags: string[];
  badge?: string;
  keywords?: string[];
}

export type Tool = ToolItem;

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
  icon?: string;
  count?: number;
  color: string;
  badgeColor: string;
}

export type ThemeMode = 'light' | 'dark';

export type ActiveView = 
  | 'home'
  | 'category'
  | 'tool'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'sitemap'
  | 'robots'
  | 'dashboard'
  | 'auth'
  | 'blog'
  | 'blog-post'
  | 'request-tool'
  | '404';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or structured content
  author: string;
  publishedAt: string;
  readTime: string;
  category: ToolCategory | 'general';
  tags: string[];
  relatedToolId?: string;
  relatedToolIds?: string[];
  imageUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  isLoggedIn: boolean;
}

export interface RecentToolItem {
  toolId: string;
  visitedAt: number;
}
