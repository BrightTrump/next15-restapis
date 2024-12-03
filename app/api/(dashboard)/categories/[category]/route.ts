"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";

export const PATCH = async (
  request: Request,
  { params }: { params: { category: string } }
) => {
  const categoryId = params.category;
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Invalid or missing title" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({ _id: categoryId, user: user.id });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );
    return NextResponse.json(
      { message: "Category updated successfully!", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error updating categories: ${message}` },
      { status: 500 }
    );
  }
};

// DELETE request handler
export const DELETE = async (
  request: Request,
  { params }: { params: { category: string } }
) => {
  const categoryId = params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({ _id: categoryId, user: user.id });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found or does not belong to the user" },
        { status: 404 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return NextResponse.json(
      { message: "Category deleted successfully!", category: deletedCategory },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error deleting categories: ${message}` },
      { status: 500 }
    );
  }
};
