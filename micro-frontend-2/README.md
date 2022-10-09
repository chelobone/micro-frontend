
# Aplicación contenedora de microfrontend

## Este proyecto se creó usando [Create React App](https://github.com/facebook/create-react-app).

El comando para crear este proyecto es el siguiente:
```
npx create-react-app micro-frontend --template typescript
```
El proyecto se crea con formato typescript
Se deben instalar los siguientes componentes:
```
npm install html-webpack-plugin serve ts-loader webpack webpack-cli webpack-dev-server @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^5
```
o

```
npm i
```

Esto instará las dependencias respecto al archivo `package.json`
Dentro de este proyecto podemos ver la implementación de como invocar disintos microfrontends dentro una aplicación

### Creación o modificación de archivos

La estructura de carpetas y los archivos que se deben <span style="color:green">crear</span> o <span style="color:yellow">modificar</span> son los siguientes:

* public
  * <span style="color:yellow">index.html</span>
* src
  * <span style="color:green">bootstrap.tsx</span>
  * <span style="color:yellow">~~index.tsx~~ -> indext.ts</span>
  * <span style="color:green">components</span>
    * <span style="color:green">HomeAppMicro2.tsx</span>
  * <span style="color:yellow">App.tsx</span>
* <span style="color:yellow">package.json</span>
* <span style="color:yellow">tsconfig.json</span>
* <span style="color:green">webpack.config.js</span>


### 1. Crear src/bootstrap.tsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();

```
### 2. Modificar src/App.tsx

```javascript
import { Box } from '@chakra-ui/react';
import React from 'react';
import CounterAppOne from './components/HomeAppMicro2';

const App = () => (
  <Box margin="1.2rem">
    <Box>APP-1</Box>
    <Box>
      <CounterAppOne />
    </Box>
  </Box>
);

export default App;

```
### 3. Modificar index.tsx a index.ts

Agregar el siguiente contenido:
```javascript
import('./bootstrap');
export {};
```

### 4. Crear webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3001,
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        // expose each component
        './CounterAppOne': './src/components/HomeAppMicro2',
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```
### 5. Modificar package.json (sección `scripts`)

```json
"scripts": {
    "start": "webpack serve --open",
    "build": "webpack --config webpack.prod.js",
    "serve": "serve dist -p 3001",
    "clean": "rm -rf dist"
}
```

### 6. Actualizar tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "baseUrl": "./",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 9. Modificar `index.html`

```html
<html>
  <head>
    <title>APP-1</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
## Learn more

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
