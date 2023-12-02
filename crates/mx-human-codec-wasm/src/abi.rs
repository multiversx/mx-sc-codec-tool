use std::{collections::HashMap, sync::Mutex};

use wasm_bindgen::prelude::*;

use multiversx_sc::abi::ContractAbi;
use multiversx_sc_meta::abi_json::deserialize_abi_from_json;

fn abi_cache() -> &'static Mutex<HashMap<String, ContractAbi>> {
    static mut SINGLETON: std::mem::MaybeUninit<Mutex<HashMap<String, ContractAbi>>> =
        std::mem::MaybeUninit::uninit();

    static ONCE: std::sync::Once = std::sync::Once::new();

    unsafe {
        ONCE.call_once(|| {
            let singleton = Mutex::new(HashMap::new());
            SINGLETON.write(singleton);
        });

        &SINGLETON.assume_init_ref()
    }
}

pub fn get_abi(abi_json: &str) -> Result<ContractAbi, String> {
    let mut cache = abi_cache().lock().unwrap();

    if let Some(abi) = cache.get(abi_json) {
        return Ok(abi.clone());
    }

    let abi: ContractAbi = deserialize_abi_from_json(abi_json)?.into();
    cache.insert(abi_json.to_string(), abi.clone());

    Ok(abi)
}

#[wasm_bindgen]
pub fn load_abi(abi_json: &str) -> Result<(), String> {
    get_abi(abi_json)?;
    Ok(())
}

#[wasm_bindgen]
pub fn list_contract_abi_types(abi_json: String) -> Result<Vec<String>, String> {
    let abi: ContractAbi = get_abi(&abi_json)?;
    let mut types = Vec::new();

    for (name, _) in abi.type_descriptions.0.iter() {
        types.push(String::from_utf8_lossy(name.as_bytes()).into());
    }

    Ok(types)
}
