#!/bin/sh

APP_PORT="4000"
APP_URI="http://localhost:$APP_PORT"

echo "Launching app on $APP_URI"
python3 -m webbrowser $APP_URI

#set NODE_TLS_REJECT_UNAUTHORIZED=0
TOOL_NODE_FLAGS=--max-old-space-size=8192 NODE_TLS_REJECT_UNAUTHORIZED=0 meteor --port $APP_PORT

