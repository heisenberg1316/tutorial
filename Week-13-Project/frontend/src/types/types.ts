export interface BlogPost {
  title: string;
  content: string;
  published: boolean;
  tags: string[];
  image: string | null;
}


// Define the user type according to your /me response structure
export type UserType = {
  id: string;
  name: string;
  email: string;
  bio : string,
  imageLink : string;
  createdAt : Date;
  profileViews : number;
  // Add more fields as per your backend /me response
};