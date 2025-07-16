-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "resource" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "insurance" TEXT;

-- AlterTable
ALTER TABLE "PatientUser" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "PracticeSettings" ADD COLUMN     "allowOnlineBooking" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PracticeUser" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;
