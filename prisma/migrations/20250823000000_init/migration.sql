-- Create enums
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "Visibility" AS ENUM ('DRAFT', 'PRIVATE', 'PUBLIC');
CREATE TYPE "TemplateKey" AS ENUM ('CREATIVE', 'MODERN', 'CLASSIC', 'PROFESSIONAL', 'MINIMALIST');

-- Users and auth tables
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP,
  "image" TEXT,
  "passwordHash" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "account_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  CONSTRAINT "session_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- App domain tables
CREATE TABLE "Resume" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "title" JSONB NOT NULL,
  "template" "TemplateKey" NOT NULL DEFAULT 'MODERN',
  "theme" JSONB NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'en',
  "visibility" "Visibility" NOT NULL DEFAULT 'DRAFT',
  "watermark" BOOLEAN NOT NULL DEFAULT TRUE,
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "resume_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Section" (
  "id" TEXT PRIMARY KEY,
  "resumeId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  CONSTRAINT "section_resume_fk" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE
);

CREATE TABLE "Entry" (
  "id" TEXT PRIMARY KEY,
  "sectionId" TEXT NOT NULL,
  "title" JSONB,
  "subtitle" JSONB,
  "body" JSONB,
  "meta" JSONB,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "ongoing" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "entry_section_fk" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE
);

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "plan" "Plan" NOT NULL DEFAULT 'FREE',
  "provider" TEXT,
  "providerRef" TEXT,
  "status" TEXT NOT NULL DEFAULT 'inactive',
  "currentPeriodEnd" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "sub_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "payment_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entity" TEXT,
  "entityId" TEXT,
  "ip" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
