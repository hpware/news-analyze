#!/bin/bash

ask_yes_no() {
    while true; do
        read -p "$1 (y/n): " answer
        case ${answer:0:1} in
            y|Y ) return 0 ;;
            n|N ) return 1 ;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

if ask_yes_no "Are you ABSOLUTELY in the root dir of the app?"; then
    echo "Proceeding with build..."
    cd ./docs/
    if ask_yes_no "Have you installed vitepress before?"; then
        echo "Skipping"
    else
        echo "Installing vitepress with bun..."
        bun add -D vitepress
    fi
    bunx vitepress build
    cd ..
    cp -R ./docs/.vitepress/dist/ ./public/docs/
    echo "Done :)"
    exit 1
else
    echo "Please navigate to the root directory and try again."
    exit 1
fi
