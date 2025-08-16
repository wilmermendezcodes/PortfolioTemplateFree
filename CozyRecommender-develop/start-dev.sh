#!/bin/bash
# Development server startup script that bypasses cartographer plugin issues
export NODE_ENV=development
unset REPL_ID
tsx server/index.ts