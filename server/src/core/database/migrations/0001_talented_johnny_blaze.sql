DROP INDEX "chat_id_and_user_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "chat_id_user_id_unique" ON "chat_members" USING btree ("chat_id","user_id");