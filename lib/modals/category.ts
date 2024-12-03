import { Schema, model, models } from "mongoose";

const CatergorySchema = new Schema(
  {
    title: { type: "string", required: true },
    // description: { type: "string", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CatergorySchema);

export default Category;
