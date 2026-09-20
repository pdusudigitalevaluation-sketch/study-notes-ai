# Study Notes AI — All-in-One

Features included in the web app:
- Dashboard, study days, subjects, streak
- Camera/gallery note scanning UI
- AI structured notes API
- Date-wise calendar/history
- Notes library and search
- AI revision interface
- MCQ quiz
- Flashcards
- Exam planner
- Settings
- JSON export
- Local browser storage

## Vercel setup
1. Upload all root files to GitHub.
2. Create an `api` folder and move `analyze.js` into it as `api/analyze.js`.
3. Import the GitHub repo into Vercel.
4. In Vercel Environment Variables add `OPENAI_API_KEY`.
5. Deploy.

The frontend works locally without an API key; AI photo conversion needs the environment variable.
