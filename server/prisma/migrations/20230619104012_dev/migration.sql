-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "device_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tags_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tags" ("created_at", "device_id", "id", "updated_at", "value") SELECT "created_at", "device_id", "id", "updated_at", "value" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_device_id_value_key" ON "tags"("device_id", "value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
