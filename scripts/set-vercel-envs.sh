#!/usr/bin/env bash
# Sets Vercel env vars across all three projects.
# Run from the repo root: bash scripts/set-vercel-envs.sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Root: $ROOT"

add() {
  local key="$1" val="$2" env="$3" cwd="$4"
  echo "  → $key=$val ($env)"
  printf '%s' "$val" | vercel env add "$key" "$env" --cwd "$cwd" 2>&1 | grep -v "^$" || true
}

# ─── agent-forge-web ──────────────────────────────────────────────────────────
echo ""
echo "=== agent-forge-web ==="

for ENV in preview production; do
  case $ENV in
    preview)    URL="https://preview.mindrithm.app"; APP_ENV="staging" ;;
    production) URL="https://mindrithm.app";         APP_ENV="production" ;;
  esac
  echo "[$ENV] $URL"
  add NEXT_PUBLIC_APP_URL  "$URL"     "$ENV" "$ROOT"
  add NEXT_PUBLIC_APP_ENV  "$APP_ENV" "$ENV" "$ROOT"
  add NEXT_PUBLIC_BRAND    "mindrithm" "$ENV" "$ROOT"
done

# ─── agent-forge-web-launchops ────────────────────────────────────────────────
echo ""
echo "=== agent-forge-web-launchops ==="
LAUNCHOPS="$ROOT/apps/launchops"

for ENV in preview production; do
  case $ENV in
    preview)    URL="https://preview.launchops.ai"; APP_ENV="staging" ;;
    production) URL="https://launchops.ai";         APP_ENV="production" ;;
  esac
  echo "[$ENV] $URL"
  add NEXT_PUBLIC_APP_URL  "$URL"       "$ENV" "$LAUNCHOPS"
  add NEXT_PUBLIC_APP_ENV  "$APP_ENV"   "$ENV" "$LAUNCHOPS"
  add NEXT_PUBLIC_BRAND    "launchops"  "$ENV" "$LAUNCHOPS"
done

# ─── ploutos-blue-stone ───────────────────────────────────────────────────────
echo ""
echo "=== ploutos-blue-stone ==="
BLUESTONE="$ROOT/apps/ploutos/clients/blue-stone-construction"

declare -A BS_ENVS=(
  [development]="https://dev.bluestoneconstruction.llc:development"
  [preview]="https://qa.bluestoneconstruction.llc:qa"
  [production]="https://bluestoneconstruction.llc:production"
)

for ENV in development preview production; do
  IFS=':' read -r URL APP_ENV <<< "${BS_ENVS[$ENV]}"
  echo "[$ENV] $URL"
  add NEXT_PUBLIC_APP_URL  "$URL"                      "$ENV" "$BLUESTONE"
  add NEXT_PUBLIC_APP_ENV  "$APP_ENV"                  "$ENV" "$BLUESTONE"
  add NEXT_PUBLIC_BRAND    "blue-stone-construction"   "$ENV" "$BLUESTONE"
done

echo ""
echo "Done. Secrets (NEXT_PUBLIC_PHONE, RESEND_API_KEY) need to be set manually in Vercel dashboard for ploutos-blue-stone."
