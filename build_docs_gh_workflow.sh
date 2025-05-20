#!/bin/bash
cd ./docs/
npm install -g vitepress
    bunx vitepress build
    cd ..
    cp -R ./docs/.vitepress/dist/ ./public/docs/
    echo "Done :)"
    exit 1
