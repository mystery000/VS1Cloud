#!/bin/sh

# This script will force stop the meteor app
kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`