import { template, PluginObj } from "@babel/core";
import { Statement } from "@babel/types";

import {
  getStatementBody,
  isMobxImportedInModule,
  isContainReactCode,
  insertMobxWrapper,
} from "./lib";

const mobxImportTemplate = template(
  "import { observer } from 'mobx-react-lite';",
);

function AutoWrapObserver() {
  const mobxImport = mobxImportTemplate();

  const plugin: PluginObj = {
    visitor: {
      Program(path) {
        let isReactCodeUsed = false;
        let isMobxImported = false;
        const { body } = path.node;
        const statementWithReact = [];

        for (const statement of body) {
          const functionBody = getStatementBody[statement.type]?.(statement);

          const isMobxUsed = isMobxImportedInModule(statement);
          if (isMobxUsed) {
            isMobxImported = true;
          }

          const withReactCode = isContainReactCode(functionBody);
          if (withReactCode && !isMobxUsed) {
            statementWithReact.push(statement);
            isReactCodeUsed = true;
          }
        }

        if (!isMobxImported && isReactCodeUsed) {
          body.push(mobxImport as Statement);

          for (const statement of body) {
            if (statementWithReact.includes(statement)) {
              insertMobxWrapper(statement)[statement.type]?.();
            }
          }
        }
      },
    },
  };

  return plugin;
}

export default AutoWrapObserver;
