import { Admin } from "@prisma/client";


export type AdminCreate = Omit<Admin, 
  | 'id'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
>