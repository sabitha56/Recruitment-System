# HireDesk - Recruitment System (Mini Project)

A front-end recruitment website built with HTML, CSS and JavaScript.

## Features
- Browse and search jobs, filter by type
- Recruiters can post and remove jobs
- Candidates apply with name, email, phone, resume and cover note
- Recruiters track applications: Applied, Shortlisted, Interview, Hired, Rejected
- Data is saved in the browser (localStorage), so no server is needed

## Run locally
Open `index.html` in a browser.

## Host on GitHub Pages
1. Create a new repository and upload these files (`index.html`, `style.css`, `app.js`, `README.md`).
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Push from the command line
```bash
git init
git add .
git commit -m "Initial commit: recruitment system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Next steps (for a bigger project)
- Add login for recruiters and candidates
- Move data to a backend (Node.js + MongoDB, or Firebase)
- Upload resumes to real storage
