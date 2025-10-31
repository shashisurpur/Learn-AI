import connectDB from "@/config/db";
import RequestLimit from "@/models/Guest";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const requestHeaders = await headers();
        const forwardedFor = requestHeaders.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0] ?? 'unknown';

        await connectDB();
        const guest = await RequestLimit.findOne({ userId: ip })
        if (!guest) {
            return NextResponse.json({ success: true, requests: 0 }, { status: 200 })
        }
        const now = new Date();
        const diffHours = (now - guest.lastRequest) / (1000 * 60 * 60);
        if (diffHours >= 24) {
            guest.count = 0;
            guest.lastRequest = now;
            // await guest.save();
        }
        await guest.save()
        return NextResponse.json({ success: true, requests: guest.count }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}