-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partId" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "transcript" TEXT,
    "options" TEXT NOT NULL,
    "correctOpt" TEXT NOT NULL,
    "explanation" TEXT,
    CONSTRAINT "Question_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("audioUrl", "content", "correctOpt", "explanation", "id", "imageUrl", "options", "partId", "transcript") SELECT "audioUrl", "content", "correctOpt", "explanation", "id", "imageUrl", "options", "partId", "transcript" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_TestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" INTEGER,
    "durationTaken" INTEGER NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" TEXT NOT NULL,
    CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TestSession_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestSession" ("answers", "durationTaken", "id", "score", "submittedAt", "testId", "userId") SELECT "answers", "durationTaken", "id", "score", "submittedAt", "testId", "userId" FROM "TestSession";
DROP TABLE "TestSession";
ALTER TABLE "new_TestSession" RENAME TO "TestSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
