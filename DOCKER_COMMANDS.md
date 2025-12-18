# Docker - Comandos Básicos

## 🏗️ Crear imagen

```bash
docker build -t appinit-test:latest .
```

## 🚀 Ejecutar contenedor

```bash
# En puerto 3000
docker run -d -p 3000:3000 --name appinit-test appinit-test:latest

# Ver logs
docker logs -f appinit-test
```

## 🛑 Detener y eliminar

```bash
# Detener
docker stop appinit-test

# Eliminar contenedor
docker rm appinit-test

# Eliminar imagen
docker rmi appinit-test:latest
```

## 📊 Otros comandos útiles

```bash
# Ver contenedores corriendo
docker ps
```

## ✨ Paso a paso completo

```bash
# 1. Construir
docker build -t appinit-test:latest .

# 2. Ejecutar
docker run -d -p 3000:3000 --name appinit-test appinit-test:latest

# 3. Acceder
# Abre: http://localhost:3000

# 4. Ver logs (si algo falla)
docker logs appinit-test

# 5. Detener y eliminar
docker stop appinit-test
docker rm appinit-test
docker rmi appinit-test:latest
```
