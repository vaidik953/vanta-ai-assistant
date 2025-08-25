'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, PenTool, Hash, Lightbulb, FileText, Target, Zap } from 'lucide-react'

export type ContentType = 'academic' | 'creative' | 'social' | 'technical'

interface ContentTemplate {
  id: string
  name: string
  description: string
  type: ContentType
  icon: React.ElementType
  prompts: string[]
  structure: string[]
}

interface ContentGeneratorProps {
  onContentGenerate: (content: string, type: ContentType) => void
  currentMode: string
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onContentGenerate, currentMode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const contentTemplates: ContentTemplate[] = [
    {
      id: 'physics-answer',
      name: 'Physics Answer',
      description: 'Structured academic response for physics problems',
      type: 'academic',
      icon: BookOpen,
      prompts: [
        'Explain the concept of momentum in collisions',
        'Analyze projectile motion with air resistance',
        'Describe electromagnetic wave properties',
        'Calculate work and energy in mechanical systems'
      ],
      structure: [
        '**Key Concepts:**',
        '**Given Information:**',
        '**Solution Steps:**',
        '**Final Answer:**',
        '**Verification:**'
      ]
    },
    {
      id: 'pe-analysis',
      name: 'PE Analysis',
      description: 'Physical Education topic analysis and recommendations',
      type: 'academic',
      icon: Target,
      prompts: [
        'Design a cardiovascular fitness program',
        'Analyze proper weightlifting form',
        'Create injury prevention strategies',
        'Develop flexibility and mobility routines'
      ],
      structure: [
        '**Objective:**',
        '**Key Principles:**',
        '**Implementation:**',
        '**Safety Considerations:**',
        '**Expected Outcomes:**'
      ]
    },
    {
      id: 'essay-structure',
      name: 'Academic Essay',
      description: 'Well-structured academic essay with clear arguments',
      type: 'academic',
      icon: FileText,
      prompts: [
        'The impact of renewable energy on society',
        'Critical analysis of historical events',
        'Comparative study of educational systems',
        'Environmental challenges and solutions'
      ],
      structure: [
        '**Introduction:**',
        '**Thesis Statement:**',
        '**Body Paragraphs:**',
        '**Evidence & Analysis:**',
        '**Conclusion:**'
      ]
    },
    {
      id: 'creative-story',
      name: 'Creative Writing',
      description: 'Engaging stories, poems, or creative content',
      type: 'creative',
      icon: PenTool,
      prompts: [
        'Write a short sci-fi story about time travel',
        'Create a poem about nature and seasons',
        'Develop a character backstory for a novel',
        'Write dialogue between conflicting characters'
      ],
      structure: [
        '**Setting & Atmosphere:**',
        '**Character Development:**',
        '**Plot Structure:**',
        '**Conflict & Resolution:**',
        '**Literary Devices:**'
      ]
    },
    {
      id: 'brand-copy',
      name: 'Brand Copy',
      description: 'Compelling marketing and brand messaging',
      type: 'creative',
      icon: Zap,
      prompts: [
        'Create a product launch announcement',
        'Write compelling brand storytelling',
        'Develop value proposition messaging',
        'Craft customer testimonial requests'
      ],
      structure: [
        '**Hook/Attention Grabber:**',
        '**Value Proposition:**',
        '**Key Benefits:**',
        '**Social Proof:**',
        '**Call to Action:**'
      ]
    },
    {
      id: 'social-posts',
      name: 'Social Media',
      description: 'Engaging social media posts and captions',
      type: 'social',
      icon: Hash,
      prompts: [
        'Create Instagram post about productivity tips',
        'Write LinkedIn article announcement',
        'Develop Twitter thread about industry trends',
        'Craft Facebook event promotion'
      ],
      structure: [
        '**Hook (First Line):**',
        '**Value/Entertainment:**',
        '**Engagement Element:**',
        '**Hashtags:**',
        '**Call to Action:**'
      ]
    },
    {
      id: 'technical-doc',
      name: 'Technical Writing',
      description: 'Clear technical documentation and guides',
      type: 'technical',
      icon: Lightbulb,
      prompts: [
        'Write API documentation guide',
        'Create step-by-step tutorial',
        'Develop troubleshooting manual',
        'Explain complex technical concepts'
      ],
      structure: [
        '**Overview:**',
        '**Prerequisites:**',
        '**Step-by-Step Instructions:**',
        '**Examples:**',
        '**Troubleshooting:**'
      ]
    }
  ]

