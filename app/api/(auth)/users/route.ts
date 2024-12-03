"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";

// GET request handler
export const GET = async (): Promise<NextResponse> => {
  try {
    await connect();
    const users = await User.find().lean();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error fetching users: ${message}` },
      { status: 500 }
    );
  }
};

// POST request handler
export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error creating user: ${message}` },
      { status: 500 }
    );
  }
};

// PATCH request handler
export const PATCH = async (request: Request): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const { userId, newUsername }: { userId: string; newUsername: string } =
      body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    await connect();

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully!", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error updating user: ${message}` },
      { status: 500 }
    );
  }
};

// DELETE request handler
export const DELETE = async (request: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Id not found" }, { status: 400 });
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully!", user: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { message: `Error deleting user: ${message}` },
      { status: 500 }
    );
  }
};



