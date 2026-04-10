FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the frontend
COPY . .
RUN npm run build

# Serve the static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a fallback configuration for React Router
RUN echo 'server { \
    listen 5173; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
