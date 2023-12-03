# MultiversX Encoding Devtool

## Introduction

This tool uses the contract ABI to create a human-readable format for your data. This format can be encoed in the MultiversX serialization format. It's most useful when you have complex data (like structs and enums). It uses the official [MultiversX Rust SDK](https://github.com/multiversx/mx-sdk-rs) to do the encoding to be sure the output is correct.

## Building

This project has 2 parts: the Rust library and the web app.

You will need a few tools to build this project:

-   [Rust](https://www.rust-lang.org/tools/install)
-   [Node](https://nodejs.org/)
-   `Yarn`: `npm install -g yarn`
-   `WASM Pack`: `cargo install wasm-pack`
-   `Just`: `cargo install just`

To install dependencies, run `yarn install`.

To build the Rust library, run `just build-wasm`. To build the web app, run `just build-web`. Or you can run `just build` to build both.

You can then preview the web app by running `just preview`. This will start a web server on port `4173`.

For development you can run `just dev-web` to start a web server on port `5173` and watch for changes in the web app source. You need to manually run `just build-wasm` when you change the Rust library, but the web app should reload automatically.

## How it works

TODO
