
export interface Profile {
  id: string;
  bio: string | null;
  skills: string[] | null;
  interests: string[] | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  profiles?: Profile;
  users?: {
      name: string | null;
      image: string | null;
  };
  community_comments?: CommunityComment[];
  _count?: {
      community_comments: number;
  }
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Joins
  profiles?: Profile;
  users?: {
      name: string | null;
      image: string | null;
  };
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  tech_stack: string[] | null;
  created_at: string;
  profiles?: Profile;
  users?: {
      name: string | null;
      image: string | null;
  };
}

export interface Resource {
  id: string;
  uploaded_by: string;
  title: string;
  description: string | null;
  file_url: string;
  type: string;
  semester: string | null;
  subject: string | null;
  is_verified: boolean;
  created_at: string;
}
