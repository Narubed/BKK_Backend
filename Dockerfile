FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build
RUN npx prisma generate
# ----------------------
FROM node:20-alpine AS runner
WORKDIR /app

# คัดลอกเฉพาะโค้ดที่คอมไพล์แล้วจาก Builder Stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3002

CMD ["npm", "run", "start"]
