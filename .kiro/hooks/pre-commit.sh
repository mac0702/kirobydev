#!/bin/bash

# SWIFT.HAUNT Pre-commit Hook
# Validates SWIFT parser before allowing commits

echo "🏦 Running SWIFT.HAUNT pre-commit checks..."

# Check if parser tests exist
if [ ! -f "__tests__/swift-parser.test.ts" ]; then
    echo "⚠️  Warning: No parser tests found"
fi

# Run TypeScript type checking
echo "📝 Checking TypeScript types..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Fix them before committing."
    exit 1
fi

# Run ESLint
echo "🔍 Running ESLint..."
npx eslint . --ext .ts,.tsx
if [ $? -ne 0 ]; then
    echo "⚠️  ESLint warnings found. Consider fixing them."
fi

# Verify .kiro directory is not gitignored
if grep -q "\.kiro" .gitignore 2>/dev/null; then
    echo "❌ ERROR: .kiro directory is in .gitignore!"
    echo "This will disqualify your Kiroween submission."
    echo "Remove .kiro from .gitignore"
    exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
