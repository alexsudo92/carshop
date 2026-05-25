import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const imagesDir = path.join(process.cwd(), "data", "images");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse> {
  const { name } = await params;
  const safeName = path.basename(name);
  const imagePath = path.join(imagesDir, safeName);

  try {
    const content = await fs.readFile(imagePath);
    const ext = path.extname(safeName).toLowerCase();
    const type = ext === ".svg" ? "image/svg+xml" : "application/octet-stream";

    return new NextResponse(content, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
