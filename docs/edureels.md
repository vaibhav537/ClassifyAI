# EduReels

EduReels is a campus-scoped short-video learning feed at `/edureels`.

## First release

- Students and teachers can upload a vertical MP4/WebM (3–90 seconds, up to 50 MB) with a title, learning outcome, subject, semester and section.
- A student can submit only for their own semester/section's assigned subjects. The video stays `PENDING` until either a campus assistant or a teacher assigned to that exact subject/semester/section approves it. The reviewer can reject it with feedback.
- Teachers can publish directly, but only for their assigned subject/semester/section.
- The feed contains approved reels from the user's campus. For students, their exact class and subject come first; their other studied subjects follow; remaining campus reels come after. Results are paged within each priority group.
- Campus users can save and report approved reels. Campus assistants can dismiss reports or hide a reel. Authors receive in-app review/removal notifications.
- HOD is represented as a teacher designation, so a HOD with a matching teaching assignment can also review reels.

All EduReels APIs resolve the actor and campus from the server-side session. The client does not supply an author ID, reviewer ID or campus ID.

## Upload and rollout

Run `prisma migrate deploy` and `prisma generate` as part of the regular deployment process. The migration is `20260925143000_add_edureels`.

Use the existing `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` environment variables. ClassifyAI signs a unique, non-overwriting Cloudinary video upload for the authenticated user, uploads the video directly from the browser, then checks the uploaded asset server-side before creating its database record. This keeps video bytes out of the Next.js API request body. If the metadata submission fails after upload, the user can retry the submission with the same asset; abandoned uploads should be cleaned up by an operational job as usage grows.

The campus feed and moderation routes enforce tenant isolation in the database. Uploaded videos currently use standard Cloudinary delivery URLs, so someone with a direct URL can access that media outside the app; campuses requiring strictly private video delivery need signed/authenticated media URLs before enabling the module.

AI-generated reels, automatic captions, comments, quizzes, and advanced media processing are future additions. Educational accuracy should remain subject to human review when AI generation is introduced.
