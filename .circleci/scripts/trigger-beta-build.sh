#!/usr/bin/env bash

set -e
set -u
set -o pipefail

# => Version-v10.24.1
version="${CIRCLE_BRANCH/Version-v/}"
current_commit_msg=$(git show -s --format='%s' HEAD)
printf '%s\n' "Creating the prod beta build for $version under $current_commit_msg"

yarn build --build-type beta prod

exit 0
