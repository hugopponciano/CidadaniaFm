# 📻 Rádio Cidadania FM - Site Completo

Site oficial da Rádio Cidadania FM 87.9 com Supabase (PostgreSQL + Auth) e deploy no Vercel.

## 🚀 COMO PUBLICAR O SITE

### Passo 1: Configurar o Supabase

1. Acesse https://supabase.com/dashboard
2. Faça login com sua conta
3. Clique em "SQL Editor" no menu lateral
4. Copie todo o conteúdo do arquivo `supabase-schema.sql`
5. Cole no editor SQL e clique em "Run"
6. Aguarde a criação das tabelas

### Passo 2: Deploy no Vercel

1. Acesse https://vercel.com
2. Faça login (pode usar GitHub, GitLab ou email)
3. Clique em "Add New..." → "Project"
4. Clique em "Import Git Repository"
5. Suba o código para GitHub primeiro (ou use Vercel CLI)

**OU use Vercel CLI (mais rápido):**

```bash
npm i -g vercel
cd /caminho/para/radio-cidadania-supabase
vercel login
vercel --prod
```

### Passo 3: Configurar Variáveis de Ambiente no Vercel

No painel do Vercel:
1. Vá em Settings → Environment Variables
2. Adicione:
   - `VITE_SUPABASE_URL` = `https://ljsanagxenrcxamsgtna.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (sua chave do Supabase)

### Passo 4: Conectar Seu Domínio

1. No Vercel, vá em Settings → Domains
2. Adicione `blogcidadaniafm.blog`
3. Configure o DNS no seu provedor de domínio:

```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME  
Nome: www
Valor: cname.vercel-dns.com
```

### Passo 5: Criar Primeiro Usuário Admin

1. Acesse Supabase Dashboard → Authentication → Users
2. Clique em "Add User"
3. Crie com seu email e senha
4. Acesse `seu-site.vercel.app/login` e faça login

## 📋 O Que Está Funcionando

✅ Página inicial com notícias  
✅ Player de rádio ao vivo no rodapé  
✅ Página de programação  
✅ Formulário de contato  
✅ Login de administrador  
✅ Painel admin para gerenciar notícias  
✅ Design responsivo (mobile + desktop)  
✅ Cores personalizadas (azul + amarelo)

## 🔧 Rodar Localmente (Opcional)

```bash
pnpm install
pnpm dev
```

Acesse: http://localhost:5173

## 📁 Arquivos Importantes

- `supabase-schema.sql` - Script para criar tabelas
- `.env` - Variáveis de ambiente (já configurado)
- `src/lib/supabase.ts` - Conexão com Supabase
- `src/pages/` - Todas as páginas do site

## 🎨 Cores

- Azul: #2563eb
- Amarelo: #facc15

## 📡 Stream

URL: http://play.radios.com.br/11331

## 🆘 Ajuda

Email: contato@cidadaniafm.com.br
