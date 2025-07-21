#!/bin/bash

echo "Fixing button type issues for production..."

# Find all TypeScript/TSX files and fix button elements that don't have type attributes
find src -name "*.tsx" -type f -exec sed -i 's/<button\([^>]*\)className=\([^>]*\)>/<button type="button"\1className=\2>/g' {} \;

# Fix buttons that already have other attributes but no type
find src -name "*.tsx" -type f -exec sed -i 's/<button\([^>]*\)onClick=\([^>]*\)>/<button type="button"\1onClick=\2>/g' {} \;

# Fix form submit buttons specifically
find src -name "*.tsx" -type f -exec sed -i 's/type="button" type="submit"/type="submit"/g' {} \;
find src -name "*.tsx" -type f -exec sed -i 's/type="button".*onSubmit=/type="submit" onSubmit=/g' {} \;

echo "Button type fixes applied!"
