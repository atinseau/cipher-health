-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CLIENT', 'WORKER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROFILE_PENDING', 'TYPED_PROFILE_PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "EncryptionProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userKey" BYTEA NOT NULL,
    "recoveryKey" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EncryptionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressDetails" TEXT,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthName" TEXT,
    "birthPlace" TEXT,
    "gender" "Gender" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "password" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "lastVerificationRequest" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "status" "Status",
    "type" "UserType" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptionProfile_userKey_key" ON "EncryptionProfile"("userKey");

-- CreateIndex
CREATE UNIQUE INDEX "EncryptionProfile_recoveryKey_key" ON "EncryptionProfile"("recoveryKey");

-- CreateIndex
CREATE UNIQUE INDEX "EncryptionProfile_userId_key" ON "EncryptionProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");

-- AddForeignKey
ALTER TABLE "EncryptionProfile" ADD CONSTRAINT "EncryptionProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
