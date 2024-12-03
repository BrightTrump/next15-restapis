"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    await connect();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error fetching categories: ${message}` },
      { status: 500 }
    );
  }
};

// POST request handler
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();
    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error fetching categories: ${message}` },
      { status: 500 }
    );
  }
};
