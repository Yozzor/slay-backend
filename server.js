// ---------------------------------------------------------------------------
//  $SLAY Backend â€“ Y2K Avatar Generator API  (Node â‰Ą18, ESM)
// ---------------------------------------------------------------------------
import express from 'express';
import cors    from 'cors';
import multer  from 'multer';
import process from 'process';

// ---------------------------------------------------------------------------
// 1) CONFIG
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
  console.error('âťŚ Missing OPENAI_API_KEY environment variable');
  process.exit(1);
}

console.log('âś… OpenAI API Key loaded');

// ---------------------------------------------------------------------------
// 2) EXPRESS SETUP
// ---------------------------------------------------------------------------
const app = express();

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://localhost:5173',
    'https://localhost:5174',
    'https://localhost:5175',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:5182',
    'https://localhost:5182',
    'http://localhost:5183',
    'https://localhost:5183',
    'https://slay-backend-0xg4.onrender.com',
    'https://slaycoin.club',
    'http://slaycoin.club',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://127.0.0.1:5173',
    'https://127.0.0.1:5174',
    'https://127.0.0.1:5175'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ---------------------------------------------------------------------------
// 3) OPENAI FETCH HELPERS
// ---------------------------------------------------------------------------
async function openaiFetch(endpoint, body) {
  const url = `https://api.openai.com/v1${endpoint}`;
  console.log(`đź”„ OpenAI API call: ${endpoint}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`âťŚ OpenAI API error (${response.status}):`, errorText);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}



// ---------------------------------------------------------------------------
// 4) HEALTH CHECK
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: 'gpt-image-1 available' });
});

// ---------------------------------------------------------------------------
// 5) AVATAR GENERATOR ENDPOINT - Y2K Bratz Avatars (gpt-image-1 ONLY)
// ---------------------------------------------------------------------------
app.post('/api/generate-avatar', async (req, res) => {
  try {
    console.log('âś¨ Generating Y2K Bratz avatar...');

    // Random Y2K features for variety
    const hairStyles = [
      'red bob hair with face-framing layers',
      'long brown wavy hair',
      'blonde straight hair with chunky highlights',
      'black curly hair with volume',
      'auburn hair with bangs',
      'platinum blonde hair',
      'dark brown hair with red streaks'
    ];

    const outfits = [
      'paisley print halter top with gold jewelry',
      'metallic silver crop top',
      'butterfly print shirt',
      'velvet brown top with chain necklace',
      'sequined top with off-shoulder style',
      'leopard print top',
      'tie-dye crop top with low-cut style'
    ];

    const hair = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    const outfit = outfits[Math.floor(Math.random() * outfits.length)];

    // Your exact Y2K Bratz prompt
    const prompt = `2D cartoon illustration with polished sticker-like finish and bold outlines: Y2K Bratz girl with ${hair}, big almond-shaped eyes with dramatic lashes and bold winged eyeliner, glossy overlined lips with a pout or smirk, smooth skin with light blush and glowy highlights, long acrylic nails (hot pink or red) posed in a peace sign, flirty pose with confident or sassy expression, wearing ${outfit}, background filled with soft sparkle overlays and pink hearts - dreamy and girly, color palette: warm tones, golds, reds, peaches, soft browns - no harsh shadows, clean rendering`;

    console.log('âŹł Generating with gpt-image-1...');
    console.log('đźŽ¨ Prompt:', prompt);

    const imgResp = await openaiFetch('/images/generations', {
      model: 'gpt-image-1',
      prompt: prompt,
      size: '1024x1024'
    });

    console.log('đź“ˇ API Response received');

    // gpt-image-1 returns base64 for generations
    const base64Data = imgResp.data?.[0]?.b64_json;
    if (!base64Data) {
      console.error('âťŚ No base64 data in response:', imgResp);
      throw new Error('No base64 data returned from gpt-image-1');
    }

    const dataUrl = `data:image/png;base64,${base64Data}`;
    console.log('âś… Y2K Bratz avatar generated successfully!');

    // Auto-save to database
    const avatar = {
      id: Date.now().toString(),
      imageUrl: dataUrl,
      createdAt: new Date().toISOString()
    };
    avatarDatabase.unshift(avatar);
    if (avatarDatabase.length > 50) {
      avatarDatabase = avatarDatabase.slice(0, 50);
    }
    console.log(`đź’ľ Avatar auto-saved to database. Total: ${avatarDatabase.length}`);

    res.json({ success: true, imageUrl: dataUrl });

  } catch (err) {
    console.error('âťŚ Avatar generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 6) GIRLIFY ENDPOINT (alias for generate-avatar)
// ---------------------------------------------------------------------------
app.post('/api/girlify', async (req, res) => {
  try {
    console.log('âś¨ Girlify request received - generating Y2K Bratz avatar...');

    // Random Y2K features for variety
    const hairStyles = [
      'red bob hair with face-framing layers',
      'long brown wavy hair',
      'blonde straight hair with chunky highlights',
      'black curly hair with volume',
      'auburn hair with bangs',
      'platinum blonde hair',
      'dark brown hair with red streaks'
    ];

    const outfits = [
      'paisley print halter top with gold jewelry',
      'metallic silver crop top',
      'butterfly print shirt',
      'velvet brown top with chain necklace',
      'sequined top with off-shoulder style',
      'leopard print top',
      'tie-dye crop top with low-cut style'
    ];

    const hair = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    const outfit = outfits[Math.floor(Math.random() * outfits.length)];

    // Your exact Y2K Bratz prompt
    const prompt = `2D cartoon illustration with polished sticker-like finish and bold outlines: Y2K Bratz girl with ${hair}, big almond-shaped eyes with dramatic lashes and bold winged eyeliner, glossy overlined lips with a pout or smirk, smooth skin with light blush and glowy highlights, long acrylic nails (hot pink or red) posed in a peace sign, flirty pose with confident or sassy expression, wearing ${outfit}, background filled with soft sparkle overlays and pink hearts - dreamy and girly, color palette: warm tones, golds, reds, peaches, soft browns - no harsh shadows, clean rendering`;

    console.log('âŹł Generating with gpt-image-1...');
    console.log('đźŽ¨ Prompt:', prompt);

    const imgResp = await openaiFetch('/images/generations', {
      model: 'gpt-image-1',
      prompt: prompt,
      size: '1024x1024'
    });

    console.log('đź“ˇ API Response received');

    // gpt-image-1 returns base64 for generations
    const base64Data = imgResp.data?.[0]?.b64_json;
    if (!base64Data) {
      console.error('âťŚ No base64 data in response:', imgResp);
      throw new Error('No base64 data returned from gpt-image-1');
    }

    const dataUrl = `data:image/png;base64,${base64Data}`;
    console.log('âś… Y2K Bratz avatar generated successfully via girlify!');

    // Auto-save to database
    const avatar = {
      id: Date.now().toString(),
      imageUrl: dataUrl,
      createdAt: new Date().toISOString()
    };
    avatarDatabase.unshift(avatar);
    if (avatarDatabase.length > 50) {
      avatarDatabase = avatarDatabase.slice(0, 50);
    }
    console.log(`đź’ľ Girlify avatar auto-saved to database. Total: ${avatarDatabase.length}`);

    res.json({ success: true, imageUrl: dataUrl });

  } catch (err) {
    console.error('âťŚ Girlify error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 7) AVATAR DATABASE ENDPOINTS (In-Memory Storage for Development)
// ---------------------------------------------------------------------------
let avatarDatabase = []; // Simple in-memory storage for development

// Save avatar to database
app.post('/api/avatars', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }

    const avatar = {
      id: Date.now().toString(),
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };

    // Add to beginning of array (latest first)
    avatarDatabase.unshift(avatar);

    // Keep only last 50 avatars to prevent memory issues
    if (avatarDatabase.length > 50) {
      avatarDatabase = avatarDatabase.slice(0, 50);
    }

    console.log(`đź’ľ Avatar saved to database. Total: ${avatarDatabase.length}`);
    res.json({ success: true, avatar });

  } catch (error) {
    console.error('âťŚ Error saving avatar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all avatars
app.get('/api/avatars', (req, res) => {
  try {
    console.log(`đź“Š Fetching all avatars. Count: ${avatarDatabase.length}`);
    res.json({ success: true, avatars: avatarDatabase });
  } catch (error) {
    console.error('âťŚ Error fetching avatars:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get latest avatars
app.get('/api/avatars/latest/:count', (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const latestAvatars = avatarDatabase.slice(0, count);

    console.log(`đź“Š Fetching latest ${count} avatars. Found: ${latestAvatars.length}`);
    res.json({ success: true, avatars: latestAvatars });
  } catch (error) {
    console.error('âťŚ Error fetching latest avatars:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const today = new Date().toDateString();
    const todayCount = avatarDatabase.filter(avatar =>
      new Date(avatar.createdAt).toDateString() === today
    ).length;

    const stats = {
      total: avatarDatabase.length,
      today: todayCount
    };

    console.log(`đź“Š Stats requested:`, stats);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('âťŚ Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// 8) START SERVER
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`đźŽ€ $SLAY Backend running on port ${PORT}`);
  console.log(`đźŚ Health check: http://localhost:${PORT}/api/health`);
});
