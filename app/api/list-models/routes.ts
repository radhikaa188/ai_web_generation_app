// // app/api/list-models/route.ts
// export async function GET() {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
    
//     if (!apiKey) {
//       return Response.json({ error: "API key not set" }, { status: 500 });
//     }

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       const error = await response.text();
//       return Response.json({ error }, { status: response.status });
//     }

//     const data = await response.json();
    
//     // Filter to show only models that support generateContent
//     const models = data.models
//       .filter((model: any) => 
//         model.supportedGenerationMethods?.includes('generateContent')
//       )
//       .map((model: any) => ({
//         name: model.name,
//         displayName: model.displayName,
//         description: model.description,
//         supportedGenerationMethods: model.supportedGenerationMethods,
//         inputTokenLimit: model.inputTokenLimit,
//         outputTokenLimit: model.outputTokenLimit,
//       }));

//     return Response.json({ models });
//   } catch (error: any) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/test-key/route.ts
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  return Response.json({
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 10) + '...' || 'none',
    suggestion: "Try 'gemini-pro' model name"
  });
}