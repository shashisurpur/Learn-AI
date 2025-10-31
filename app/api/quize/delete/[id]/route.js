
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();

        const uploads = db.collection('quiz_pdfs');

        
        const result = await uploads.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ success: true, message: "File deleted successfully" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "No file found with that ID" }, { status: 404 })
        }


    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Failed to delete file" }, { status: 500 })
    }
}