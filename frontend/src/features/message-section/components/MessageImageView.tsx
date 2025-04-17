import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { cn } from "@/lib/utils" // if you're using class merging utility
import { DialogTitle } from "@radix-ui/react-dialog"

type Props = {
  src: string
  alt?: string
  thumbnailClassName?: string
}

function MessageImageView({ src, alt = "", thumbnailClassName = "" }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative w-[250px] h-[350px] overflow-hidden rounded-lg", thumbnailClassName)}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-contain bg-black rounded-md cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </DialogTrigger>
      <DialogTitle></DialogTitle>{/**Just added instead you get error by adding you get warnings TODO: Handle */}
      <DialogContent
        className="bg-black/90 backdrop-blur-sm border-none p-0 max-w-full max-h-full flex items-center justify-center [&>button]:hidden"
        onClick={() => setOpen(false)}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
        />
      </DialogContent>
    </Dialog>
  )
}

export default MessageImageView