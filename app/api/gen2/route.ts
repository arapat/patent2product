import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure fal.ai
fal.config({
  credentials: process.env.FAL_KEY,
});

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure S3
const awsRegion = process.env.AWS_REGION || "us-west-1";
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // We accept multipart/form-data:  meta (JSON) + image file
    const form = await req.formData();

    const metaRaw = form.get("meta");
    const image = form.get("image");

    if (!metaRaw || typeof metaRaw !== "string") {
      return NextResponse.json(
        { error: "Missing required 'meta' JSON field." },
        { status: 400 }
      );
    }

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Missing required 'image' file." },
        { status: 400 }
      );
    }

    const meta = JSON.parse(metaRaw);
    const { patent_url, patent_id, title, abstract } = meta;

    ////////////////////////////////////////////////////////////////////////////
    // 1) Generate JSON prompt using OpenAI
    ////////////////////////////////////////////////////////////////////////////
    const systemPrompt = `
You generate JSON prompts for photorealistic renderings of inventions.
Return ONLY valid JSON. No commentary. No markdown.

JSON structure:

{
  "scene": string,
  "subjects": [
    {
      "description": string,
      "pose": string,
      "position": string,
      "color_palette": string[]
    }
  ],
  "style": string,
  "color_palette": string[],
  "lighting": string,
  "mood": string,
  "background": string,
  "composition": string,
  "camera": {
    "angle": string,
    "distance": string,
    "focus": string,
    "lens-mm": number,
    "f-number": string,
    "ISO": number
  }
}
`;

    const userPrompt = `
Patent URL: ${patent_url}
Patent ID: ${patent_id}

Title:
${title}

Abstract:
${abstract}

Generate a JSON prompt that renders this invention as a photorealistic product image based on the patent.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawJSON = completion.choices[0].message.content ?? "{}";
    let generatedPrompt;
    try {
      generatedPrompt = JSON.parse(rawJSON);
    } catch {
      generatedPrompt = { prompt_text: rawJSON };
    }

    const finalPrompt = JSON.stringify(generatedPrompt);

    ////////////////////////////////////////////////////////////////////////////
    // 2) Send to Fal "edit-image" model
    ////////////////////////////////////////////////////////////////////////////

    // Fal client will auto-upload local File objects
    const falResult = await fal.subscribe("fal-ai/alpha-image-232/edit-image", {
      input: {
        prompt: finalPrompt,
        image_size: "auto",
        output_format: "png",
        image_urls: [image], // <— just send the File object
      },
      logs: false,
    });

    const outputUrl = falResult.data?.images?.[0]?.url;
    if (!outputUrl) {
      throw new Error("Fal returned no usable image URL");
    }

    ////////////////////////////////////////////////////////////////////////////
    // 3) Download the image & upload to S3
    ////////////////////////////////////////////////////////////////////////////
    const imageResp = await fetch(outputUrl);
    if (!imageResp.ok) throw new Error("Failed to download Fal image");

    const arrayBuf = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const s3Key = `patent-renders/${patent_id}-${Date.now()}.png`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    const s3Url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${s3Key}`;

    ////////////////////////////////////////////////////////////////////////////
    // 4) Return final response
    ////////////////////////////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      patent: meta,
      generatedPrompt,
      falOutput: falResult.data,
      falRequestId: falResult.requestId,
      s3Url,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
