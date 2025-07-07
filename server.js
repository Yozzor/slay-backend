// $SLAY Backend - Y2K Girly AI Transformation API ✨💖
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import OpenAI from 'openai'

const app = express()
const port = process.env.PORT || 3001

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'], // Add your actual domain here
  credentials: true
}))
app.use(express.json())

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: '✨ $SLAY Backend is running! Ready to girlify! 💖✨',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running! Ready to girlify! 💖✨',
    openai: openai.apiKey ? 'Connected ✅' : 'Not configured ❌'
  })
})

// AI Girlify endpoint
app.post('/api/girlify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      })
    }

    console.log('🎀 Received image for girlification:', req.file.originalname)
    console.log('📁 File size:', req.file.size, 'bytes')
    console.log('🎨 File type:', req.file.mimetype)

    // Convert buffer to base64 for OpenAI API
    const inputBase64 = req.file.buffer.toString('base64')
    const inputDataUrl = `data:${req.file.mimetype};base64,${inputBase64}`

    console.log('👁️ Analyzing uploaded image with GPT-4 Vision...')
    
    // Universal image analysis for Y2K transformation - works on ANYTHING!
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image for Y2K glam transformation. Identify: 1) WHAT is the main subject (person, animal, object, etc.), 2) POSITION/POSE (sitting, standing, lying, angle, orientation), 3) KEY FEATURES (colors, textures, distinctive elements), 4) SETTING/BACKGROUND. Be specific about the pose/position as this must be maintained. Describe in under 120 words for any subject type."
            },
            {
              type: "image_url",
              image_url: {
                url: inputDataUrl,
                detail: "high" // Using high detail for better position/pose detection
              }
            }
          ]
        }
      ],
      max_tokens: 200
    })

    const imageAnalysis = visionResponse.choices[0].message.content
    console.log('🔍 Image analysis:', imageAnalysis)

    console.log('🔄 Generating Y2K girly transformation with DALL-E 3...')
    
    // Create adaptive Y2K transformation prompt that works for ANY subject
    const detailedPrompt = `Transform this subject into Y2K girly glam based on: "${imageAnalysis}".

CRITICAL: Maintain the EXACT same position, pose, angle, and orientation as described.

Apply Y2K girly transformation appropriate to the subject:

FOR PEOPLE: Glamorous Y2K makeup (sparkly lashes, glossy pink lips, shimmery eyeshadow), butterfly hair clips, chunky hoops, choker, metallic crop top, colorful hair streaks (pink/purple/blue).

FOR ANIMALS: Glittery fur/feathers with pink and purple highlights, sparkly accessories (tiny butterfly clips, glittery collars, holographic elements), Y2K-style backgrounds.

FOR OBJECTS: Holographic/iridescent surfaces, pink and purple color scheme, glittery textures, metallic finishes, Y2K decorative elements (butterflies, stars, hearts), sparkly embellishments.

UNIVERSAL Y2K ELEMENTS: Dreamy soft lighting with pink/purple glow, magical sparkles floating around, subtle holographic effects, Y2K pattern backgrounds (gradient mesh, butterflies, stars), maximum glitter and shine.

Style: High quality, detailed, vibrant Y2K aesthetic, super girly and cute with maximum sparkle. Keep the subject recognizable but completely glammed up in Y2K style.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: detailedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    })

    console.log('✨ AI girlification complete!')
    console.log('🖼️ Generated image URL:', response.data[0].url)

    // Download the image from OpenAI and serve it through our server to avoid CORS
    const imageResponse = await fetch(response.data[0].url)
    const imageBuffer = await imageResponse.arrayBuffer()

    // Convert to base64 for easy transfer
    const outputBase64 = Buffer.from(imageBuffer).toString('base64')
    const outputDataUrl = `data:image/png;base64,${outputBase64}`

    console.log('📸 Image downloaded and converted to data URL!')

    res.json({
      success: true,
      imageUrl: outputDataUrl, // Send as data URL to avoid CORS issues
      message: "Slay queen! Your image has been girlified! 💖✨"
    })

  } catch (error) {
    console.error('❌ Error girlifying image:', error)
    console.error('❌ Error details:', error.response?.data || error.message)

    res.status(500).json({
      success: false,
      error: 'Failed to girlify image',
      details: error.message,
      message: "Oops! Something went wrong with the AI magic! Try again bestie 💕"
    })
  }
})

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

app.listen(port, () => {
  console.log(`🎀 $SLAY Backend running on port ${port}`)
  console.log('✨ Ready to transform images with Y2K magic! ✨')
  console.log('🔑 OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'Yes ✅' : 'No ❌')
})
