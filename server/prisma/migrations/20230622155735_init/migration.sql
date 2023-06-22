/*
  Warnings:

  - Added the required column `pid` to the `mqtt_servers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mqtt_servers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pid" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_mqtt_servers" ("client_id", "created_at", "host", "id", "password", "topic", "updated_at", "username") SELECT "client_id", "created_at", "host", "id", "password", "topic", "updated_at", "username" FROM "mqtt_servers";
DROP TABLE "mqtt_servers";
ALTER TABLE "new_mqtt_servers" RENAME TO "mqtt_servers";
CREATE UNIQUE INDEX "mqtt_servers_pid_key" ON "mqtt_servers"("pid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "types_index_key" ON "types"("index");
