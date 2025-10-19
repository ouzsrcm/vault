#!/usr/bin/env bash
set -euo pipefail

############################################
# Vault CLI – One-shot installer
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
#
# Flags:
#   --no-link      : npm link atlama (sadece build)
#   --force        : temiz kurulum (node_modules & dist silinir)
############################################

APP_NAME="vault"
MIN_NODE_MAJOR=18
NO_LINK=false
FORCE=false

# --- tiny helpers ---
cecho() { printf "%b\n" "$1"; }
section() { cecho "\n\033[1;36m==> $1\033[0m"; }
ok() { cecho "\033[1;32m✔\033[0m $1"; }
warn() { cecho "\033[1;33m⚠\033[0m $1"; }
err() { cecho "\033[1;31m✖ $1\033[0m"; }

for arg in "$@"; do
  case "$arg" in
    --no-link) NO_LINK=true ;;
    --force)   FORCE=true ;;
    *) warn "Unknown flag: $arg" ;;
  esac
done

# --- checks ---
section "Environment checks"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js not found. Please install Node ${MIN_NODE_MAJOR}+"
  exit 1
fi
NODE_VER="$(node -v | sed 's/^v//')"
NODE_MAJOR="${NODE_VER%%.*}"
if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
  err "Node.js ${MIN_NODE_MAJOR}+ required (found v${NODE_VER})"
  exit 1
fi
ok "Node.js v${NODE_VER}"

if ! command -v npm >/dev/null 2>&1; then
  err "npm not found. Please install npm (bundled with Node)."
  exit 1
fi
ok "npm $(npm -v)"

# --- optional native build heads-up for better-sqlite3 ---
if grep -q '"better-sqlite3"' package.json 2>/dev/null; then
  case "$(uname -s)" in
    Darwin)
      warn "If you see native build errors on macOS, run: xcode-select --install"
      ;;
    Linux)
      warn "If you see native build errors on Linux, install build tools (e.g. debian/ubuntu: build-essential, python3, make, g++)."
      ;;
    MINGW*|MSYS*|CYGWIN*)
      warn "On Windows, ensure Visual Studio Build Tools + Python installed if prebuilt binary is unavailable."
      ;;
  esac
fi

# --- clean if forced ---
if $FORCE; then
  section "Cleaning previous artifacts (--force)"
  rm -rf node_modules dist
  ok "Removed node_modules and dist"
fi

# --- install deps ---
section "Installing dependencies"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
ok "Dependencies installed"

# --- build ---
section "Building TypeScript (npm run build)"
npm run build
ok "Build complete (dist/)"

# --- ensure data dir exists ---
section "Preparing data folder"
mkdir -p data
ok "data/ ready"

# --- npm link (global CLI) ---
if ! $NO_LINK; then
  section "Linking CLI globally (npm link)"
  npm link
  ok "Linked. You can run: ${APP_NAME}"
else
  warn "Skipped npm link (requested with --no-link)"
fi

# --- smoke test message ---
section "Done!"
cecho "Try:\n  ${APP_NAME} \"echo hello\"\n  ${APP_NAME} show-history\n  ${APP_NAME} pick\n  ${APP_NAME} rerun 1\n"

ok "Installation finished. Happy hacking! 🚀"
