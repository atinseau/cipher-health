import { Client } from "@prisma/client";

export type ClientCreate = Omit<Client, 
  | 'id'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
>