import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials'
import prismadb from '@/lib/prismadb'

export default NextAuth = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        usuario: {
          label: 'Usuario',
          type: 'text',
        },
        senha: {
          label: 'Senha',
          type: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.senha) {
          throw new Error('Usuario e Senha Requeridos');
        }

        const user = await prismadb.user.findUnique({ where: {
          usuarioid: credentials.usuario
        }});

        if (!user || !user.senha) {
          throw new Error('Usuario nao existente');
        }

        function comparePasswords(password1: string, password2: string): boolean {
          return password1 === password2;
        }

        if (!(comparePasswords(credentials.senha, user.senha))) {
          throw new Error('Senha incorreta');
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
};
