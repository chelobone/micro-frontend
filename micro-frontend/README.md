
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
  * <span style="color:green">ErrorBoundary.tsx</span>
  * <span style="color:green">remoteTypes.d.ts</span>
  * <span style="color:yellow">App.tsx</span>
  * <span style="color:green">.env</span>
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
import { Box, Center, Flex, Heading, Spinner, Image, Link, Text } from '@chakra-ui/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
const CounterAppOne = React.lazy(() => import('app1/CounterAppOne'));
const CounterAppTwo = React.lazy(() => import('app2/CounterAppTwo'));

const App = () => (
  <>

    <Center
      height="100vh"
      width="100%"
      backgroundColor="#1B1A29"
      margin="0"
      p="0"
      flexDirection="column"
    >
      <Flex
        border="1px solid #151421"
        borderRadius="1rem"
        height="50vh"
        justifyContent="space-around"
        alignItems="center"
        flexDirection="column"
        padding="5rem"
        backgroundColor="#6F60EA"
      >
        <Heading color="#fff">Aplicación contenedora</Heading>
        <Flex direction="row" justifyContent="space-around">
        <ErrorBoundary>
          <React.Suspense fallback={<Spinner size="xl" />}>
            <Box
              p="2rem"
              mr="2rem"
              border="1px solid #aeaeae"
              borderRadius="1rem"
              backgroundColor="#fff"
            >
              <Heading color="#6F60EA" mb="1rem">
                APP-1
              </Heading>
              <CounterAppOne />
            </Box>
          </React.Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <React.Suspense fallback={<Spinner size="xl" />}>
              <Box p="2rem" border="1px solid #aeaeae" borderRadius="1rem" backgroundColor="#fff">
                <Heading color="#6F60EA" mb="1rem">
                  APP-2
                </Heading>
                <CounterAppTwo />
              </Box>
            </React.Suspense>
          </ErrorBoundary>
        </Flex>
      </Flex>
    </Center>
  </>
);

export default App;

```

### 2.1 ErrorBoundary.tsx
Para controlar los errores que puedan ocurrir por no estar disponible uno de los frontends, debes implementar el wrapper [`ErrorBoundaries`](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/)
```javascript
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Hubo un error al cargar este componente</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
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
const webpack = require('webpack'); // only add this if you don't have yet
const { ModuleFederationPlugin } = webpack.container;
const deps = require('./package.json').dependencies;

const buildDate = new Date().toLocaleString();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  console.log({ isProduction });
  return {
    entry: './src/index.ts',
    mode: process.env.NODE_ENV || 'development',
    devServer: {
      port: 3000,
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
      new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new ModuleFederationPlugin({
        name: 'container',
        remotes: {
          app1: 'app1@http://localhost:3001/remoteEntry.js',
          app2: 'app2@http://localhost:3002/remoteEntry.js',
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
};
```
### 5. Modificar package.json (sección `scripts`)

```json
"scripts": {
    "start": "webpack serve --open",
    "build": "webpack --config webpack.prod.js",
    "serve": "serve dist -p 3002",
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

### 7. Crear archivo `.env`
```v
DEV_APP1="app1@http://localhost:3001/remoteEntry.js"
DEV_APP2="app2@http://localhost:3002/remoteEntry.js"

PROD_APP1="app1@http://YOUR_APPLICATION_PRODUCTION_URL_HERE/remoteEntry.js"
PROD_APP2="app2@http://YOUR_APPLICATION_PRODUCTION_URL_HERE/remoteEntry.js"
```

### 8. Crear archivo `remoteTypes.d.ts`
```javascript
///<reference types="react" />

declare module 'app1/CounterAppOne' {
  const CounterAppOne: React.ComponentType;

  export default CounterAppOne;
}

declare module 'app2/CounterAppTwo' {
  const CounterAppTwo: React.ComponentType;

  export default CounterAppTwo;
}
```

### 9. Modificar `index.html`

```html
<html>
  <head>
    <title>CONTAINER</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
## Learn more

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
