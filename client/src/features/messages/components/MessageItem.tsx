import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import {
  Check,
  CheckCheck,
  FileText,
  FileArchive,
  FileSpreadsheet,
  Download as DownloadIcon,
} from "lucide-react";
import { format } from "date-fns";

import type { Message } from "shared";
import { cn } from "@/lib/utils";
import { MessageActions } from "./MessageActions";

interface IMessageItemProps {
  message: Message;
  currentUserId?: string;
  deleteMessage: () => Promise<unknown>;
}

function getFileIconAndColor(fileName: string | null) {
  const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") return { Icon: FileText, color: "text-red-500" };
  if (["doc", "docx"].includes(ext))
    return { Icon: FileText, color: "text-blue-500" };
  if (["xls", "xlsx", "csv"].includes(ext))
    return { Icon: FileSpreadsheet, color: "text-emerald-500" };
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return { Icon: FileArchive, color: "text-amber-500" };
  return { Icon: FileText, color: "text-muted-foreground" };
}

function MessageItem({
  message,
  currentUserId,
  deleteMessage,
}: IMessageItemProps) {
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isMe = message.sender.id === currentUserId;

  const images = message.attachments.filter((att) => att.type === "image");
  const videos = message.attachments.filter((att) => att.type === "video");
  const audios = message.attachments.filter((att) => att.type === "audio");
  const files = message.attachments.filter((att) => att.type === "file");
  const hasMedia = message.attachments.length > 0;

  const latestStatus = message.statuses.filter(
    (status) => status.userId !== currentUserId,
  )[0]?.status;

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setOpen(true);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col max-w-[85%] md:max-w-[70%] transition-all",
        isMe ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "absolute top-0 z-20 transition-all duration-200",
          "right-1",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-0",
        )}
      >
        <MessageActions
          messageText={message.text || ""}
          deleteMessage={deleteMessage}
          isMe={isMe}
        />
      </div>

      <div
        className={cn(
          "relative overflow-hidden transition-all duration-200 shadow-sm border",
          isMe
            ? "bg-primary text-primary-foreground border-primary rounded-2xl rounded-tr-none"
            : "bg-muted/90 backdrop-blur-sm border-border/40 rounded-2xl rounded-tl-none",
          hasMedia ? "p-1" : "px-3 py-1.5",
        )}
      >
        {images.length > 0 && (
          <ImageGallery images={images} onImageClick={openLightboxAt} />
        )}

        {videos.length > 0 && (
          <div
            className={cn("flex flex-col gap-1", images.length > 0 && "mt-1")}
          >
            {videos.map((video) => (
              <video
                key={video.id}
                src={video.url}
                controls
                className="rounded-xl w-full max-w-[300px] max-h-[300px] bg-black"
              />
            ))}
          </div>
        )}

        {audios.length > 0 && (
          <div
            className={cn(
              "flex flex-col gap-1.5 p-1",
              (images.length > 0 || videos.length > 0) && "mt-1",
            )}
          >
            {audios.map((audio) => (
              <audio
                key={audio.id}
                src={audio.url}
                controls
                className="h-10 max-w-[280px]"
              />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div
            className={cn(
              "flex flex-col gap-1.5 p-1",
              (images.length > 0 || videos.length > 0 || audios.length > 0) &&
                "mt-1",
            )}
          >
            {files.map((file) => {
              const { Icon, color } = getFileIconAndColor(file.fileName);
              return (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.fileName || undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 min-w-[200px] max-w-[280px] transition-colors",
                    isMe
                      ? "bg-primary-foreground/10 hover:bg-primary-foreground/15"
                      : "bg-background/60 hover:bg-background/90",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isMe ? "opacity-90" : color,
                    )}
                  />
                  <span className="text-sm truncate flex-1">
                    {file.fileName || "Attachment"}
                  </span>
                  <DownloadIcon className="w-4 h-4 flex-shrink-0 opacity-50" />
                </a>
              );
            })}
          </div>
        )}

        {!message.text && hasMedia && (
          <div
            className={cn(
              "flex items-center gap-1 select-none",
              images.length > 0 || videos.length > 0
                ? "absolute bottom-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
                : "justify-end px-1 pb-0.5",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-medium",
                images.length > 0 || videos.length > 0
                  ? "text-white"
                  : isMe
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
              )}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
            <StatusIcon
              isMe={isMe}
              latestStatus={latestStatus}
              key={message.id}
            />
          </div>
        )}

        {message.text && (
          <div className={cn("relative", hasMedia && "p-2")}>
            <p
              className={cn(
                "text-[14.5px] leading-[1.4] whitespace-pre-wrap break-words",
                "pr-5",
                "pb-1",
              )}
            >
              {message.text}
              <span className="inline-block w-[65px]" />
            </p>

            <div className="absolute bottom-0 right-0 flex items-center gap-1 select-none pointer-events-none">
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums uppercase",
                  isMe ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </span>
              <StatusIcon
                isMe={isMe}
                latestStatus={latestStatus}
                key={message.id}
              />
            </div>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <Lightbox
          plugins={[Zoom, Download]}
          open={open}
          close={() => setOpen(false)}
          index={lightboxIndex}
          slides={images.map((img) => ({ src: img.url }))}
        />
      )}
    </div>
  );
}

