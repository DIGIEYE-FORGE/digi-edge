/*
  Warnings:

  - You are about to drop the column `black_listed` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `is_decoded` on the `devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serial]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credential_id]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "device_profiles" DROP CONSTRAINT "device_profiles_device_type_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_device_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_group_id_fkey";

-- DropIndex
DROP INDEX "devices_name_key";

-- DropIndex
DROP INDEX "groups_name_key";

-- AlterTable
ALTER TABLE "device_profiles" ADD COLUMN     "cridentials_type" TEXT,
ADD COLUMN     "decoder_id" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "protocol_id" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "device_type_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "device_types" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "black_listed",
DROP COLUMN "is_decoded",
ADD COLUMN     "blacklisted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "credential_id" INTEGER,
ADD COLUMN     "is_decoder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mqtt_server_id" INTEGER,
ADD COLUMN     "serial" TEXT NOT NULL,
ADD COLUMN     "virtual_device_id" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "group_id" DROP NOT NULL,
ALTER COLUMN "device_profile_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "mqtt_server_id" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "last_telemetries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "last_telemetries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "is_token" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_devices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "group_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "virtual_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_profile_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "device_profile_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_profile_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocols" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decoders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fnc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decoders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mqtt_servers" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mqtt_servers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attributes_device_id_name_key" ON "attributes"("device_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "last_telemetries_device_id_name_key" ON "last_telemetries"("device_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_device_id_value_key" ON "tags"("device_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_username_key" ON "credentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "virtual_devices_serial_key" ON "virtual_devices"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "device_profile_attributes_device_profile_id_name_key" ON "device_profile_attributes"("device_profile_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "protocols_name_key" ON "protocols"("name");

-- CreateIndex
CREATE UNIQUE INDEX "decoders_name_key" ON "decoders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "devices_serial_key" ON "devices"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "devices_credential_id_key" ON "devices"("credential_id");

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "last_telemetries" ADD CONSTRAINT "last_telemetries_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_credential_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "credentials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_virtual_device_id_fkey" FOREIGN KEY ("virtual_device_id") REFERENCES "virtual_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_device_profile_id_fkey" FOREIGN KEY ("device_profile_id") REFERENCES "device_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_mqtt_server_id_fkey" FOREIGN KEY ("mqtt_server_id") REFERENCES "mqtt_servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virtual_devices" ADD CONSTRAINT "virtual_devices_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_mqtt_server_id_fkey" FOREIGN KEY ("mqtt_server_id") REFERENCES "mqtt_servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_profile_attributes" ADD CONSTRAINT "device_profile_attributes_device_profile_id_fkey" FOREIGN KEY ("device_profile_id") REFERENCES "device_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_profiles" ADD CONSTRAINT "device_profiles_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_profiles" ADD CONSTRAINT "device_profiles_protocol_id_fkey" FOREIGN KEY ("protocol_id") REFERENCES "protocols"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_profiles" ADD CONSTRAINT "device_profiles_decoder_id_fkey" FOREIGN KEY ("decoder_id") REFERENCES "decoders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
