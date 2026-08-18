# Guía de Desarrollo - Dashboard Civil

Este documento sienta las bases arquitectónicas y de desarrollo para el proyecto. Se recomienda leerlo antes de comenzar a trabajar en nuevas funcionalidades para mantener la consistencia del código.

## 🏗 Arquitectura del Proyecto

El proyecto está dividido en dos partes principales: **Frontend** (React) y **Backend** (Node.js). El backend implementa una **Arquitectura Hexagonal (Puertos y Adaptadores)** con estricto apego a los principios **SOLID** y **Clean Code**.

### Stack Tecnológico
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Query.
- **Backend**: Node.js, TypeScript, Express, Zod (Validación), Prisma (ORM).
- **Base de Datos**: PostgreSQL (Docker).

---

## 🧩 Estructura del Backend (Hexagonal)

El código del backend se encuentra en la carpeta `/server/src` y está dividido en 4 capas concéntricas (de adentro hacia afuera):

### 1. Domain (Dominio)
La capa más interna. Contiene la lógica de negocio pura y no depende de ninguna otra capa ni de librerías externas (solo TypeScript puro).
- **Entities**: Representación de los objetos de negocio (ej. `Plazo.ts`).
- **Repositories (Interfaces)**: Definición de los contratos que la infraestructura deberá cumplir (Puertos de salida).

### 2. Application (Aplicación)
Contiene los casos de uso del sistema. Orquesta el flujo de datos usando las entidades de dominio y las interfaces de los repositorios.
- **Use Cases**: Clases que ejecutan acciones específicas (ej. `GetPlazosUseCase.ts`, `CreatePlazoUseCase.ts`).

### 3. Infrastructure (Infraestructura)
Implementa las interfaces definidas en el dominio (Adaptadores). Contiene todo lo relacionado con tecnologías externas.
- **Persistence**: Repositorios que interactúan con la base de datos a través de Prisma (ej. `PrismaPlazoRepository.ts`).

### 4. Presentation (Presentación)
La capa más externa, encargada de interactuar con el mundo exterior.
- **Controllers**: Manejan las peticiones HTTP, validan los DTOs usando **Zod** y llaman a los casos de uso.
- **Routes**: Definición de los endpoints de la API (Express).

### Inyección de Dependencias
Se utiliza un enfoque de **Composition Root** en `server/src/index.ts`. Allí se instancian los repositorios, los casos de uso y los controladores, inyectando las dependencias de forma manual. Esto favorece la escalabilidad y facilita el testing.

---

## 🎨 Estructura del Frontend

El frontend se encuentra en la raíz del proyecto.
- **Estado Asíncrono**: Se utiliza **React Query** para manejar las peticiones al backend, cachear los datos y sincronizar el estado global. Los hooks personalizados se encuentran en `src/hooks/` (ej. `usePlazos.ts`).
- **Componentes**: Componentes UI reutilizables.
- **API Client**: Funciones de fetch definidas en `src/api/apiClient.ts`.

---

## 🚀 Guía de Inicio Rápido (Local)

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Levantar la Base de Datos
El proyecto incluye un `docker-compose.yml` para levantar PostgreSQL.
```bash
cd server
docker-compose up -d
```

### 2. Sincronizar Prisma y Sembrar Datos
Una vez que la base de datos esté corriendo, debes aplicar las migraciones y sembrar datos de prueba.
```bash
cd server
npm install
npx prisma db push
npm run seed
```

### 3. Levantar los Servidores de Desarrollo
Necesitas dos terminales, una para el backend y otra para el frontend.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
El backend correrá en `http://localhost:3000` (utilizando `tsx watch` para recarga automática).

**Terminal 2 (Frontend):**
```bash
npm install
npm run dev
```
El frontend correrá en el puerto que asigne Vite (usualmente `http://localhost:5173`).

---

## 📝 Reglas de Desarrollo

1. **Principio de Responsabilidad Única (SRP)**: Cada clase/archivo debe tener un solo propósito.
2. **Validación Perimetral**: Todas las peticiones entrantes deben ser validadas en la capa de presentación (Controllers) usando **Zod**.
3. **Dependencias**: Las capas internas (Domain, Application) **NUNCA** deben importar de las capas externas (Infrastructure, Presentation).
4. **Manejo de Errores**: Propagar los errores de dominio hacia la capa de presentación para que sean devueltos con el código HTTP correcto.
