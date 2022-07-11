#!/bin/bash

# This script can be used to build all the tagged version in `dist/x.x.x/`

INITIAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

for TAG in $(git tag --list); do
    echo ""
    echo "Building version $TAG"
    # git switch --detach "$TAG" # for next version of git
    git checkout "$TAG" --quiet # --quiet to skip the warning about detached HEAD
    npm run build
done

echo ""
echo "Build finished, returning to initial branch"
# git switch "$TAG" # for next version of git
git checkout "$INITIAL_BRANCH"
