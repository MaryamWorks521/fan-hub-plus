import { db } from "../server/db.ts";

export default {
  async fetch() {
    try {
      return Response.json({
        categories: db.categories
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to load categories" },
        { status: 500 }
      );
    }
  }
};