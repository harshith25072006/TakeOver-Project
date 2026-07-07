-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'ONLINE', 'SPLIT');
ALTER TABLE "public"."Payment" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
ALTER TABLE "Payment" ALTER COLUMN "method" SET DEFAULT 'CASH';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cashAmount" INTEGER,
ADD COLUMN     "onlineAmount" INTEGER,
ADD COLUMN     "recordedById" TEXT;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "logoKey" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "propertyId" TEXT;

-- CreateIndex
CREATE INDEX "User_propertyId_idx" ON "User"("propertyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

