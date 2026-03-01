FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY chatbot-aibud/package*.json ./

RUN npm ci --omit=dev

# Copy the rest of the app
COPY chatbot-aibud/ .

EXPOSE 3000

CMD ["node", "src/server.js"]
