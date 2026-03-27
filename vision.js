import axios from 'axios';

/**
 * ORION Vision with Google Gemini
 *
 * FREE image analysis - no credits needed!
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * ANALYZE IMAGE WITH GEMINI (Free!)
 */
export async function analyzeImageWithGemini(
  base64Image,
  mediaFilename = 'image'
) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('   ❌ GEMINI_API_KEY not configured');
      return null;
    }

    console.log(`   🔍 Preparing image for Gemini vision...`);

    // Validate base64
    if (!base64Image || base64Image.length === 0) {
      console.error('   ❌ Empty image data');
      return null;
    }

    // Clean base64
    let cleanBase64 = base64Image;
    if (base64Image.includes(',')) {
      cleanBase64 = base64Image.split(',')[1];
    }

    // Detect mime type
    let mimeType = 'image/jpeg';
    const filename = mediaFilename.toLowerCase();

    if (filename.includes('.png')) {
      mimeType = 'image/png';
    } else if (filename.includes('.gif')) {
      mimeType = 'image/gif';
    } else if (filename.includes('.webp')) {
      mimeType = 'image/webp';
    }

    console.log(`   📸 Image: ${mimeType}, ${cleanBase64.length} bytes`);

    // Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: 'Look at this image carefully. Describe what you see in detail. If it contains text, charts, or diagrams, read and explain them. Be clear and concise.',
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Extract response
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const visionText = response.data.candidates[0].content.parts[0].text;
      console.log(`   ✅ Gemini vision complete: ${visionText.length} chars`);
      return visionText;
    }

    console.error('   ❌ No response from Gemini');
    return null;
  } catch (error) {
    console.error(`   ❌ Gemini vision error: ${error.message}`);

    if (error.response?.status === 400) {
      console.error(`      400 - ${error.response?.data?.error?.message}`);
    } else if (error.response?.status === 401) {
      console.error(`      401 - Check GEMINI_API_KEY`);
    } else if (error.response?.status === 429) {
      console.error(`      429 - Rate limited`);
    }

    return null;
  }
}

/**
 * DETECT IMAGE TYPE
 */
export function detectImageType(base64String) {
  if (base64String.startsWith('/9j/')) return 'image/jpeg';
  if (base64String.startsWith('iVBORw0KGgo')) return 'image/png';
  if (base64String.startsWith('R0lGODlh')) return 'image/gif';
  if (base64String.startsWith('UklGRi')) return 'image/webp';
  return 'image/jpeg'; // Default
}

/**
 * TEST VISION
 */
export async function testVision() {
  console.log('\n🧪 Testing Vision...');
  console.log(`   API Key configured: ${GEMINI_API_KEY ? '✅' : '❌'}`);

  if (!GEMINI_API_KEY) {
    console.log('   Add GEMINI_API_KEY to .env to use Vision');
    return;
  }

  console.log(`   ✅ Vision ready`);
}

export default {
  analyzeImageWithGemini,
  detectImageType,
  testVision,
};