  const generateContent = (template: ContentTemplate, prompt?: string) => {
    const inputPrompt = prompt || customPrompt || template.prompts[0]
    
    // Enhanced content generation with more detailed responses
    let generatedContent = ''

    switch (template.id) {
      case 'physics-answer':
        generatedContent = generatePhysicsAnswer(inputPrompt)
        break
      case 'pe-analysis':
        generatedContent = generatePEAnalysis(inputPrompt)
        break
      case 'essay-structure':
        generatedContent = generateAcademicEssay(inputPrompt)
        break
      case 'creative-story':
        generatedContent = generateCreativeContent(inputPrompt)
        break
      case 'brand-copy':
        generatedContent = generateBrandCopy(inputPrompt)
        break
      case 'social-posts':
        generatedContent = generateSocialMedia(inputPrompt)
        break
      case 'technical-doc':
        generatedContent = generateTechnicalDoc(inputPrompt)
        break
      default:
        generatedContent = `I'll help you with "${inputPrompt}". Let me provide a structured response based on the ${template.name} format.`
    }

    onContentGenerate(generatedContent, template.type)
    setCustomPrompt('')
  }

  const generatePhysicsAnswer = (prompt: string): string => {
    return `**Physics Analysis: ${prompt}**

**Key Concepts:**
• Newton's Laws of Motion
• Conservation of Energy and Momentum  
• Force Analysis and Free Body Diagrams
• Kinematic and Dynamic Relationships

**Given Information:**
• Initial conditions and constraints
• Known variables and constants
• Physical properties of the system

**Solution Steps:**
1. **Identify the physical principles:** Determine which laws and concepts apply
2. **Set up the coordinate system:** Choose appropriate reference frame
3. **Draw free body diagrams:** Show all forces acting on objects
4. **Apply governing equations:** Use relevant physics formulas
5. **Solve systematically:** Work through mathematical calculations
6. **Check units and magnitude:** Verify answer makes physical sense

**Mathematical Framework:**
For motion problems: $F = ma$, $v = u + at$, $s = ut + \\frac{1}{2}at^2$
For energy problems: $KE = \\frac{1}{2}mv^2$, $PE = mgh$, $W = F \\cdot d$

**Final Answer:**
[Specific numerical result with proper units and significant figures]

**Verification:**
• Units check out correctly
• Order of magnitude is reasonable  
• Direction and sign make physical sense
• Limiting cases behave as expected

**Further Considerations:**
Would you like me to elaborate on any specific step or explore related concepts?`
  }

  const generatePEAnalysis = (prompt: string): string => {
    return `**Physical Education Analysis: ${prompt}**

**Objective:**
To develop a comprehensive understanding and practical approach to ${prompt.toLowerCase()}.

**Key Principles:**
• **Progressive Overload:** Gradually increase intensity, duration, or complexity
• **Specificity:** Training should match the demands of the target activity  
• **Individual Adaptation:** Consider personal fitness level and limitations
• **Recovery & Rest:** Allow adequate time for physiological adaptations

**Implementation Strategy:**
1. **Assessment Phase:** Evaluate current fitness level and capabilities
2. **Goal Setting:** Establish SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
3. **Program Design:** Create structured plan with proper progression
4. **Execution:** Implement with proper form and technique
5. **Monitoring:** Track progress and adjust as needed

**Safety Considerations:**
• Proper warm-up and cool-down protocols
• Correct technique and body mechanics
• Appropriate equipment and environment
• Recognition of warning signs and contraindications
• Emergency procedures and injury prevention

**Expected Outcomes:**
• Improved physical fitness and performance
• Enhanced body awareness and coordination
• Reduced injury risk
• Better understanding of movement principles
• Increased confidence in physical activities

**Recommendations:**
Would you like specific exercises, progressions, or modifications for this topic?`
  }

