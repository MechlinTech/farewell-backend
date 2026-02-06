-- AddForeignKey
ALTER TABLE "userLocation" ADD CONSTRAINT "userLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
