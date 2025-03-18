import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewChatButton() {
  return (
    <Button variant="outline" className="flex items-center gap-2 p-2">
      <Plus className="w-6 h-6" />
      <span>New Chat</span>
    </Button>
  )
}
