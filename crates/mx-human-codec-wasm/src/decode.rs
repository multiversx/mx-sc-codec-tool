use wasm_bindgen::prelude::*;

use multiversx_sc::{abi::ContractAbi, codec::top_encode_to_vec_u8};
use multiversx_sc_codec_human_readable::{decode_human_readable_value, format::HumanReadableValue};

#[wasm_bindgen]
pub fn decode_value(abi_json: String, value: String, type_name: String) -> Result<String, String> {
    let abi: ContractAbi = crate::abi::get_abi(&abi_json)?;
    let value = value
        .parse::<HumanReadableValue>()
        .map_err(|_| "failed to parse value")?;

    let output =
        decode_human_readable_value(&value, &type_name, &abi).map_err(|e| e.to_string())?;
    let output = top_encode_to_vec_u8(&output).map_err(|_| "failed to encode")?;

    let output = output
        .iter()
        .map(|x| format!("{:02x}", x))
        .collect::<String>();

    Ok(output)
}
