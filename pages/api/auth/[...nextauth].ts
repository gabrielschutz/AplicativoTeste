import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from '@/lib/prismadb'
import { useCallback, useState } from "react";
import axios from 'axios';

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
          throw new Error("Usuario e Senha Requeridos");
        }

        try {
          const response = await axios.post("/api/login", {
            usuario: credentials.usuario,
            senha: credentials.senha,
          });

          if (!response.data) {
            throw new Error("Usuario/senha incorretos");
          }

          return {
            email: response.data.username,
            name: response.data.nome,
          } as User;
        } catch (error) {
          throw new Error("Falha na autenticação");
        }
      },
    }),
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
})