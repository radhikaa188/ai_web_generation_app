'use client'
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSecton from '../_components/ChatSecton'
import WebsiteDesign from '../_components/WebsiteDesign'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

export type Frame = {
    projectId: string,
    frameId: string,
    designCode: string,
    chatMessages: Messages[]
}
export type Messages = {
    role: string,
    content: string
}

const Prompt = `userInput: {userInput}
Instructions:
1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:
- Generate a complete HTML Tailwind CSS code using Flowbite UI components.
Use a modern design with **blue as the primary color theme**.
- Only include the <body> content (do not add <head> or <title>).
- Make it fully responsive for all screen sizes. All primary components must match the theme color.
⁃ Add proper padding and marain for each element. Components should be independent; do not connect them.
- Use placeholders for all images: ⁃ Liaht mode:
https://communitv.softr.io/uploads/db9110/oriainal/2X/ 7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg Dark https://www.cibaky
mode:
.com/wp-
content/uploads/2015/12/placeholder-3.jpg ⁃ Add alt tag describing the image prompt. - Use the following libraries/components where appropriate:
- FontAwesome icons (fa fa-) - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
⁃ Chart.js for charts & graphs ⁃ Swiper.js for sliders/carousels
Tippy.is for tooltips & popovers ⁃ Include interactive components like modals, dropdowns, and accordions.
Ensure proper spacing, alignment, hierarchy, and theme consistency.
Ensure charts are visually appealing and matck the theme color.
Header menu options should be spread out and not connected.
Do not include broken links ⁃ Do not add any extra text before or after the HTML code.
2. If the user input is **general text or greetings*₩ (e.g.,."Hi", "Hello", "How are you?") *or does not explicitly ask to generate code**, then:
- Respond with a simple, friendly text message instead of generating any code.
Example:
⁃ User: "Hi" > Response: "Hello! How can I help you today?"
⁃ User: "Build a responsive landing page with Tailwind CSS" -> Response: [Generate full HTML code as per instructions above]`

const PlayGround = () => {
    const { projectId } = useParams()
    const params = useSearchParams()
    const router = useRouter()
    const frameId = params.get('frameId')
    const [frameDetail, setFrameDetail] = useState<Frame>()
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<Messages[]>([])
    const [isHydrated, setIsHydrated] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string>('') // FIX: Properly typed
    // FIX: Track if we've processed the initial prompt
    const [initialPromptProcessed, setInitialPromptProcessed] = useState(false)

    // Load frame details
    useEffect(() => {
        if (frameId && projectId && !frameDetail) {
            GetFrameDetails()
        }
    }, [frameId, projectId])

    // FIX: Get initial prompt from sessionStorage
    useEffect(() => {
        if (isHydrated && !initialPromptProcessed) {
            const savedPrompt = sessionStorage.getItem('initialPrompt')
            if (savedPrompt) {
                console.log('Found initial prompt in sessionStorage:', savedPrompt)

                // Check if this prompt is already in messages
                const alreadyExists = messages.some(msg =>
                    msg.role === 'user' && msg.content === savedPrompt
                )

                if (!alreadyExists && messages.length === 0) {
                    // Add user message
                    const userMessage: Messages = {
                        role: 'user',
                        content: savedPrompt
                    }
                    setMessages([userMessage])

                    // Send to AI
                    SendMessage(savedPrompt)
                }

                // Clear storage
                sessionStorage.removeItem('initialPrompt')
                setInitialPromptProcessed(true)
            }
        }
    }, [isHydrated, messages, initialPromptProcessed])

    const GetFrameDetails = async () => {
        try {
            const result = await axios.get('/api/frames?frameId=' + frameId + '&projectId=' + projectId);
            setFrameDetail(result.data);
           
            const designCode=result.data?.designCode
            const index=designCode.indexOf("```html")+7
            const formattedCode=designCode.slice(index)
            setGeneratedCode(formattedCode)
            
            if (result.data?.chatMessage && Array.isArray(result.data.chatMessage)) {
                setMessages(result.data.chatMessage);
                console.log('Loaded messages from API:', result.data.chatMessage.length)
            }

            setIsHydrated(true);
        } catch (error) {
            console.error('Error loading frame details:', error);
            setIsHydrated(true);
        }
    };

    const SendMessage = async (userInput: string) => {
        setLoading(true);
        console.log('Sending message to AI:', userInput);

        // Add user message if not already added
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage && lastMessage.content === userInput && lastMessage.role === 'user') {
                return prev
            }
            return [...prev, { role: 'user', content: userInput }]
        });

        try {
            const result = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: Prompt?.replace('{userInput}', userInput)
                    }]
                })
            });

            if (!result.body) {
                throw new Error('No response body');
            }

            const reader = result.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';
            let codeBuffer = '';
            let isCode = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                if (!isCode && chunk.includes('```html')) {
                    isCode = true;
                    const startIndex = chunk.indexOf('```html') + 7;
                    codeBuffer += chunk.slice(startIndex);
                }
                else if (isCode) {
                    codeBuffer += chunk;
                }
            }

            if (codeBuffer.includes('```')) {
                codeBuffer = codeBuffer.split('```')[0];
            }

            // FIX: Log the generated code to console
            if (isCode && codeBuffer.trim()) {
                console.log('====== GENERATED CODE ======')
                console.log(codeBuffer.trim())
                console.log('====== END OF CODE ======')

                setGeneratedCode(codeBuffer.trim());
                await SaveGeneratedCode(codeBuffer.trim())
            }
            

            const assistantMessage: Messages = {
                role: 'assistant',
                content: isCode ? 'Your code is ready' : aiResponse
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            }]);
        } finally {
            
            setLoading(false);
        }
    };

    // Save messages
    // NEW - saves only after AI responds
    useEffect(() => {
        // Don't save during initial load or empty messages
        if (!isHydrated || messages.length === 0) return;

        // Get the last message
        const lastMessage = messages[messages.length - 1];

        // Only save when the LAST message is from AI (assistant)
        // This ensures we save the complete conversation
        if (lastMessage.role === 'assistant') {
            console.log('💾 Saving complete conversation (AI responded)');

            const timer = setTimeout(() => {
                SaveMessages();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [messages, isHydrated, loading]);

    const SaveMessages = async () => {
        try {

            console.log('🔄 Attempting to save messages:', {
                frameId: frameId,
                type: typeof frameId,
                messagesCount: messages.length
            });

            const result = await axios.put('/api/convo', {
                messages,
                frameId: frameId
            });
            console.log('Saved messages:', result.data);
        } catch (e) {
            console.error('Save failed', e);
        }
    };



    const SaveGeneratedCode=async (code:string)=>{
        const result = await axios.put('/api/frames',{
            designCode: code,
            frameId:frameId,
            projectId:projectId
        })
        toast.success('Website is ready')
    }

   // page.tsx
return (
  <div className="h-screen flex flex-col overflow-hidden">
    <PlaygroundHeader />
    
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Chat Section */}
      <div className="w-80 border-r border-gray-200">
        <ChatSecton
          messages={messages}
          onSend={(input: string) => SendMessage(input)}
          loading={loading}
        />
      </div>
      
      {/* Right: Website Design (takes remaining space) */}
      <div className="flex-1 overflow-hidden">
        <WebsiteDesign generatedCode={generatedCode} />
      </div>
    </div>
  </div>
);
}

export default PlayGround