#!/bin/bash

# Function to commit with message
c() {
    git add $1
    git commit -m "$2" || echo "Nothing to commit for $1"
}

echo "Starting commit process..."

# 1. Configs (3 commits)
c ".gitignore" "Add gitignore configuration"
c "README.md" "Add README documentation"
c "package.json package-lock.json tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs eslint.config.mjs" "Add project configuration and dependencies"

# 2. Docs (1 commit)
c "failedstartupdocs.md startpuideas.md" "Add project documentation and ideas"

# 3. App Core (2 commits)
c "src/app/globals.css" "Add global styling"
c "src/app/layout.tsx src/app/page.tsx src/app/favicon.ico" "Add application layout and dashboard"

# 4. API (1 commit)
c "src/app/api/analyze/route.ts" "Add analysis API endpoint"

# 5. Libs (2 commits)
c "src/lib/store.ts" "Add state management store"
c "src/lib/supabase.ts src/lib/prompts.ts" "Add Supabase client and AI prompts"

# 6. Components (4 commits)
c "src/components/index.ts src/components/Logo.tsx src/components/Navbar.tsx src/components/Sidebar.tsx" "Add shared UI and navigation components"
c "src/components/ChatInput.tsx src/components/ChatMessage.tsx src/components/ChatView.tsx" "Add chat interface module"
c "src/components/StartupCard.tsx" "Add startup card component"
c "src/components/CollaborateView.tsx src/components/GraveyardView.tsx src/components/IdeasView.tsx" "Add application views"

# 7. Assets (1 commit)
git add public/
git commit -m "Add public static assets" || echo "Nothing to commit for public assets"

# 8. Misc (1 commit)
git add .
git commit -m "Add remaining project files" || echo "Nothing remaining to commit"

echo "Commits completed."

# Push
current_branch=$(git branch --show-current)
echo "Pushing to origin $current_branch..."
git push origin $current_branch
