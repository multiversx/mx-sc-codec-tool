extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

mod abi;
mod decode;
mod defaults;
mod schema;

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}
