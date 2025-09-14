# Aplicación Pokémon con Supabase

Una aplicación web que permite explorar información sobre Pokémon con un sistema de autenticación utilizando Supabase.

## Características

- Exploración de Pokémon por tipo, generación y más
- Detalles completos de cada Pokémon
- Sistema de autenticación con Supabase
- Opciones de login con email/contraseña y proveedores sociales
- Interfaz responsiva para todos los dispositivos
- Desarrollada con React, TypeScript y Vite

## Autenticación con Supabase

Esta aplicación utiliza Supabase para la gestión de usuarios y autenticación:

- Registro y login con email/contraseña
- Autenticación con proveedores sociales
- Recuperación de contraseñas
- Perfiles de usuario personalizados

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
  ```bash
  npm install
  ```
3. Configura las variables de entorno:
  - Crea un archivo `.env` en la raíz del proyecto
  - Añade tus credenciales de Supabase:
    ```
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
    ```

4. Inicia la aplicación en modo desarrollo:
  ```bash
  npm run dev
  ```

## Uso

1. Accede a la aplicación en tu navegador
2. Regístrate o inicia sesión con tus credenciales
3. Explora la base de datos de Pokémon
4. Guarda tus Pokémon favoritos en tu perfil

## Tecnologías

- React + TypeScript
- Vite
- Supabase (Autenticación y Base de datos)
- React Router
- PokeAPI

## Estructura del Proyecto

```
/src
  /components    # Componentes reutilizables
  /pages         # Páginas principales
  /services      # Servicios para API y Supabase
  /hooks         # Custom hooks
  /types         # Definiciones de TypeScript
  /context       # Contextos de React (Auth, etc.)
  /assets        # Imágenes y recursos estáticos
```
