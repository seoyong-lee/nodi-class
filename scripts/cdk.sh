#!/usr/bin/env bash
# Forward to infra CDK. pnpm run inserts a literal "--" before user args;
# CDK then treats -c as app args and requireDomain fails. Strip all "--".
set -euo pipefail
cd "$(dirname "$0")/../infra"
args=()
for a in "$@"; do
  [[ "$a" == "--" ]] && continue
  args+=("$a")
done
exec pnpm exec cdk "${args[@]}"
