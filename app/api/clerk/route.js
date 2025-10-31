import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGNIN_SECRETE);
  const headerPayload = await headers();
  const svixHeader = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  // Get Payload and verify

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const { data, type } = wh.verify(body, svixHeader);

  // Prepare the user data to be saved in db
console.log("Clerk Webhook event received:", data);
  const userData = {
    _id: data.id,
    name: `${data.first_name} ${data.last_name}`,
    email: data.email_addresses[0].email_address,
    image: data.image_url,

  };

  await connectDB();

  switch (type) {
    case "user.created":
      await User.create(userData);
      break;
    case "user.updated":
      await User.findByIdAndUpdate(data.id, userData);
      break;
    case "user.deleted":
      await User.findByIdAndDelete(data.id);
      break;

    default:
      break;
  }

  return NextResponse.json({ message: "Event Received" });
}
