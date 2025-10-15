import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { usersTable } from './schemas/users'
import { sessionRelations, sessionsTable } from './schemas/sessions'
import { emailVerificationRelations, emailVerificationsTable } from './schemas/email-verifications'
import { passwordVerificationRelations, passwordVerificationsTable } from './schemas/password-verifications'

import { productsTable } from './schemas/products'

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    usersTable,
    sessionsTable,
    sessionRelations,
    emailVerificationsTable,
    emailVerificationRelations,
    passwordVerificationsTable,
    passwordVerificationRelations,
    productsTable,
  },
})
