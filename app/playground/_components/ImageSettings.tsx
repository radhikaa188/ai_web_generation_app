"use client";

import React, { useRef, useState } from "react";
import {
    Image as ImageIcon,
    Crop,
    Expand,
    Image as ImageUpscale,
    ImageMinus,
    Loader2Icon
} from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit-javascript";
type Props = {
    selectedEl: HTMLImageElement;
};

const transformOptions = [
    { label: "Smart Crop", value: "smartcrop", icon: <Crop /> },
    { label: "Resize", value: "resize", icon: <Expand /> },
    { label: "BG Remove", value: "bgremove", icon: <ImageMinus /> },
];
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    // @ts-ignore
    authenticationEndpoint: "/api/imagekit-auth" // NAYA LINE
});

function ImageSettingSection({ selectedEl }: Props) {
    const [altText, setAltText] = useState(selectedEl.alt);
    const [width, setWidth] = useState<number>(selectedEl.width || 300);
    const [height, setHeight] = useState<number>(selectedEl.height || 300);
    const [borderRadius, setBorderRadius] = useState(
        selectedEl.style.borderRadius || "6px"
    );
    const [preview, setPreview] = useState(selectedEl.src || "");
    const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
    const [loading, setLoading] =useState(false)
    const [selectedImage, setSelectedImage] = useState<File>()
    // Toggle transform
    const toggleTransform = (value: string) => {
        setActiveTransforms((prev) =>
            prev.includes(value)
                ? prev.filter((t) => t !== value)
                : [...prev, value]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const saveUploadedFile=async()=>{
        if(selectedImage){
            setLoading(true)
        const imageRef=await imagekit.upload({
            // @ts-ignore
            file: selectedImage,
            fileName:Date.now()+"png",
            // @ts-ignore
            isPublished: true
        })
        console.log(imageRef)
        setLoading(false)
    }
}
    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="w-96 shadow p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
            <h2 className="flex gap-2 items-center font-bold sticky top-0 bg-white pt-1 pb-2">
                <ImageIcon /> Image Settings.
            </h2>

            {/* Preview */}
            <div className="flex justify-center">
                <img
                    src={preview}
                    alt={altText}
                    className="max-h-48 object-contain border rounded cursor-pointer hover:opacity-80"
                    onClick={openFileDialog}
                />
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <Button variant="outline" onClick={saveUploadedFile} className="w-full" disabled={loading}>
                {loading && <Loader2Icon className="animate-spin"/>} Upload Image
            </Button>

            {/* Alt text */}
            <div>
                <label className="text-sm mb-1 block">Prompt</label>
                <Input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Enter alt text"
                    className="mt-1"
                />
                <Button className="w-full mt-2">Generate AI Image</Button>
            </div>

            {/* Transforms Buttons */}
            <div>
                <label className="text-sm mb-1 block">AI Transform</label>
                <div className="flex gap-2 flex-wrap">
                    <TooltipProvider>
                        {transformOptions.map((opt) => {
                            const applied = activeTransforms.includes(opt.value);
                            return (
                                <Tooltip key={opt.value}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={applied ? "default" : "outline"}
                                            className="flex items-center justify-center p-2"
                                            onClick={() => toggleTransform(opt.value)}
                                        >
                                            {opt.icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {opt.label} {applied && "(Applied)"}
                                    </TooltipContent>
                                </Tooltip>
                            )})}
                    </TooltipProvider>
                </div>
            </div>
            
            {/* Conditional Resize Inputs */}
            {activeTransforms.includes("resize") && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm">Width</label>
                        <Input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-sm">Height</label>
                        <Input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            {/* Border Radius */}
            <div className="pb-2">
                <label className="text-sm">Border Radius</label>
                <Input
                    type="text"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    placeholder="e.g. 8px or 50%"
                    className="mt-1"
                />
            </div>
        </div>
    )
}
export default ImageSettingSection;