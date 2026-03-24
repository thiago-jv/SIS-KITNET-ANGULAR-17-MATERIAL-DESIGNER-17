
# Build Angular
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production --project sis-kitnet

# Servir com Nginx
FROM nginx:alpine

COPY --from=builder /app/dist/sis-kitnet/browser /usr/share/nginx/html

# Copia a configuração customizada do Nginx para suportar rotas SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]