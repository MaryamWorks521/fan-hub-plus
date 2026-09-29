import { db } from "../server/db.ts";

export default {
  async fetch() {
    try {
      return Response.json({
        releases: db.upcoming_releases
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to load upcoming releases" },
        { status: 500 }
      );
    }
  }
};