import { useState, type ChangeEvent, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  UserPlus,
  Loader2,
  MessageCircleMore,
} from "lucide-react";
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
import CreateChatUserItem from "./CreateChatUserItem";
import type { UserSummary } from "shared";

export function CreateChat() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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

  const handleSelectUser = (user: UserSummary) => {
    // Action handler to trigger chat creation or set URL params
    console.log("Selected user for new chat:", user);
    setOpen(false);
  };

  const isSearching = debouncedQuery.length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button className="flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Chat</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">New Conversation</SheetTitle>
              <SheetDescription className="text-xs">
                Find someone to start a new chat with
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={searchTerm}
              placeholder="Search by username..."
              className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl transition-all"
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-6">
            {isLoading && isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-10 h-10 text-primary/40 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  Searching users...
                </p>
              </div>
            ) : users.length > 0 ? (
              <>
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
                  label="Load more users"
                  direction="down"
                />
              </>
            ) : isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different username
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <MessageCircleMore className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="font-semibold text-foreground/80">
                  Search users
                </h3>
                <p className="text-sm text-muted-foreground">
                  Type a name to see available users.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
