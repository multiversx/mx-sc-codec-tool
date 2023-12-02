extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod mem;

#[no_mangle]
pub extern "C" fn double_str(input: *mut u8) -> *mut u8 {
    let input_bytes = mem::get_bytes_from_ptr(input);
    let input_str = String::from_utf8(input_bytes).unwrap();
    let output_str = format!("{}{}", input_str, input_str);
    let output_bytes = output_str.into_bytes();
    return mem::get_ptr_from_bytes(output_bytes);
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_double_str() {
        let input_str = "hello";
        let input_bytes = input_str.as_bytes();
        let input_ptr = mem::get_ptr_from_bytes(input_bytes.to_vec());
        let output_ptr = double_str(input_ptr);
        let output_bytes = mem::get_bytes_from_ptr(output_ptr);
        let output_str = String::from_utf8(output_bytes).unwrap();
        assert_eq!(output_str, "hellohello");
    }
}
