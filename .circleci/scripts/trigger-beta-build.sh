#!/usr/bin/env bash

set -e
set -u
set -o pipefail

# => Version-v10.24.1
version="${CIRCLE_BRANCH/Version-v/}"
current_commit_msg=$(git show -s --format='%s' HEAD)

if [[ $current_commit_msg =~ Version[-[:space:]](v[[:digit:]]+.[[:digit:]]+.[[:digit:]]+[-]beta.[[:digit:]]) ]]
then
    yarn build --build-type beta prod
    printf '%s\n' "Creating the prod beta build for $version with beta version $current_commit_msg"

else
  # filter the commit message like Version v10.24.1-beta.1
    printf '%s\n' 'Commit message does not match commit message for beta pattern; skipping beta automation build'
    exit 0
fi

exit 0
