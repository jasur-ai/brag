#!/usr/bin/env bash
# Push this site's source to the requested repository using YOUR Git credentials.
# No tokens are bundled. Existing history is preserved; force-push is never used.
set -euo pipefail

REPO='https://github.com/jasur-ai/brag.git'
SOURCE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

command -v git >/dev/null 2>&1 || { printf '\nGit o‘rnatilmagan. Avval Git o‘rnating.\n'; exit 1; }
command -v tar >/dev/null 2>&1 || { printf '\nBu skript uchun tar kerak. Windows’da Git Bash orqali ishga tushiring.\n'; exit 1; }
if [[ ! -f "$SOURCE/index.html" || ! -d "$SOURCE/assets" ]]; then
  printf '\nZIP’ni to‘liq oching, keyin shu papkadan skriptni ishga tushiring.\n'; exit 1
fi

WORK="$(mktemp -d "${TMPDIR:-/tmp}/brag-push.XXXXXX")"
DEST="$WORK/repository"
trap 'status=$?; if [[ $status -ne 0 ]]; then printf "\nPush tugamadi. Ishchi nusxa shu yerda saqlangan: %s\nGit autentifikatsiyasi va repo ruxsatlarini tekshiring.\n" "$WORK"; fi' EXIT

printf '\nO‘zbekistonga maktub → %s\n' "$REPO"
printf 'Repo tarixi saqlanadi. Force-push ishlatilmaydi.\n\n'
git clone "$REPO" "$DEST"

# Keep the existing default branch if the repository is populated.
if git -C "$DEST" rev-parse --verify HEAD >/dev/null 2>&1; then
  BRANCH="$(git -C "$DEST" symbolic-ref --short HEAD)"
else
  # Some empty/older hosts leave remote HEAD unset even after a first push.
  REMOTE_BRANCH="$(git -C "$DEST" for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v '^origin/HEAD$' | head -n 1 || true)"
  if git -C "$DEST" show-ref --verify --quiet refs/remotes/origin/main; then
    BRANCH=main
    git -C "$DEST" checkout -B "$BRANCH" origin/main
  elif [[ -n "$REMOTE_BRANCH" ]]; then
    BRANCH="${REMOTE_BRANCH#origin/}"
    git -C "$DEST" checkout -B "$BRANCH" "$REMOTE_BRANCH"
  else
    git -C "$DEST" checkout -B main
    BRANCH=main
  fi
fi

FILES=(index.html style.css app.js server.cjs package.json vercel.json README.md START-HERE.md push-to-github.sh .gitignore assets)
(
  cd "$SOURCE"
  tar --exclude='assets/fonts-google.css' -cf - "${FILES[@]}"
) | (cd "$DEST" && tar -xf -)

git -C "$DEST" add -- "${FILES[@]}"
if git -C "$DEST" diff --cached --quiet && git -C "$DEST" rev-parse --verify HEAD >/dev/null 2>&1; then
  printf '\nRepo allaqachon shu fayllar bilan bir xil. Yangi commit kerak emas.\n'
else
  if ! git -C "$DEST" var GIT_AUTHOR_IDENT >/dev/null 2>&1; then
    printf '\nGit ismingiz/emailingiz sozlanmagan. O‘zingizga tegishli qiymatlar bilan sozlang:\n'
    printf '  git config --global user.name "Ismingiz"\n'
    printf '  git config --global user.email "GitHub emailingiz"\n'
    printf '\nKeyin skriptni qayta ishga tushiring.\n'
    exit 1
  fi
  git -C "$DEST" commit -m 'Build Uzbekistan interactive editorial website'
fi

git -C "$DEST" push -u origin "$BRANCH"
printf '\nTAYYOR: kod GitHub’ga push qilindi.\n'
printf 'Repo: https://github.com/jasur-ai/brag\n'
printf 'Branch: %s\nIshchi Git nusxa: %s\n' "$BRANCH" "$DEST"
printf '\nVercel: Framework Other / Build command bo‘sh / Output directory .\n'
printf 'Vercel’ga avtomatik deploy faqat repo Vercel loyihasiga ulangandan keyin ishlaydi.\n'
