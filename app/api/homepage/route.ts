import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";

export async function GET() {
    try {
        const db = await getDb();
        const collection = db.collection("homepage");

        // Fetch homepage data
        const data = await collection.findOne({ type: "hero" });

        if (!data) {
            // Return default values if no data in database
            return NextResponse.json({
                success: true,
                data: {
                    heroEyebrow: "The Happy Safar",
                    heroHighlight: "Rajasthan",
                    heroHeadlineTail: "Awaits You",
                    heroDescription: "From Jaipur's pink boulevards to the dunes of Jaisalmer and the blue lanes of Jodhpur, The Happy Safar scripts soulful Rajasthan stories. We obsess over palace stays, chauffeured drives, and local hosts so every leg of your desert escape feels effortless.",
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                heroEyebrow: data.heroEyebrow,
                heroHighlight: data.heroHighlight,
                heroHeadlineTail: data.heroHeadlineTail,
                heroDescription: data.heroDescription,
            },
        });
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch homepage data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { heroEyebrow, heroHighlight, heroHeadlineTail, heroDescription } = body;

        // Validate required fields
        if (!heroEyebrow || !heroHighlight || !heroHeadlineTail || !heroDescription) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const collection = db.collection("homepage");

        // Update or insert homepage data
        const result = await collection.updateOne(
            { type: "hero" },
            {
                $set: {
                    heroEyebrow,
                    heroHighlight,
                    heroHeadlineTail,
                    heroDescription,
                    updatedAt: new Date(),
                },
            },
            { upsert: true } // Create if doesn't exist
        );

        return NextResponse.json({
            success: true,
            message: "Homepage data updated successfully",
            data: {
                heroEyebrow,
                heroHighlight,
                heroHeadlineTail,
                heroDescription,
            },
        });
    } catch (error) {
        console.error("Error updating homepage data:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update homepage data" },
            { status: 500 }
        );
    }
}
