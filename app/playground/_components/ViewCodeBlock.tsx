import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const ViewCodeBlock = ({children,code}:any) => {
    const handleCopy=async()=>{
        await navigator.clipboard.writeText(code)
        toast.success('Code Copied!')
    }
    return (
    <Dialog>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent className='min-w-7xl max-h-[600px] overflow-auto'>
    <DialogHeader>
      <DialogTitle> <div className='flex gap-5 items-center'> Source Code <Button onClick={handleCopy} style={{ cursor: "pointer" }} ><Copy/></Button> </div></DialogTitle>
      <DialogDescription>
        <div>
            <SyntaxHighlighter>
               {code}
            </SyntaxHighlighter>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default ViewCodeBlock