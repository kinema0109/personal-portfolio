# CV asset slot

Put the real CV PDF in this folder with this exact name:

    hoang-cong-tho-cv.pdf

The path is configured in `src/content/site.ts` (`cv.file`).
At runtime the app checks that the file exists and is a PDF.
If it doesn't find one, it shows "CV not added yet" instead of a broken link.

The PDF is git-ignored on the owner's instruction: it carries personal contact details, so it is
kept locally and never deployed. The CV summary in the panel comes from `src/content/cv.ts` and is
unaffected. To publish a PDF later, drop it here and remove the `public/cv/*.pdf` line from
`.gitignore`.
