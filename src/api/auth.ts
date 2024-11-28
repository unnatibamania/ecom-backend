 import { Hono   } from "hono";
import { kindeClient, sessionManager } from "../kinde"; 

import { getUser } from "../kinde";

 const app = new Hono();

 app.get("/login", async (c) => {   
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  }); 
  
  app.get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  });
   
  app.get("/callback", async (c) => {
    const url = new URL(`${c.req.url}`);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  });

  app.get("/logout", async (c) => {
    const logoutUrl =    await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  });

  app.get("/me", getUser, async (c) => {
    // return c.json(isAuthenticated);

      // const user = await kindeClient.getUser(sessionManager(c));

      const user = c.var.user;

      return c.json(user);
  });

  
  export default app;