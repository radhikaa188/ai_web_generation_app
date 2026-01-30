import React, { useEffect, useRef, useState } from 'react'
import WebPageTools from './WebPageTools';
import ElementSettings from './ElementSettings';

type Props = {
  generatedCode: string
}

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState('desktop')
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>()

  // Initialize iframe shell once
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    
    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      let hoverEl: HTMLElement | null = null;
      let selectedEl: HTMLElement | null = null;

      const handleMouseOver = (e: MouseEvent) => {
        if (selectedEl) return;
        const target = e.target as HTMLElement;
        if (hoverEl && hoverEl !== target) {
          hoverEl.style.outline = "";
        }
        hoverEl = target;
        hoverEl.style.outline = "2px dotted blue";
      };

      const handleMouseOut = (e: MouseEvent) => {
        if (selectedEl) return;
        if (hoverEl) {
          hoverEl.style.outline = "";
          hoverEl = null;
        }
      };

      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;

        if (selectedEl && selectedEl !== target) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
        }
        selectedEl = target;
        selectedEl.style.outline = "2px solid black";
        selectedEl.setAttribute("contenteditable", "true");
        selectedEl.focus();
        console.log("Selected element:", selectedEl);
        setSelectedElement(selectedEl)
      };

      const handleBlur = () => {
        if (selectedEl) {
          console.log("Final edited element:", selectedEl.outerHTML);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && selectedEl) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
          selectedEl.removeEventListener("blur", handleBlur);
          selectedEl = null;
        }
      };

      doc.body?.addEventListener("mouseover", handleMouseOver);
      doc.body?.addEventListener("mouseout", handleMouseOut);
      doc.body?.addEventListener("click", handleClick);
      doc.addEventListener("keydown", handleKeyDown);
    };

    // Set up load listener
    iframe.addEventListener("load", handleLoad);

    // Write the HTML
    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; overflow: auto; }
      body { padding: 20px; background: #f9fafb; }
    </style>
</head>
<body id="root"></body>
</html>
`);
      doc.close();
    }

    // Cleanup
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, []);

  // Update body only when code changes
  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      const root = doc.getElementById("root");
      if (root) {
        // Simple clean without complex replacements
        const cleanCode = generatedCode
          .replace(/min-h-screen/g, '')
          .replace(/h-screen/g, '')
          .replaceAll("<html>", "")
          .replaceAll("</html>", "")
          .replace("<body>", "")
          .replace("</body>", "");
        
        root.innerHTML = cleanCode;
      }
    }
  }, [generatedCode]);

  return (
    <div className='h-full flex gap-2 p-4 bg-gray-50'> {/* Added: h-full and bg-gray-50 */}
      {/* Left: Preview Section */}
      <div className='flex-1 flex flex-col min-h-0'> {/* Added: min-h-0 */}
        {/* Iframe Container */}
        <div className='flex-1 border rounded-lg overflow-hidden bg-white min-h-0'> {/* Added: min-h-0 */}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            title="Website Preview"
          />
        </div>
        
        {/* Tools */}
        <div className='mt-4'>
          <WebPageTools 
            selectedScreenSize={selectedScreenSize}
            setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
            generatedCode={generatedCode}
          />
        </div>
      </div>
      
      {/* Right: Settings Section */}
      <div className='w-96'>
        <ElementSettings 
          selectedElement={selectedElement!} 
          clearSelection={() => setSelectedElement(null)}
        />
      </div>
    </div>
  );
}

export default WebsiteDesign;