import api from "./api";
import { type CloudinarySignature } from "shared";

async function getSignature(): Promise<CloudinarySignature> {
  return api.post("/api/v1/uploads/signature", {
    folder: "chat-hive",
  });
}

export async function uploadToCloudinary(file: File) {
  const { signature, timestamp, folder, apiKey, cloudName } =
    await getSignature();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    fileName: file.name,
    type: mapResourceType(data.resource_type, file.type),
  };
}

function mapResourceType(
  resourceType: string,
  mime: string,
): "image" | "video" | "audio" | "file" {
  if (resourceType === "video")
    return mime.startsWith("audio/") ? "audio" : "video";
  if (resourceType === "image") return "image";
  return "file";
}
