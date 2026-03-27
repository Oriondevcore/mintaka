import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('🎤 STT Module initialized');
console.log(`   Provider: Groq Whisper`);
console.log(`   Status: ${GROQ_API_KEY ? '✅' : '❌ No API key'}\n`);

/**
 * HANDLE VOICE MESSAGE - Full pipeline
 * Downloads from WhatsApp, transcribes, cleans up
 */
export async function handleVoiceMessage(tempAudioPath) {
  let transcribedText = null;

  try {
    if (!fs.existsSync(tempAudioPath)) {
      throw new Error(`Audio file not found: ${tempAudioPath}`);
    }

    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Transcribe
    transcribedText = await transcribeWithGroq(tempAudioPath);

    if (!transcribedText) {
      throw new Error('Transcription returned empty');
    }

    return transcribedText;
  } catch (error) {
    console.error('❌ Voice handling error:', error.message);
    return null;
  } finally {
    // Cleanup temp file
    if (tempAudioPath && fs.existsSync(tempAudioPath)) {
      setTimeout(() => {
        try {
          fs.unlinkSync(tempAudioPath);
        } catch (e) {}
      }, 1000);
    }
  }
}

/**
 * TRANSCRIBE WITH GROQ WHISPER
 * Uses form-data package for reliable multipart uploads
 */
async function transcribeWithGroq(audioPath) {
  try {
    // Detect MIME type from file extension
    const ext = path.extname(audioPath).toLowerCase();
    let mimeType = 'audio/ogg';

    if (ext === '.mp3') mimeType = 'audio/mpeg';
    else if (ext === '.wav') mimeType = 'audio/wav';
    else if (ext === '.m4a') mimeType = 'audio/mp4';

    console.log(`   🎤 Transcribing (${mimeType})...`);

    // Create form data with file stream (more reliable)
    const form = new FormData();
    form.append('file', fs.createReadStream(audioPath), {
      filename: 'audio.ogg',
      contentType: mimeType,
    });
    form.append('model', 'whisper-large-v3');
    form.append('language', 'en');

    console.log(`   📤 Sending to Groq API...`);

    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      form,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          ...form.getHeaders(),
        },
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    const text = response.data?.text;

    if (!text) {
      console.error(`   ❌ Groq returned empty response`);
      console.error(`   Response data:`, response.data);
      throw new Error('No transcription in response');
    }

    console.log(`   ✅ Transcribed: "${text.substring(0, 50)}..."`);
    return text.trim();
  } catch (error) {
    console.error(`   ❌ Groq error: ${error.message}`);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response:`, error.response.data);

      if (error.response.status === 400) {
        console.error(`   ACTION: Audio format issue`);
        console.error(`   - Audio should be OGG with Opus codec`);
        console.error(`   - Check file is not corrupted`);
      } else if (error.response.status === 401) {
        console.error(`   ACTION: Authentication failed`);
        console.error(`   - Verify GROQ_API_KEY in .env`);
        console.error(`   - Should start with 'sk-'`);
      } else if (error.response.status === 429) {
        console.error(`   ACTION: Rate limited (60 req/minute)`);
        console.error(`   - Wait 60 seconds before retrying`);
      } else if (error.response.status === 500) {
        console.error(`   ACTION: Groq server error`);
        console.error(`   - Try again in a few seconds`);
      }
    } else if (error.request) {
      console.error(`   No response from Groq`);
      console.error(`   - Check internet connection`);
      console.error(`   - Check firewall settings`);
    } else {
      console.error(`   Error setting up request:`, error.message);
    }

    return null;
  }
}

/**
 * TEST STT
 */
export async function testSTT() {
  console.log('\n🧪 Testing STT...');
  console.log(`   API Key configured: ${GROQ_API_KEY ? '✅' : '❌'}`);

  if (!GROQ_API_KEY) {
    console.log('   Add GROQ_API_KEY to .env to use STT');
    console.log('   Get key from: https://console.groq.com');
    return false;
  }

  console.log(`   ✅ STT ready (test with actual voice message)`);
  return true;
}

export default {
  handleVoiceMessage,
  testSTT,
};
