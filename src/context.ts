import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export const prisma = new PrismaClient();

//First you have defined the Context interface, 
//which specifies what objects will be attached to the context object. 
//Right now it’s just an instance of PrismaClient, 
//but this can change as the project grows.
export interface Context {
  prisma: PrismaClient;
  userId?: number;  // 1
}

//You’re exporting the context object, 
//so that it can be imported and used by the GraphQL server.

export const context = ({ req }: { req: Request }): Context => {   // 2
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
  };
};