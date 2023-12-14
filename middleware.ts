export { default } from "next-auth/middleware";

export const config = { matcher: ['/((?!api/[...nextauth]|_next/static|_next/image|favicon.ico|$).*)'] };
