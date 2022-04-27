-- CreateTable
CREATE TABLE "codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "codes_code_key" ON "codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "codes_user_id_key" ON "codes"("user_id");

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
