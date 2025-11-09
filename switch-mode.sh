#!/bin/bash

# Calendar Mode Switcher
# Switches between localStorage and API modes

MODE=$1

if [ -z "$MODE" ]; then
    echo "Usage: ./switch-mode.sh [local|api]"
    echo ""
    echo "Current mode:"
    if [ -f "src/stores/.mode" ]; then
        cat src/stores/.mode
    else
        echo "localStorage (default)"
    fi
    exit 1
fi

case "$MODE" in
    local)
        echo "Switching to LocalStorage mode..."

        # Check if local versions exist
        if [ ! -f "src/stores/calendarStore.svelte.js.local" ]; then
            echo "Creating backup of current stores..."
            cp src/stores/calendarStore.svelte.js src/stores/calendarStore.svelte.js.local
            cp src/stores/calendarsStore.svelte.js src/stores/calendarsStore.svelte.js.local
        fi

        # Switch to local mode
        cp src/stores/calendarStore.svelte.js.local src/stores/calendarStore.svelte.js
        cp src/stores/calendarsStore.svelte.js.local src/stores/calendarsStore.svelte.js

        echo "localStorage" > src/stores/.mode
        echo "✓ Switched to LocalStorage mode"
        echo ""
        echo "You can now run: npm run dev"
        ;;

    api)
        echo "Switching to API mode..."

        # Check if API versions exist
        if [ ! -f "src/stores/calendarStore.svelte.js.api" ]; then
            echo "Error: API store files not found!"
            echo "Make sure calendarStore.svelte.js.api and calendarsStore.svelte.js.api exist"
            exit 1
        fi

        # Backup current if not already backed up
        if [ ! -f "src/stores/calendarStore.svelte.js.local" ]; then
            echo "Creating backup of current stores..."
            cp src/stores/calendarStore.svelte.js src/stores/calendarStore.svelte.js.local
            cp src/stores/calendarsStore.svelte.js src/stores/calendarsStore.svelte.js.local
        fi

        # Switch to API mode
        cp src/stores/calendarStore.svelte.js.api src/stores/calendarStore.svelte.js
        cp src/stores/calendarsStore.svelte.js.api src/stores/calendarsStore.svelte.js

        echo "API" > src/stores/.mode
        echo "✓ Switched to API mode"
        echo ""
        echo "Make sure the backend is running:"
        echo "  cd backend"
        echo "  python main.py"
        echo ""
        echo "Then run: npm run dev"
        ;;

    *)
        echo "Invalid mode: $MODE"
        echo "Usage: ./switch-mode.sh [local|api]"
        exit 1
        ;;
esac
