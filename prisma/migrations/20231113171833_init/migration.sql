-- CreateTable
CREATE TABLE "Cluster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "host" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("id")
);
