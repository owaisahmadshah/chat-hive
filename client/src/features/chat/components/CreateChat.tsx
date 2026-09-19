import { useState, type ChangeEvent, useMemo, useEffect } from "react";
import { Plus, Search, Loader2, MessageCircleMore } from "lucide-react";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { LoadMore } from "@/components/LoadMore";
import { useGetUsersByUsername } from "../hooks/useGetUsersByUsername";
import type { UserSummary } from "shared";
import { useUser } from "@/context/user-context";
import { useCreateNewChat } from "../hooks/useCreateNewChat";
import CreateChatUserItem from "./CreateChatUserItem";

export function CreateChat() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { state } = useUser();
  const currentUserId = state.user?.id;
  const createChat = useCreateNewChat();

  // Debounce input updates by 500ms before sending API requests
  const handleDebounce = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      handleDebounce.cancel();
    };
  }, [handleDebounce]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleDebounce(value.trim());
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetUsersByUsername(debouncedQuery);

  const users: UserSummary[] = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSelectUser = async (user: UserSummary) => {
    if (!currentUserId) return;

    await createChat({
      createdBy: currentUserId,
      isGroup: false,
      members: [user.id, currentUserId],
    });

    setOpen(false);
  };

  const isSearching = debouncedQuery.length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button className="flex items-center gap-2 rounded-full shadow-sm hover:shadow-md transition-all group h-10 px-5">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium text-sm">New chat</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-full sm:max-w-[380px] p-0 flex flex-col gap-0 border-r-border/40 bg-background/95 backdrop-blur-md"
      >
        <SheetHeader className="px-6 pt-8 pb-4 text-left">
          <div className="flex flex-col gap-1">
            <SheetTitle className="text-xl font-semibold tracking-tight">
              New message
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Search for a user to start a conversation.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="px-6 pb-4 pt-2">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              value={searchTerm}
              placeholder="Search username..."
              className="pl-10 h-11 bg-muted/50 hover:bg-muted focus-visible:bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-border rounded-xl transition-all shadow-sm"
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-6">
            {isLoading && isSearching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground font-medium">
                  Searching...
                </p>
              </div>
            ) : users.length > 0 ? (
              <div className="px-1">
                {users.map((user) => (
                  <CreateChatUserItem
                    key={user.id}
                    user={user}
                    onSelect={handleSelectUser}
                  />
                ))}

                <LoadMore
                  onLoad={fetchNextPage}
                  isPending={isFetchingNextPage}
                  hasNextPage={!!hasNextPage}
                  label="Load more"
                  direction="down"
                />
              </div>
            ) : isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground text-sm">
                  No users found
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  We couldn't find anyone with that username.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <MessageCircleMore className="w-6 h-6 text-primary/60" />
                </div>
                <h3 className="font-medium text-foreground text-sm">
                  Start a conversation
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Type a username above to search for people.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
