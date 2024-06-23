-- CreateTable
CREATE TABLE "Connection" (
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userId_friendId_key" ON "Connection"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
