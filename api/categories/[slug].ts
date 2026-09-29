import { db } from "../../server/db.ts";

export default {
  async fetch(request: Request) {
    try {
      const url = new URL(request.url);
      const slug = url.pathname.split("/").filter(Boolean).pop();

      const category = db.categories.find(
        (cat: any) => cat.slug === slug
      );

      if (!category) {
        return Response.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      return Response.json({
        category
      });
    } catch (error) {
      console.error(error);

      return Response.json(
        { error: "Failed to load category" },
        { status: 500 }
      );
    }
  }
};