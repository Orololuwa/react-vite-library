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
  ...,
    "scripts": {
    "build": "tsc --p ./tsconfig.build.json && vite build",
    ...
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
  ...,
  "include": ["src", "lib"]
}
```

- Add React components of choice

- Update `vite.config.ts`

```typescript
export default defineConfig({
  ...,
  build: {
    ...,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});
```

6. **Configure Tailwind**

- Install Tailwind and related packages

```bash
npm install -D tailwindcss@^3.3.0 autoprefixer@^10.4.0 postcss@^8.4.0
```

- Create a tailwind config file in the root of the project

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#131316",
        "primary-hover": "#333333",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- Create a CSS file to be imported in the main.ts file

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Update vite config to import autoprefixer and tailwindcss

```typescript
{
  ...,
    css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
}
```

7. **Inject or Import CSS**

- Now we have to import the CSS file and for that we need a library and update our vite.config.ts

```bash
npm i vite-plugin-lib-inject-css -D
```

```typescript
import { libInjectCss } from 'vite-plugin-lib-inject-css'
{
  plugins: [
    ...,
    libInjectCss(),
  ],
  ...
}
```

8. **Split Up CSS**

But there's still the second problem: when you import something from your library, main.css is also imported and all the CSS styles end up in your application bundle. Even if you only import the button.

The libInjectCSS plugin generates a separate CSS file for each chunk and includes an import statement at the beginning of each chunk's output file.

So if you split up the JavaScript code, you end up having separate CSS files that only get imported when the according JavaScript files are imported.

One way of doing this would be to turn every file into an Rollup entry point.

- install glob

```bash
npm i glob -D
```

- update vite config

```diff
-import { resolve } from 'path'
+import { extname, relative, resolve } from 'path'
+import { fileURLToPath } from 'node:url'
+import { glob } from 'glob'

...
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
+     input: Object.fromEntries(
+       glob.sync('lib/**/*.{ts,tsx}', {
+         ignore: ["lib/**/*.d.ts"],
+       }).map(file => [
+         // The name of the entry point
+         // lib/nested/foo.ts becomes nested/foo
+         relative(
+           'lib',
+           file.slice(0, file.length - extname(file).length)
+         ),
+         // The absolute path to the entry file
+         // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
+         fileURLToPath(new URL(file, import.meta.url))
+       ])
+     ),
+     output: {
+       assetFileNames: 'assets/[name][extname]',
+       entryFileNames: '[name].js',
+     }
    }
…
```

6. **Build Library**

```bash
pnpm build
```

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
