"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";
// import { FilterQuery } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    // const  searchKeywords = searchParams.get("Keywords") as string;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    } else if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid or missing categoryId" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // TODO
    const filter = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    // if (searchKeywords) {
    //   filter.$or = [
    //     {
    //       title: { $regex: new RegExp(searchKeywords, "i") },
    //       description: { $regex: new RegExp(searchKeywords, "i") },
    //     },
    //   ];
    // }


    const blogs = await Blog.find(filter);

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error fetching blogs: ${message}` },
      { status: 500 }
    );
  }
};

// POST request handler
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    } else if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    } else if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid categoryId" },
        { status: 400 }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error creating blog: ${message}` },
      { status: 500 }
    );
  }
};
