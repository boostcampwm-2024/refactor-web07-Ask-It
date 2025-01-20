FROM node:18

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "pnpx prisma generate && pnpm run build && pnpm run start:prod:ws"]