// import { Skeleton } from "@/components/ui/skeleton"
// import { useState } from "react"

// function MessageImageView({ src }: { src: string }) {
//   const [loaded, setLoaded] = useState(false)

//   return (
//     <div className="w-[300px] h-[200px] relative">
//       {!loaded && <Skeleton className="absolute w-full h-full rounded-md" />}
//       <img
//         src={src}
//         onLoad={() => setLoaded(true)}
//         alt="With Skeleton"
//         className={`w-full h-full object-cover rounded-md transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
//       />
//     </div>
//   )
// }

// export default MessageImageView

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { cn } from "@/lib/utils" // if you're using class merging utility

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