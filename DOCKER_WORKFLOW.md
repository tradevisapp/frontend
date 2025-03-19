# Docker Workflow for TradeVis Frontend

This document explains how the GitHub Actions workflow automatically builds and publishes the TradeVis frontend to Docker Hub.

## Workflow Overview

When code is pushed to the main or master branch, GitHub Actions will:
1. Build the React application
2. Create a Docker image
3. Push the image to Docker Hub as `roeilevinson/tradevis-frontend:latest`

## Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

1. `DOCKERHUB_USERNAME`: Your Docker Hub username
2. `DOCKERHUB_TOKEN`: A Docker Hub access token (not your password)

### Setting up Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to Account Settings → Security
3. Click "New Access Token"
4. Give it a name (e.g., "GitHub Actions")
5. Copy the token (you'll only see it once)

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add both DOCKERHUB_USERNAME and DOCKERHUB_TOKEN with their values

## Manual Deployment

To manually trigger the workflow:
1. Go to Actions tab in your GitHub repository
2. Select "Build and Publish Docker Image" workflow
3. Click "Run workflow"

## Local Docker Build

To build and test the image locally:

```bash
# Build the image
docker build -t roeilevinson/tradevis-frontend:latest .

# Run the container
docker run -p 80:80 roeilevinson/tradevis-frontend:latest

# Push to Docker Hub (after login)
docker push roeilevinson/tradevis-frontend:latest
``` 