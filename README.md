# Autowrap-mobx-observer
Autowrap react components in mobx observer hoc. Support functional components.

## Prerequisites
- **@babel/core: ^7.23.3**
- **babel jsx**
- **typescript tscofngg: jsx: preserve**

## Usage
```text
{
    "compilerOptions": {
        "baseUrl": "./src",
        "jsx": "preserve"
    },
    "
}
```
```text
const babelConfig = require("path-to-config");
babelConfig.plugins = [...babelConfig.plugins, "./node_modules/autowrap-mobx-observer"];
module.exports = babelConfig;
```
## Result
#### Before
```text
import { react } from 'react';

const func = () => {
    console.log(222);
};
```
#### After
```text
import { observer } from 'mobx-react-lite';
import { react } from 'react';

const func = observer(() => {
    console.log(222);
});
```