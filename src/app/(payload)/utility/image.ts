import React from 'react';
import { readFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export const imageToBase64 = (imagePath: string) => {
  // Read the image file synchronously
  const data = readFileSync(imagePath);

  // Convert buffer to base64
  const base64 = data.toString('base64');

  // Get file extension and create MIME type
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mimeType = `image/${ext}`;

  // Construct and return the data URL
  return `data:${mimeType};base64,${base64}`;
};

export const isDarkImage = async (dataUrl: string, threshold: number = 140) => {
  const imageBuffer = Buffer.from(dataUrl.split(',')[1], 'base64');

  try {
    const { data, info } = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }

    const averageBrightness = totalBrightness / totalPixels;
    return averageBrightness < threshold;
  } catch (error) {
    console.error('Error analyzing image brightness:', error);
    throw error;
  }
};
