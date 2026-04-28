Set-Location "c:\Users\Siddhant & Suruchi\OneDrive\Desktop\mock app\server"

# Ensure .env is loaded (manually if needed, but Prisma CLI does it)
# Generate Prisma client with explicit schema path
$prismaCliPath = Resolve-Path "node_modules\prisma\build\index.js"
node $prismaCliPath generate --schema=prisma/schema.prisma

# Push DB schema
node $prismaCliPath db push --accept-data-loss --schema=prisma/schema.prisma

# Start the server
node start.js
