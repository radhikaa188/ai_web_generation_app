import { SwatchBook } from 'lucide-react'
import React from 'react'
import { Tag, Plus, X, Search } from 'lucide-react';
import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Value } from '@radix-ui/react-select'

type Props = {
  selectedElement: HTMLElement,
  clearSelection: () => void
}
const ElementSettings = ({ selectedElement, clearSelection }: Props) => {

  if (!selectedElement) return null;

  const applyStyle = (property: string, value: string) => {
    if (selectedElement) {
      selectedElement.style[property as any] = value
    }
  }
  const [newClass, setNewClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Common Tailwind classes
  const tailwindClasses = [
    'flex', 'grid', 'block', 'hidden',
    'w-full', 'w-auto', 'w-1/2',
    'p-2', 'p-4', 'p-6', 'p-8',
    'm-2', 'm-4', 'm-6', 'm-8',
    'flex-col', 'flex-row',
    'justify-center', 'justify-between',
    'items-center', 'items-start',
    'text-center', 'text-left', 'text-right',
    'text-sm', 'text-base', 'text-lg', 'text-xl',
    'font-bold', 'font-medium',
    'text-white', 'text-black', 'text-gray-500',
    'bg-white', 'bg-black', 'bg-gray-100', 'bg-blue-500',
    'border', 'border-2', 'rounded', 'rounded-lg',
    'shadow', 'shadow-lg'
  ];

  // Filter classes
  const filteredClasses = tailwindClasses.filter(cls =>
    cls.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add class - directly modify the DOM element
  const addClass = (className?: string) => {
    const classToAdd = className || newClass.trim();
    if (!selectedElement || !classToAdd) return;

    const currentClasses = selectedElement.className || '';
    const classesArray = currentClasses.split(' ').filter(c => c.trim());

    // Don't add duplicates
    if (!classesArray.includes(classToAdd)) {
      selectedElement.className = [...classesArray, classToAdd].join(' ');
    }

    if (!className) setNewClass('');
  };

  // Remove class - directly modify the DOM element
  const removeClass = (classToRemove: string) => {
    if (!selectedElement) return;

    const currentClasses = selectedElement.className || '';
    const classesArray = currentClasses.split(' ').filter(c => c.trim());
    const filteredClasses = classesArray.filter(c => c !== classToRemove);

    selectedElement.className = filteredClasses.join(' ');
  };



  return (
    <div className='w-96 shadow p-5 h-full flex flex-col'>
      <div className='flex-1 overflow-y-auto'>
      <h2 className='flex gap-2 items-center font-bold'><SwatchBook />Settings</h2>

      <label className='text-sm'>Font Size</label>
      <Select defaultValue={selectedElement?.style?.fontSize || '24px'}
        onValueChange={(value) => applyStyle('fontSize', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Size" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(53)].map((item, index) => (
            <SelectItem value={index + 12 + 'px'} key={index}>{index + 12}px</SelectItem>
          ))}

        </SelectContent>
      </Select>
      <label className='font-sm mt-3'>Text Color</label>
      <div>
        <input type="color" className='w-[40px] h-[40px] rounded-lg'
          onChange={(e) => applyStyle('color', e.target.value)}
        />
      </div>

      <label className='text-sm mt-3'>Text Alignment</label>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => applyStyle('textAlign', 'left')}
          className={`p-2 rounded border ${selectedElement?.style?.textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => applyStyle('textAlign', 'center')}
          className={`p-2 rounded border ${selectedElement?.style?.textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => applyStyle('textAlign', 'right')}
          className={`p-2 rounded border ${selectedElement?.style?.textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => applyStyle('textAlign', 'justify')}
          className={`p-2 rounded border ${selectedElement?.style?.textAlign === 'justify' ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          <AlignJustify className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Background Color */}
        <div>
          <label className="text-sm">Background</label>
          <input
            type="color"
            className="w-full h-10 rounded-lg cursor-pointer mt-1"
            value={selectedElement?.style?.backgroundColor || '#ffffff'}
            onChange={(e) => applyStyle('backgroundColor', e.target.value)}
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="text-sm">Border Radius</label>
          <Select
            value={selectedElement?.style?.borderRadius || '0px'}
            onValueChange={(value) => applyStyle('borderRadius', value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              {['0px', '4px', '8px', '12px', '16px', '24px', '32px', '50%'].map((radius) => (
                <SelectItem value={radius} key={radius}>
                  {radius}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Padding - Simple */}
      <label className="text-sm mt-4 block">Padding</label>
      <Select
        value={selectedElement?.style?.padding || '0px'}
        onValueChange={(value) => applyStyle('padding', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Padding" />
        </SelectTrigger>
        <SelectContent>
          {['0px', '4px', '8px', '12px', '16px', '24px', '32px'].map((size) => (
            <SelectItem value={size} key={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Margin - Simple */}
      <label className="text-sm mt-4 block">Margin</label>
      <Select
        value={selectedElement?.style?.margin || '0px'}
        onValueChange={(value) => applyStyle('margin', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Margin" />
        </SelectTrigger>
        <SelectContent>
          {['0px', '4px', '8px', '12px', '16px', '24px', '32px'].map((size) => (
            <SelectItem value={size} key={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>




      <label className="text-sm flex items-center gap-2 mt-4 mb-2">
        <Tag className="w-4 h-4" />
        Tailwind Classes
      </label>

      {/* Current classes */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-8 p-2 border rounded bg-gray-50">
        {selectedElement?.className?.split(' ').filter(c => c.trim()).map((className) => (
          <div
            key={className}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {className}
            <button
              onClick={() => removeClass(className)}
              className="text-blue-600 hover:text-blue-800 ml-1"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Tailwind classes..."
          className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Suggestions */}
      {searchQuery && (
        <div className="border rounded-lg max-h-40 overflow-y-auto mb-3">
          {filteredClasses.map((className) => (
            <button
              key={className}
              onClick={() => {
                addClass(className);
                setSearchQuery('');
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
              type="button"
            >
              {className}
            </button>
          ))}
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add class..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addClass()}
        />
        <button
          onClick={() => addClass()}
          disabled={!newClass.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      </div>

    </div>
  )
}

export default ElementSettings