  const generateAcademicEssay = (prompt: string): string => {
    return `**Academic Essay: ${prompt}**

**Introduction:**
The topic of ${prompt.toLowerCase()} represents a significant area of scholarly inquiry that demands careful examination. This essay will provide a comprehensive analysis of the key issues, presenting evidence-based arguments and critical insights.

**Thesis Statement:**
Through systematic investigation of multiple perspectives and empirical evidence, this analysis demonstrates the complex interrelationships within ${prompt.toLowerCase()} and their broader implications for our understanding of the subject.

**Body Paragraphs:**

**Paragraph 1: Historical Context & Background**
• Origins and development of the topic
• Key historical events and milestones
• Evolution of understanding over time

**Paragraph 2: Current State of Knowledge**
• Contemporary research findings
• Prevailing theories and frameworks
• Areas of consensus and debate

**Paragraph 3: Critical Analysis**
• Strengths and limitations of current approaches
• Gaps in existing knowledge
• Methodological considerations

**Evidence & Analysis:**
• Peer-reviewed research citations
• Statistical data and empirical findings
• Expert opinions and authoritative sources
• Logical reasoning and critical evaluation

**Conclusion:**
This analysis reveals that ${prompt.toLowerCase()} involves multifaceted considerations requiring interdisciplinary approaches. The evidence suggests that future research should focus on [specific recommendations]. Understanding these complexities is essential for advancing both theoretical knowledge and practical applications in this field.

**References:**
[Academic sources would be listed here in appropriate citation format]

Would you like me to expand on any particular section or provide specific examples?`
  }

  const generateCreativeContent = (prompt: string): string => {
    return `**Creative Piece: ${prompt}**

**Setting & Atmosphere:**
The story unfolds in a world where imagination meets reality, creating a rich tapestry of sensory details that draw the reader into an immersive experience.

**Opening Hook:**
*The clock struck midnight, but time had lost all meaning...*

**Character Development:**
Our protagonist emerges as a complex individual, shaped by circumstances yet driven by inner desires that propel the narrative forward. Each character serves a specific purpose in the story's architecture.

**Plot Structure:**
• **Exposition:** Establishes world, characters, and initial situation
• **Rising Action:** Builds tension and develops conflicts
• **Climax:** The pivotal moment of transformation
• **Falling Action:** Consequences unfold
• **Resolution:** New equilibrium is reached

**Creative Elements:**
• **Symbolism:** Objects and events carry deeper meaning
• **Metaphor:** Complex ideas expressed through comparison
• **Imagery:** Vivid descriptions engage the senses
• **Dialogue:** Character voices feel authentic and purposeful

**Sample Excerpt:**
*She stood at the threshold between worlds, feeling the weight of infinite possibilities pressing against her consciousness. Each choice would ripple through the fabric of reality, creating new paths while closing others forever.*

**Literary Devices Used:**
• Foreshadowing to build anticipation
• Irony to add depth and complexity  
• Repetition for emphasis and rhythm
• Alliteration for musical quality

**Themes Explored:**
The piece delves into universal human experiences: the search for meaning, the nature of choice, and the transformative power of connection.

Would you like me to develop this further or focus on a specific aspect of the creative writing?`
  }

