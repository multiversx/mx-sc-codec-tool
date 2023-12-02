use wasm_bindgen::prelude::*;

use multiversx_sc::abi::ContractAbi;
use multiversx_sc_codec_human_readable::{default_value_for_abi_type, encode_human_readable_value};

#[wasm_bindgen]
pub fn get_default_json_for_type(abi_json: String, type_name: String) -> Result<String, String> {
    let abi: ContractAbi = crate::abi::get_abi(&abi_json)?;

    let value = default_value_for_abi_type(&type_name, &abi).map_err(|e| e.to_string())?;
    let value = encode_human_readable_value(&value, &type_name, &abi).map_err(|e| e.to_string())?;

    Ok(value.to_string())
}
