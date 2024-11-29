import {createKindeServerClient, GrantType, type UserProfile} from "@kinde-oss/kinde-typescript-sdk";

import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { Context } from "hono";

import { getCookie, setCookie, deleteCookie } from "hono/cookie";

import { createMiddleware, createFactory } from "hono/factory";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, { 
  authDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL!
});

// Client for client credentials flow
let store: Record<string, unknown> = {};

export const sessionManager = (c: Context) => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
        
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
    } as const;
    if(typeof value === "string") {
        setCookie(c, key, value, cookieOptions);
    }else{
        setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    deleteCookie(c, "*");
  }
}); 


type Env = {
  Variables: {
    user: UserProfile;
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {

    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if(!isAuthenticated) return c.json({error: "Unauthorized"}, 401);

    const user = await kindeClient.getUserProfile(manager);
    c.set("user",user); 
    // c.req.user = user;
    await next();

  } catch (error) {
    console.log(error);
    return c.json({error: "Unauthorized"}, 401);
  }
});

export const isAdmin = createMiddleware<Env>(async (c, next) => {
  try {

    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if(!isAuthenticated) return c.json({error: "Unauthorized"}, 401);

    const user = await kindeClient.getUserProfile(manager);
    if(!user?.isAdmin) return c.json({error: "Unauthorized"}, 401);
    await next();

  } catch (error) {
    console.log(error);
    return c.json({error: "Unauthorized"}, 401);
  }
});




