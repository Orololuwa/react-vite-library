# Creating a Library with Vite

This guide demonstrates how to create and publish a library using Vite.

## Setup Steps

1. **Initialize Project**

```bash
npm create vite@latest
? Project name: › vite-library
? Select a framework: › React
? Select a variant: › TypeScript
cd vite-library
npm i
npm uninstall react react-dom && npm install react@18 react-dom@18 @types/react@18 @types/react-dom@18 @types/node
```

2. **Configure `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
      fileName: "index",
    },
    copyPublicDir: false,
  },
});
```

3. **Create `tsconfig.build.json` in the root and update the build command in `package.json`**

```json
//tsconfig.build.json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.build.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["lib"]
}
```

```json
//package.json
{
  ...rest
    "scripts": {
    "build": "tsc --p ./tsconfig.build.json && vite build",
    ...rest
  },
}
```

4. **Setup for building the types**

- Install the vite plugin

```bash
npm i vite-plugin-dts -D
```

- copy the `vite-env.d.ts` file into the lib folder from the src folder

- Update the vite.config.ts file

```diff
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
+ import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
+    dts({
+      insertTypesEntry: true,
+      rollupTypes: true,
+      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
+    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
      fileName: "index",
    },
    copyPublicDir: false,
  },
});
```

5. **Setup for React Components**

- install React types

```bash
npm i @types/react @types/react-dom -D
```

- Update `tsconfig.app.json`

```json
{
  ...rest,
  "include": ["src", "lib"]
}
```

- Add React components of choice

- Update `vite.config.ts`

````typescript
export default defineConfig({
...rest,
  build: {
    ...rest,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});

6. **Build Library**

```bash
pnpm build
````

5. **Test Locally**

```bash
pnpm link
```

6. **Publish to npm**

```bash
pnpm publish
```

## Notes

- Ensure proper exports in your entry file
- Test your library before publishing
- Add appropriate documentation
- Include type definitions if using TypeScript
