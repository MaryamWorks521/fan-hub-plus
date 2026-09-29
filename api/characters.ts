import { db } from "../server/db.ts";

export default {
  async fetch() {
    try {
      return Response.json({
        characters: db.characters
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to load characters" },
        { status: 500 }
      );
    }
  }
};