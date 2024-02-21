import { transformSync } from "@babel/core";

import AutoWrapObserver from "./";

const babelConfiguration = {
  filename: "test.js",
  plugins: ["@babel/plugin-syntax-jsx", AutoWrapObserver],
};

describe("auto wrap observer", () => {
  test("empty string", () => {
    const code = "";
    const output = transformSync(code, babelConfiguration);
    expect(output?.code).toBe(code);
  });

  test("single import", () => {
    const code = "import { react } from 'react';";
    const output = transformSync(code, babelConfiguration);
    expect(output?.code).toBe(code);
  });

  test("function without jsx", () => {
    const code = `
            import { react } from 'react';
            const func = () => {
                console.log(222);
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeFalsy();
  });

  test("arrow function with jsx", () => {
    const code = `
            import { react } from 'react';
            const func = () => {
                return (
                    <div>123</div>
                )
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("function with jsx", () => {
    const code = `
            import { react } from 'react';
            const func = function () {
                return (
                    <div>123</div>
                )
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("export arrow function with jsx", () => {
    const code = `
            import { react } from 'react';
            export const func = () => {
                return (
                    <div>123</div>
                )
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("export function with jsx", () => {
    const code = `
            import { react } from 'react';
            export const func = function () {
                return (
                    <div>123</div>
                )
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("export default arrow function with jsx", () => {
    const code = `
            import { react } from 'react';
            const func = () => {
                return (
                    <div>123</div>
                )
            }

            export default func;
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("export default function with jsx", () => {
    const code = `
            import { react } from 'react';
            const func = function () {
                return (
                    <div>123</div>
                )
            }

            export default func;
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeTruthy();
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();
  });

  test("two arrow function with jsx", () => {
    const code = `
            import { react } from 'react';
            const func = () => {
                return (
                    <div>123</div>
                )
            }

            const func2 = () => {
                return (
                    <div>123</div>
                )
            }
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("mobx-react-lite")).toBeTruthy();

    const codeParts = output?.code?.split("observer");
    expect(codeParts).toHaveLength(4);
  });

  test("export default function with jsx", () => {
    const code = `
            import { react } from 'react';
            import { aa } from "mobx-react-lite";

            const func = function () {
                return (
                    <div>123</div>
                )
            }

            export default func;
        `;
    const output = transformSync(code, babelConfiguration);
    expect(output?.code?.includes("observer")).toBeFalsy();
  });
});
