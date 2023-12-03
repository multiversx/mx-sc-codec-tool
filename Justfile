build-wasm:
    cd ./crates/mx-human-codec-wasm && wasm-pack build --release --target web

build-web:
    yarn frontend build

dev-web:
    yarn frontend dev

preview-web:
    yarn frontend preview

build: build-wasm build-web
preview: preview-web
