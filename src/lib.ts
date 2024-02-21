/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Statement,
  ExportNamedDeclaration,
  CallExpression,
  VariableDeclaration,
  Expression,
  FunctionDeclaration,
} from "@babel/types";

const functionTypes = ["FunctionExpression", "ArrowFunctionExpression"];

export const isContainReactCode = (node: any) => {
  let isContainReactCode = false;

  const iter = (node: any) => {
    for (const key in node) {
      if (typeof node[key] === "object" && node[key] !== null) {
        const isReactCode = ["JSXElement", "JSXFragment"].includes(
          node[key].type,
        );
        if (isReactCode) {
          isContainReactCode = true;
          return;
        }
        iter(node[key]);
      }
    }
  };
  iter(node);

  return isContainReactCode;
};

export const getStatementBody: Partial<
  Record<Statement["type"], (statement: Statement) => any>
> = {
  ExportNamedDeclaration: (statement: Statement) => {
    const exportedStatement = statement as ExportNamedDeclaration;
    const { declarations = [] } = (exportedStatement.declaration ?? {}) as any;

    if (!declarations.length) {
      return {};
    }
    const { body, type } = declarations[0].init ?? {};

    if (!functionTypes.includes(type)) {
      return {};
    }

    return body;
  },
  FunctionDeclaration: (statement: Statement) =>
    (statement as FunctionDeclaration).body,
  VariableDeclaration: (statement: Statement) => {
    const variableStatement = statement as VariableDeclaration;
    const { declarations = [] } = variableStatement;

    if (!declarations.length) {
      return {};
    }

    const { body, type = "" } = declarations[0].init ?? ({} as any);

    if (!functionTypes.includes(type)) {
      return {};
    }
    return body;
  },
};

export const insertMobxWrapper = (
  statement: Statement,
): Partial<Record<Statement["type"], () => void>> => {
  const observerCallExpression: CallExpression = {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "observer",
    },
    arguments: [],
  };

  return {
    ExportNamedDeclaration: () => {
      const exportedStatement = statement as ExportNamedDeclaration;
      const declaration = exportedStatement.declaration as VariableDeclaration;
      const { type = "" } = declaration?.declarations?.[0]?.init ?? {};
      const init = declaration?.declarations?.[0]?.init;
      const isNestedFunction =
        (declaration?.declarations?.[0] as any)?.init.body?.type ===
        "ArrowFunctionExpression";

      if (
        (functionTypes.includes(type) || type === "CallExpression") &&
        !isNestedFunction
      ) {
        observerCallExpression.arguments.push(init as Expression);
        declaration.declarations[0].init = observerCallExpression;
      }
    },
    VariableDeclaration: () => {
      const variableStatement = statement as VariableDeclaration;
      const { type = "" } = variableStatement.declarations?.[0].init ?? {};
      const init = variableStatement.declarations?.[0]?.init;

      if (functionTypes.includes(type) || type === "CallExpression") {
        observerCallExpression.arguments.push(init as Expression);
        variableStatement.declarations[0].init = observerCallExpression;
      }
    },
  };
};

export const isMobxImportedInModule = (statement: Statement) => {
  const mobxPackages = ["mobx-react-lite", "mobx-react"];

  if (statement.type !== "ImportDeclaration") {
    return false;
  }
  return (
    mobxPackages.includes(statement?.source.value) ||
    statement?.specifiers.some(
      (specifier) => specifier.local.name === "observer",
    )
  );
};
