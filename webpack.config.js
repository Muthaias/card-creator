const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
    env = env || {
        production: false,
    };
    const reactLib = env.production ? "production.min" : "development";
    return {
        mode: env.production ? "production" : "development",
        watch: env.production ? false : true,

        entry: {
            main: "./src/index.tsx",
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js"]
        },

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                }
            ]
        },

        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },

        plugins: [
            new CopyPlugin(
                {
                    "patterns": [
                        { from: "./index.html", to: "./index.html" },
                        { from: "./node_modules/react/umd/react." + reactLib + ".js", to: "./vendor/react.js" },
                        { from: "./node_modules/react-dom/umd/react-dom." + reactLib + ".js", to: "./vendor/react-dom.js" },
                    ]
                }
            ),
        ],
    }
};