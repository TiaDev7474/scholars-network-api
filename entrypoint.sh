npx prisma migrate deploy --schema=/usr/src/app/src/common/database/schema.prisma
npx prisma generate --schema=/usr/src/app/src/common/database/schema.prisma

# Run database migrations
npx prisma migrate dev --name init --schema=/usr/src/app/src/common/database/schema.prisma

# Run the main container command
exec "$@"