function ImageGallery({
  images,
  onImageClick,
}: {
  images: { id: string; url: string; fileName: string | null }[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;

  if (count === 1) {
    return (
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={images[0].url}
          alt={images[0].fileName || "Attachment"}
          loading="lazy"
          className="cursor-pointer object-cover transition-transform duration-500 hover:scale-105 w-full h-auto min-w-[200px] max-w-[300px] max-h-[400px]"
          onClick={() => onImageClick(0)}
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-[280px] h-[180px]">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.fileName || "Attachment"}
            loading="lazy"
            className="cursor-pointer object-cover w-full h-full rounded-xl transition-transform duration-300 hover:brightness-95"
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 w-[280px] h-[220px]">
        <img
          src={images[0].url}
          alt={images[0].fileName || "Attachment"}
          loading="lazy"
          className="cursor-pointer object-cover w-full h-full rounded-xl row-span-2 transition-transform duration-300 hover:brightness-95"
          onClick={() => onImageClick(0)}
        />
        <img
          src={images[1].url}
          alt={images[1].fileName || "Attachment"}
          loading="lazy"
          className="cursor-pointer object-cover w-full h-full rounded-xl transition-transform duration-300 hover:brightness-95"
          onClick={() => onImageClick(1)}
        />
        <img
          src={images[2].url}
          alt={images[2].fileName || "Attachment"}
          loading="lazy"
          className="cursor-pointer object-cover w-full h-full rounded-xl transition-transform duration-300 hover:brightness-95"
          onClick={() => onImageClick(2)}
        />
      </div>
    );
  }

  const visible = images.slice(0, 4);
  const extra = count - 4;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-[280px] h-[280px]">
      {visible.map((img, i) => (
        <div key={img.id} className="relative w-full h-full">
          <img
            src={img.url}
            alt={img.fileName || "Attachment"}
            loading="lazy"
            className="cursor-pointer object-cover w-full h-full rounded-xl transition-transform duration-300 hover:brightness-95"
            onClick={() => onImageClick(i)}
          />
          {i === 3 && extra > 0 && (
            <div
              className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center cursor-pointer"
              onClick={() => onImageClick(i)}
            >
              <span className="text-white text-lg font-semibold">+{extra}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const StatusIcon = ({
  isMe,
  latestStatus,
}: {
  isMe: boolean;
  latestStatus: "read" | "delivered" | "sent";
}) => {
  if (!isMe) return null;
  if (latestStatus === "read") {
    return (
      <CheckCheck className="w-[15px] h-[15px] text-[#40c4ff] drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] stroke-[3px]" />
    );
  }
  if (latestStatus === "delivered") {
    return <CheckCheck className="w-4 h-4 text-primary-foreground/70" />;
  }
  return <Check className="w-4 h-4 text-primary-foreground/70" />;
};

export default MessageItem;
