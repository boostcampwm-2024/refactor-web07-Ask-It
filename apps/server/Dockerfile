FROM node:18

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpx prisma generate && pnpx prisma migrate deploy && pnpm run build && pnpm run start:prod:http"]