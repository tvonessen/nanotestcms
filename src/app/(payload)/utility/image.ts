import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const base64Cache = new Map<string, string>();
const brightnessCache = new Map<string, boolean>();

export const imageToBase64 = (imagePath: string) => {
  const cachedBase64 = base64Cache.get(imagePath);
  if (cachedBase64) {
    return cachedBase64;
  }

  try {
    // Read the image file synchronously
    const data = readFileSync(imagePath);

    // Convert buffer to base64
    const base64 = data.toString('base64');

    // Get file extension and create MIME type
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mimeType = `image/${ext}`;

    // Construct and return the data URL
    const dataUrl = `data:${mimeType};base64,${base64}`;
    base64Cache.set(imagePath, dataUrl);
    return dataUrl;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    // Return a generic blurred image
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAIAAABCwWJuAAAACXBIWXMAAAsTAAALEwEAmpwYAAACdklEQVR4nB3Cy0/TcAAA4N+6dq9upb92fbfroN3aPbqxsSFkm2PIeEjYhkHERBwQnMyDCTFgMOhhiY8YHwdNiCYwCXrw5MmD8WKMHjhoYoiGv8L4uomP6JcPzJ6bX15b2X78YPf97ucv334e/Dn49fvr9x8fPu4/efZ849HT1t2N5ctXQfXESL15er212t55+Or1y729d5/291+8eXtrc3v9xu0LrZvN1SunmudB30CmNl1ebEytXVpqb7V2tq6123fu3b++tLpcb56tN5szC2emFxZBrpTJlfoy+d6JWuniylR9brzRqB47Xh4eK2Xz/f2FfGGwlB8aAJ2mEUrEtXg03mOVRw9lC+l4j5XNWVaPZaYSiYxlpWOpbAxEkuFIytCiumpoibQZSZqqoRlx3UxosXSoO2VoRlckFgRmUtNjXWKnzCmSqqvBcEDWlGA4oBmKGQvq4YCiSQFNBqwkMLLAiDzFMZBjSZbxC4wQ4EWV5xRBVDhZFXiZBTgk/aJf0Viap3EIvRRJ0CQOOyALOxhIcbQPEj7SByBHBnRG7KRklSOZDi/l9UFCkPwekvBBAjKQ43maoYHDhzsJD+J2MwKFE7iL8BIUwQtQlCWaowjo4wUO0l7A8R5IuZw4pihU1BRj0aAoQUmmU916KBSkGWiaesTUwMxUOZ+PFw+nx45kh4rdI8O9lepgpTpWqQ1PVEcLxUJtsjI5OQ5EhSNogqBJRvBDjlKNrmg6kcwmTs5OzzfmBo+O9hZzFM8C4EAAagMIwDwY5rIjGGJDbQ43iqAIsAMERZxupxPHAEDtiAsDDrvNgdpQG7D/i2D2/1HUiSIYimD2v1lFgv5RCJfdAAAAAElFTkSuQmCC';
  }
};

export const isDarkImage = async (dataUrl: string, threshold: number = 140) => {
  const cacheKey = `${threshold}:${dataUrl}`;
  const cachedBrightness = brightnessCache.get(cacheKey);
  if (typeof cachedBrightness === 'boolean') {
    return cachedBrightness;
  }

  try {
    const imageBuffer = Buffer.from(dataUrl.split(',')[1], 'base64');
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
    const isDark = averageBrightness < threshold;
    brightnessCache.set(cacheKey, isDark);
    return isDark;
  } catch (error) {
    console.error('Error analyzing image brightness:', error);
    return false;
  }
};
