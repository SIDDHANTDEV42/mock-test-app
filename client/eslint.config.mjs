import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
    {
        ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
    },
    ...nextVitals,
    ...nextTypescript,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-require-imports": "off",
            "import/no-anonymous-default-export": "off",
            "react/no-unescaped-entities": "off",
            "react-hooks/immutability": "off",
            "react-hooks/set-state-in-effect": "off",
        },
    },
];

export default config;
