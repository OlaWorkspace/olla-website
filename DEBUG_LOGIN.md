# Debug Login — Guide Pas à Pas

Tu n'arrives pas à te connecter? Voici comment déboguer étape par étape.

## 🚀 Démarrage rapide

```bash
# 1. Démarrer le serveur
pnpm dev

# 2. Ouvrir la page de debug
http://localhost:3000/debug

# 3. Tester les boutons un par un
```

## 📋 Tests (dans cet ordre)

### Test 1️⃣: Test Connection

Clique le bouton **"Test Connection"**

**Vous devriez voir:**
```
🧪 Testing Supabase connection...

1️⃣ Environment variables:
   URL: https://xxxxx.supabase.co
   Anon Key: ✅ SET

2️⃣ Checking current session:
   ℹ️ No session (not logged in)
```

**Si vous voyez:**
- `❌ NEXT_PUBLIC_SUPABASE_URL not set` → Configurez `.env.local`
- `Anon Key: ❌ NOT SET` → Remplissez `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Test 2️⃣: Test Sign In

1. **Configurez les credentials** (email/password inputs)
2. Clique **"Test Sign In"**

**Vous devriez voir:**
```
🔐 Testing sign in with: test@example.com

Calling supabase.auth.signInWithPassword()...

📦 Response:
✅ SUCCESS
   User: test@example.com
   Token: eyJhbGciOi...
   Expires: ...

🍪 Checking cookies:
   sb-xxxxx-auth-token=...
   sb-xxxxx-auth-refresh-token=...
```

**Si vous voyez une erreur:**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Invalid login credentials` | Email/password incorrect | Vérifiez les credentials dans Supabase |
| `Invalid email` | Email format incorrect | Vérifiez l'adresse email |
| `User not found` | L'utilisateur n'existe pas | Créez l'utilisateur dans Supabase |
| `Request failed` | Supabase URL incorrect | Vérifiez `NEXT_PUBLIC_SUPABASE_URL` |

### Test 3️⃣: Test Server Session

Clique **"Test Server Session"**

Cela test si le serveur peut lire la session des cookies.

**Vous devriez voir:**
```
Server Response:
{
  "success": true,
  "hasSession": true,
  "sessionUser": "test@example.com",
  "userId": "xxxxx-xxxxx-xxxxx",
  "expiresAt": 1234567890
}
```

**Si vous voyez `hasSession: false`:**
- Les cookies ne sont pas envoyés au serveur
- Essayez "Clear Cookies" puis "Test Sign In" à nouveau

### Test 4️⃣: Clear Cookies

Clique **"Clear Cookies"** pour supprimer tous les cookies.

## 🔍 Guide de Dépannage Complet

### Problème: "Email ou mot de passe incorrect"

**Étape 1: Vérifier l'utilisateur existe**
1. Allez [supabase.com](https://supabase.com)
2. Dashboard > **Authentication** > **Users**
3. Cherchez l'email que vous testez
4. Si absent → **Inviter l'utilisateur** ou **Créer un utilisateur**

**Étape 2: Tester dans le debug**
1. Allez `/debug`
2. Clique "Test Connection" → Vérifiez que URL + Key sont SET
3. Clique "Test Sign In" avec le même email/password
4. Vérifiez le message d'erreur exact

### Problème: Les cookies ne sont pas créés

**Étape 1: Vérifier le domaine**
- Le domaine doit être `localhost:3000`
- Les cookies doivent avoir `SameSite=Lax` ou `None`

**Étape 2: Vérifier dans DevTools**
1. Ouvrez F12 > **Application**
2. **Cookies** > **http://localhost:3000**
3. Cherchez `sb-` cookies
4. Si absent → Sign In a échoué

**Étape 3: Vérifier Supabase settings**
1. Dashboard > **Authentication** > **URL Configuration**
2. Vérifiez `http://localhost:3000` est dans les redirect URLs
3. Sinon, ajoutez-le et save

### Problème: /pro ne se charge pas après login

**Étape 1: Vérifier la session côté client**
1. Allez `/debug`
2. Clique "Test Sign In" → Doit afficher "✅ SUCCESS"
3. Cherchez les cookies dans "🍪 Checking cookies"

**Étape 2: Vérifier la session côté serveur**
1. Allez `/debug`
2. Clique "Test Server Session"
3. Doit afficher `"hasSession": true`
4. Si `false` → Les cookies n'arrivent pas au serveur

**Étape 3: Tester l'accès à /pro**
1. Après un login réussi dans `/debug`
2. Naviguez vers `/pro`
3. Doit afficher "Bienvenue pro 👋"
4. Si redirect `/login` → Le guard vérifie la session

## 🎯 Checklist Complète

- [ ] `.env.local` existe et est rempli
- [ ] `NEXT_PUBLIC_SUPABASE_URL` est correct
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
- [ ] Utilisateur test existe dans Supabase
- [ ] `/debug` page accessible
- [ ] "Test Connection" affiche ✅
- [ ] "Test Sign In" affiche ✅ SUCCESS
- [ ] Cookies `sb-*` sont présents
- [ ] "Test Server Session" affiche `hasSession: true`
- [ ] `/pro` accessible après login
- [ ] "Bienvenue pro 👋" s'affiche

## 📚 Fichiers de Support

- `SUPABASE_SETUP.md` — Comment configurer Supabase
- `AUTH_DEBUGGING.md` — Autres problèmes d'auth
- `.env.example` — Variables d'env

## 💬 Questions?

Si toujours pas de réponse après ces tests, vous avez:
1. Les logs exact du `/debug` page
2. Les messages d'erreur exact
3. Les données env vars

Partagez-les et on peut diagnostiquer! 🔧

---

**Bonne chance!** 🚀
