#!/bin/bash

# Script to create directory structure for Smart Competency Platform

BASE_DIR="smart-competency-platform"

echo "This will create directory structure starting from ./$BASE_DIR"
read -p "Continue? (Y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Aborted"
    exit 1
fi

# Create root directory
mkdir -p $BASE_DIR

# Client structure
mkdir -p $BASE_DIR/client/public
mkdir -p $BASE_DIR/client/src/components/{AIJobMatching,CompetencyDiagnostic,RealTimeAnalytics,SkillsVerification}
mkdir -p $BASE_DIR/client/src/contexts
mkdir -p $BASE_DIR/client/src/pages

# Server structure
mkdir -p $BASE_DIR/server/config
mkdir -p $BASE_DIR/server/controllers
mkdir -p $BASE_DIR/server/models
mkdir -p $BASE_DIR/server/routes

echo "Directory structure created successfully!"
echo "Main directories:"
tree -d $BASE_DIR -L 3