"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

export const GET = async (
  request: Request,
  { params }: { params: { blog: string } }
) => {
  const blogId = params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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
    } else if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid or missing blogId" },
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    } else {
      return NextResponse.json(blog, { status: 200 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error fetching blog: ${message}` },
      { status: 500 }
    );
  }
};

// PATCH request handler
export const PATCH = async (
  request: Request,
  { params }: { params: { blog: string } }
) => {
  const blogId = params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    } else if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid or missing blogId" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return NextResponse.json(
      { message: "Blog is updated", category: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error updating blog: ${message}` },
      { status: 500 }
    );
  }
};

// DELETE request handler
export const DELETE = async (
  request: Request,
  { params }: { params: { blog: string } }
) => {
  const blogId = params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    } else if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid or missing blogId" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    return NextResponse.json(
      { message: "Blog deleted successfully!", category: deletedBlog },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error deleting blog: ${message}` },
      { status: 500 }
    );
  }
};
