#!/bin/sh
echo "start server"
read -p "different port?(default:8088)" port;
port=${port:-8088}
echo "your selected port is: $port"
npm run serve --port=$port;
