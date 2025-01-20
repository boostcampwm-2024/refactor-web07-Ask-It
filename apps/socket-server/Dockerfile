FROM node:18

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpx prisma generate

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start:prod:ws"]