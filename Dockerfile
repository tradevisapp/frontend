FROM node:18-alpine AS build

# Add build argument for warnings
ARG WARNINGS_ENABLED=false

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# If WARNINGS_ENABLED is true, set environment variable to enable warnings
ENV REACT_APP_ENABLE_WARNINGS=${WARNINGS_ENABLED}

RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 