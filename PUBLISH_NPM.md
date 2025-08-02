# 📦 **COMANDOS PARA PUBLICAR NO NPM**

## 🎯 **COMANDOS PARA VOCÊ EXECUTAR:**

### **📋 PASSO 1: PREPARAR AMBIENTE**

```bash
# 1. Fazer login no NPM (se ainda não fez)
npm login

# 2. Clonar repositório atualizado
git clone https://github.com/kenissongmelo/watchful-kenin-portal.git
cd watchful-kenin-portal
```

### **📋 PASSO 2: PUBLICAR PLUGIN FRONTEND**

```bash
# Entrar na pasta do plugin frontend
cd backstage-plugin/kenin-duty

# Instalar dependências
npm install

# Build do plugin
npm run build

# Publicar no NPM
npm publish --access public
```

### **📋 PASSO 3: PUBLICAR PLUGIN BACKEND**

```bash
# Voltar e entrar na pasta do backend
cd ../kenin-duty-backend

# Instalar dependências  
npm install

# Build do plugin
npm run build

# Publicar no NPM
npm publish --access public
```

### **📋 PASSO 4: VERIFICAR PUBLICAÇÃO**

Após publicar, seus pacotes estarão disponíveis em:

- **Frontend**: https://www.npmjs.com/package/@keninduty/backstage-plugin-kenin-duty
- **Backend**: https://www.npmjs.com/package/@keninduty/backstage-plugin-kenin-duty-backend

### **📋 PASSO 5: TESTAR INSTALAÇÃO**

```bash
# Qualquer pessoa poderá instalar com:
yarn add @keninduty/backstage-plugin-kenin-duty
yarn add @keninduty/backstage-plugin-kenin-duty-backend
```

---

## 🔧 **RESOLUÇÃO DE PROBLEMAS**

### **Erro: "You do not have permission to publish"**
```bash
# Verificar se está logado
npm whoami

# Fazer login novamente
npm login
```

### **Erro: "Package name already exists"**
```bash
# O nome @keninduty/backstage-plugin-kenin-duty já está configurado
# Se der erro, mude o nome no package.json para:
# "@seu-usuario/backstage-plugin-kenin-duty"
```

### **Erro de build**
```bash
# Instalar dependências do Backstage CLI
npm install -g @backstage/cli

# Tentar build novamente
npm run build
```

---

## 🎉 **RESULTADO FINAL**

Após executar estes comandos, você terá:

✅ **2 pacotes NPM publicados**  
✅ **Plugin disponível para toda comunidade Backstage**  
✅ **Documentação completa no GitHub**  
✅ **Instalação via yarn/npm**  

### **📱 Como outras pessoas vão usar:**

```bash
# Instalar
yarn add @keninduty/backstage-plugin-kenin-duty
yarn add @keninduty/backstage-plugin-kenin-duty-backend

# Configurar (seguindo sua documentação)
# Ver: https://github.com/kenissongmelo/watchful-kenin-portal
```

---

**🚀 Execute estes comandos e seu plugin estará disponível para o mundo!**