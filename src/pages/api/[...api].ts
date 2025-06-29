import { serve } from "bknd/adapter/astro";

export const prerender = false;

export const ALL = serve({
  connection: {
    url: "file:data.db"
  }
});
