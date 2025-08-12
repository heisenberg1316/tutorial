import z, { boolean, parseAsync } from "zod";

export const signupInput = z.object({
    email : z.email(),
    password : z.string().min(6),
    name : z.string(),  
    bio : z.string(),
    profileImage : z.string(),
})

export const signinInput = z.object({
    email : z.email(),
    password : z.string().min(6),
})

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  tags: z.array(z.string()),
  image: z.string().nullable(), // can either be a string (URL or path) or null. or z.union([z.string(), z.null()]) if you prefer 
});

export const updateBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string(),
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>


