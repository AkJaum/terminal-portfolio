#!/bin/bash

# Simple rsync transfer to remote SSH host
rsync -avz \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '__pycache__' \
  -e ssh \
  /home/akjaum/Documents/Projetos/terminafolio/Next/terminal-app/ \
  lenovo@192.168.0.23:/home/lenovo/terminal-app/

echo "Transfer complete!"
