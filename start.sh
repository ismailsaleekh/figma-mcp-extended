#!/bin/sh
lsof -ti:3055 | xargs kill -9 2>/dev/null
exec "$HOME/.bun/bin/bun" socket.ts
