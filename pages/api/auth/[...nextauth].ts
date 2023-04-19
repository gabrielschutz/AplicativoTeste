import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import prismadb from '@/lib/prismadb'

export default NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        usuarioRecebido: {
          label: 'Usuario',
          type: 'text',
        },
        senhaRecebida: {
          label: 'Senha',
          type: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.usuarioRecebido || !credentials?.senhaRecebida) {
          throw new Error('Usuario e Senha Requeridos');
        }

        const user = await prismadb.user.findUnique({ where: {
          usuarioid: credentials.usuarioRecebido
        }});

        if (!user) {
          throw new Error('Usuario Nao existe');
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth'
  },
  debug: process.env.NODE_ENV == 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET
});