  const generateBrandCopy = (prompt: string): string => {
    return `**Brand Copy: ${prompt}**

**Hook/Attention Grabber:**
🚀 *Transform your world in ways you never imagined possible.*

**Value Proposition:**
We don't just deliver products—we create experiences that elevate your lifestyle and empower your journey toward excellence.

**Key Benefits:**
✨ **Exceptional Quality:** Premium materials and meticulous craftsmanship
🎯 **Targeted Solutions:** Designed specifically for your unique needs
⚡ **Instant Impact:** See results from day one
🛡️ **Reliable Support:** We're with you every step of the way
🌱 **Sustainable Choice:** Good for you and the planet

**Emotional Connection:**
Imagine waking up every day knowing you've made the right choice—confident, empowered, and ready to tackle whatever comes your way.

**Social Proof:**
*"This changed everything for me. I wish I had discovered this sooner!"* 
— Sarah M., Verified Customer

**Trust Indicators:**
• 10,000+ satisfied customers
• 4.9/5 star rating
• Money-back guarantee
• Award-winning innovation

**Call to Action:**
**Ready to transform your experience?**
Join thousands who've already made the smart choice.

**[Get Started Today →]**

**Urgency Element:**
Limited time offer — don't let this opportunity pass you by.

**Brand Voice:**
Confident • Authentic • Empowering • Results-Driven

Would you like me to adapt this for a specific product, service, or marketing channel?`
  }

  const generateSocialMedia = (prompt: string): string => {
    return `**Social Media Content: ${prompt}**

**Hook (First Line):**
🔥 Stop scrolling! This will change how you think about [topic]...

**Value/Entertainment:**
Here's what nobody tells you about [relevant topic]:
• Insight #1 that challenges common thinking
• Practical tip that delivers immediate results  
• Surprising fact that sparks curiosity

**Engagement Element:**
💭 What's your experience with this? Drop a comment below!
👥 Tag someone who needs to see this
📱 Share if this resonates with you

**Visual Elements:**
📸 Eye-catching image suggestion: [Relevant visual concept]
🎨 Color scheme: Vibrant and on-brand
📊 Include infographic elements for better engagement

**Platform-Specific Optimization:**

**Instagram:**
• Perfect square image (1080x1080)
• Story-friendly vertical format available
• Carousel post potential for multi-slide content

**LinkedIn:**
• Professional tone with industry insights
• Thought leadership positioning
• Networking call-to-action

**Twitter/X:**
• Thread-worthy content breakdown
• Retweet-optimized formatting
• Trending hashtag integration

**Hashtags:**
#PrimaryKeyword #SecondaryKeyword #Industry #Trending #YourBrand

**Call to Action:**
🚀 Follow for more insights like this
🔔 Turn on notifications so you never miss updates
🔗 Link in bio for the full guide

**Best Posting Times:**
📅 Weekdays: 9-11 AM, 1-3 PM
📅 Weekends: 12-2 PM

**Engagement Boosters:**
• Ask questions to spark conversation
• Share behind-the-scenes content
• Use polls and interactive features
• Respond quickly to comments

Would you like me to customize this for a specific platform or audience?`
  }

  const generateTechnicalDoc = (prompt: string): string => {
    return `# Technical Documentation: ${prompt}

## Overview
This guide provides comprehensive instructions for ${prompt.toLowerCase()}, designed for both beginners and experienced users.

## Prerequisites
- **System Requirements:** [Specify minimum requirements]
- **Required Knowledge:** Basic understanding of [relevant concepts]
- **Tools Needed:** [List necessary software/hardware]
- **Estimated Time:** [Duration for completion]

## Quick Start
\`\`\`bash
# Installation command
npm install example-package

# Basic usage
import { ExampleFunction } from 'example-package'
\`\`\`

## Step-by-Step Instructions

### Step 1: Initial Setup
1. **Download and Install**
   - Navigate to the official repository
   - Follow platform-specific installation guide
   - Verify installation: \`example-command --version\`

2. **Configuration**
   - Create configuration file: \`config.json\`
   - Set required parameters
   - Test configuration: \`example-command test\`

### Step 2: Implementation
\`\`\`javascript
// Example code block
const example = new ExampleClass({
  apiKey: 'your-api-key',
  environment: 'production'
});

await example.initialize();
\`\`\`

### Step 3: Advanced Features
- **Feature A:** Detailed explanation with use cases
- **Feature B:** Implementation examples and best practices
- **Feature C:** Performance optimization tips

## Examples

### Basic Example
\`\`\`javascript
// Simple implementation
const result = await example.process(inputData);
console.log(result);
\`\`\`

### Advanced Example
\`\`\`javascript
// Complex workflow with error handling
try {
  const pipeline = example.createPipeline()
    .addStep('validation')
    .addStep('processing')
    .addStep('output');
  
  const result = await pipeline.execute(data);
  return result;
} catch (error) {
  console.error('Pipeline failed:', error.message);
  throw error;
}
\`\`\`

## Troubleshooting

### Common Issues

**Issue 1: Installation Fails**
- **Cause:** Insufficient permissions
- **Solution:** Run with administrator privileges
- **Prevention:** Use package manager with proper configuration

**Issue 2: Configuration Errors**
- **Symptoms:** Application fails to start
- **Diagnosis:** Check configuration file syntax
- **Fix:** Validate JSON format and required fields

### Error Codes
| Code | Description | Solution |
|------|-------------|----------|
| E001 | Invalid API key | Check credentials |
| E002 | Network timeout | Verify connectivity |
| E003 | Resource not found | Check resource path |

## Best Practices
- ✅ Always validate input data
- ✅ Implement proper error handling
- ✅ Use environment-specific configurations
- ✅ Monitor performance and logs
- ❌ Don't hardcode sensitive information
- ❌ Don't skip testing in staging environment

## API Reference
Detailed API documentation available at: [link to API docs]

## Support
- 📧 Email: support@example.com
- 💬 Community Forum: [forum link]
- 📚 Documentation: [docs link]
- 🐛 Bug Reports: [issue tracker]

Would you like me to expand on any specific section or add more technical details?`
  }

