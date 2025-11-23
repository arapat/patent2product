import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_KEY,
});

// Configure S3 client
const awsRegion = process.env.AWS_REGION || 'us-west-1';
const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface GenerateImageRequest {
  prompt: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  image_size?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateImageRequest = await request.json();

    // Validate prompt
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Step 1: Generate image using fal.ai
    const result = await fal.subscribe('fal-ai/beta-image-232', {
      input: {
        prompt: body.prompt,
        guidance_scale: body.guidance_scale || 2.5,
        num_inference_steps: body.num_inference_steps || 30,
        image_size: body.image_size || 'square_hd',
        enable_safety_checker: true,
        output_format: 'png',
      },
      logs: false,
    });

    // Check if image was generated successfully
    if (!result.data?.images?.[0]?.url) {
      throw new Error('Failed to generate image');
    }

    // Step 2: Download the generated image
    const imageUrl = result.data.images[0].url;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Step 3: Upload to S3
    const fileName = `generated-images/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('S3 bucket name not configured');
    }

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/png',
    });

    await s3Client.send(uploadCommand);

    // Step 4: Generate S3 URL
    const s3Url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;

    // Return success response
    return NextResponse.json({
      success: true,
      url: s3Url,
      prompt: result.data.prompt,
      seed: result.data.seed,
    });

  } catch (error) {
    console.error('Error generating image:', error);

    // Return appropriate error response
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
