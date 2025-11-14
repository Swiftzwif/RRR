#!/usr/bin/env bash

# Git Worktree Management Script
# Provides convenient commands for managing git worktrees in this repository

set -euo pipefail

WORKTREE_DIR="/home/locker/Projects/RRR-worktrees"
MAIN_REPO="/home/locker/Projects/RRR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

usage() {
    cat <<EOF
Git Worktree Management Script

Usage: ./worktree.sh <command> [options]

Commands:
    list, ls              List all worktrees
    create <name>         Create new worktree for existing branch
    new <name>            Create new worktree with new branch
    remove <name>         Remove worktree
    clean                 Remove all worktrees for merged branches
    goto <name>           Print cd command to navigate to worktree
    status               Show status of all worktrees
    sync                 Update all worktrees from remote

Examples:
    ./worktree.sh list
    ./worktree.sh new feature/add-analytics
    ./worktree.sh create refactor/typescript-api-routes
    ./worktree.sh remove pr-43-api-routes
    ./worktree.sh goto develop

EOF
}

list_worktrees() {
    echo -e "${BLUE}=== Current Worktrees ===${NC}"
    git -C "$MAIN_REPO" worktree list
}

create_worktree() {
    local branch_name=$1
    local dir_name=${branch_name//\//-}  # Replace / with -

    echo -e "${BLUE}Creating worktree for existing branch: ${branch_name}${NC}"
    git -C "$MAIN_REPO" worktree add "${WORKTREE_DIR}/${dir_name}" "${branch_name}"
    echo -e "${GREEN}✓ Worktree created at: ${WORKTREE_DIR}/${dir_name}${NC}"
    echo -e "${YELLOW}Navigate with: cd ${WORKTREE_DIR}/${dir_name}${NC}"
}

new_worktree() {
    local branch_name=$1
    local dir_name=${branch_name//\//-}  # Replace / with -

    echo -e "${BLUE}Creating new worktree with new branch: ${branch_name}${NC}"
    git -C "$MAIN_REPO" worktree add -b "${branch_name}" "${WORKTREE_DIR}/${dir_name}"
    echo -e "${GREEN}✓ Worktree created at: ${WORKTREE_DIR}/${dir_name}${NC}"
    echo -e "${YELLOW}Navigate with: cd ${WORKTREE_DIR}/${dir_name}${NC}"
}

remove_worktree() {
    local dir_name=$1

    if [ -d "${WORKTREE_DIR}/${dir_name}" ]; then
        echo -e "${BLUE}Removing worktree: ${dir_name}${NC}"
        git -C "$MAIN_REPO" worktree remove "${WORKTREE_DIR}/${dir_name}"
        echo -e "${GREEN}✓ Worktree removed${NC}"
    else
        echo -e "${RED}Error: Worktree not found: ${dir_name}${NC}"
        echo "Available worktrees:"
        ls -1 "$WORKTREE_DIR" 2>/dev/null || echo "  (none)"
        exit 1
    fi
}

clean_merged() {
    echo -e "${BLUE}Finding worktrees for merged branches...${NC}"

    # Update remote info
    git -C "$MAIN_REPO" fetch origin --prune

    # Get merged branches
    merged_branches=$(git -C "$MAIN_REPO" branch -r --merged origin/master | grep -v 'HEAD\|master\|main' | sed 's/origin\///' | xargs)

    if [ -z "$merged_branches" ]; then
        echo -e "${GREEN}No merged branches found${NC}"
        return
    fi

    echo "Merged branches: $merged_branches"

    for branch in $merged_branches; do
        dir_name=${branch//\//-}
        if [ -d "${WORKTREE_DIR}/${dir_name}" ]; then
            echo -e "${YELLOW}Removing worktree for merged branch: ${branch}${NC}"
            git -C "$MAIN_REPO" worktree remove "${WORKTREE_DIR}/${dir_name}" || true
        fi
    done

    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

goto_worktree() {
    local dir_name=$1

    if [ -d "${WORKTREE_DIR}/${dir_name}" ]; then
        echo "cd ${WORKTREE_DIR}/${dir_name}"
    else
        echo -e "${RED}Error: Worktree not found: ${dir_name}${NC}" >&2
        echo "Available worktrees:" >&2
        ls -1 "$WORKTREE_DIR" 2>/dev/null || echo "  (none)" >&2
        exit 1
    fi
}

status_all() {
    echo -e "${BLUE}=== Worktree Status ===${NC}"

    for worktree_path in "${WORKTREE_DIR}"/*; do
        if [ -d "$worktree_path" ]; then
            dir_name=$(basename "$worktree_path")
            echo -e "\n${GREEN}${dir_name}:${NC}"
            git -C "$worktree_path" status -sb
        fi
    done
}

sync_all() {
    echo -e "${BLUE}Syncing all worktrees from remote...${NC}"

    # Update main repo
    echo -e "${YELLOW}Updating main repo...${NC}"
    git -C "$MAIN_REPO" fetch origin
    git -C "$MAIN_REPO" pull origin master

    # Update each worktree
    for worktree_path in "${WORKTREE_DIR}"/*; do
        if [ -d "$worktree_path" ]; then
            dir_name=$(basename "$worktree_path")
            echo -e "${YELLOW}Updating ${dir_name}...${NC}"

            # Get the branch name for this worktree
            branch=$(git -C "$worktree_path" branch --show-current)

            if [ -n "$branch" ]; then
                git -C "$worktree_path" pull origin "$branch" || echo "  (no remote branch)"
            fi
        fi
    done

    echo -e "${GREEN}✓ Sync complete${NC}"
}

# Main command dispatcher
case "${1:-}" in
    list|ls)
        list_worktrees
        ;;
    create)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Branch name required${NC}"
            usage
            exit 1
        fi
        create_worktree "$2"
        ;;
    new)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Branch name required${NC}"
            usage
            exit 1
        fi
        new_worktree "$2"
        ;;
    remove|rm)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Worktree directory name required${NC}"
            usage
            exit 1
        fi
        remove_worktree "$2"
        ;;
    clean)
        clean_merged
        ;;
    goto|cd)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Worktree directory name required${NC}"
            usage
            exit 1
        fi
        goto_worktree "$2"
        ;;
    status)
        status_all
        ;;
    sync)
        sync_all
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command${NC}"
        usage
        exit 1
        ;;
esac
