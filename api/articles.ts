import { db } from "../server/db.ts";

export default {
  async fetch() {
    try {
      return Response.json({
        articles: db.articles
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to load articles" },
        { status: 500 }
      );
    }
  }
};