  const getTemplatesByType = (type: ContentType) => {
    return contentTemplates.filter(template => template.type === type)
  }

  return (
    <motion.div 
      className="glass p-4 rounded-lg"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-green-400">Content Generator</h3>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {isExpanded ? 'Collapse' : 'Expand Templates'}
        </motion.button>
      </div>

      {/* Content Type Filter */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          {(['academic', 'creative', 'social', 'technical'] as ContentType[]).map((type) => (
            <motion.button
              key={type}
              className={`px-3 py-1 rounded text-xs capitalize transition-all duration-200 glass bg-white/5 hover:bg-green-500/20 border border-white/10`}
              whileHover={{ scale: 1.05 }}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Templates */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-400 mb-2">Quick Templates</h4>
        <div className="grid grid-cols-2 gap-2">
          {contentTemplates.slice(0, isExpanded ? contentTemplates.length : 4).map((template) => {
            const IconComponent = template.icon
            return (
              <motion.button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`glass bg-white/5 hover:bg-green-500/20 p-3 rounded text-left transition-all duration-200 hover:border-green-400/50 group ${
                  selectedTemplate?.id === template.id ? 'border-green-400/50 bg-green-500/10' : 'border-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">{template.name}</span>
                </div>
                <div className="text-xs text-gray-400">{template.description}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Custom Input */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-400 mb-2">Custom Prompt</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom writing prompt..."
            className="flex-1 bg-black/20 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50"
          />
          {selectedTemplate && (
            <motion.button
              onClick={() => generateContent(selectedTemplate)}
              disabled={!customPrompt.trim() && !selectedTemplate}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate
            </motion.button>
          )}
        </div>
      </div>

      {/* Template Details */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass bg-white/5 p-3 rounded"
          >
            <h4 className="text-sm font-semibold text-green-400 mb-2">{selectedTemplate.name}</h4>
            <p className="text-xs text-gray-400 mb-3">{selectedTemplate.description}</p>
            
            <div className="mb-3">
              <h5 className="text-xs font-medium text-white mb-1">Sample Prompts:</h5>
              <div className="space-y-1">
                {selectedTemplate.prompts.slice(0, 3).map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => generateContent(selectedTemplate, prompt)}
                    className="w-full text-left text-xs text-gray-300 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    • {prompt}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-medium text-white mb-1">Content Structure:</h5>
              <div className="text-xs text-gray-400">
                {selectedTemplate.structure.map((item, index) => (
                  <div key={index} className="mb-1">• {item}</div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tip: Select a template and use sample prompts, or enter your custom request for personalized content generation.</p>
      </div>
    </motion.div>
  )
}

export default ContentGenerator