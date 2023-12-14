import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: string;
    sheetId: string;
    code: string;
    jamaat: string;
  }

  interface User {
    id: string;
    sheetId: string;
    jamaat: string;
    code: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    sheetId: string;
    jamaat: string;
    code: string;
  }
}