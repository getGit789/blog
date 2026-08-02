export interface PostContent {
  title: string;
  subtitle: string;
  collection: string;
  content: string;
  detailContent: string;
}

export interface BlogPost {
  id: number;
  year: string;
  image: string;
  rs: PostContent;
  en: PostContent;
}
