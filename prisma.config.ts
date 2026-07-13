import path from 'node:path'
import { defineConfig } from 'prisma/config'

// The Prisma CLI only auto-loads `.env`, never `.env.local` — and defining this
// config file switches that auto-loading off entirely. Next.js reads `.env.local`
// on its own, so load it here to keep both halves on the same credentials.
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(path.join(process.cwd(), file))
  } catch {
    // Absent file: the other one (or a real env var) is expected to supply the URLs.
  }
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
