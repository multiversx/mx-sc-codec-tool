#[no_mangle]
pub extern "C" fn alloc_bytes(len: usize) -> *mut u8 {
    let mut mem = vec![0u8; len + 4];

    let size_bytes = (len as u32).to_le_bytes();
    for i in 0..4 {
        mem[i] = size_bytes[i];
    }

    let ptr = mem.as_mut_ptr();
    std::mem::forget(mem);
    return ptr;
}

#[no_mangle]
pub extern "C" fn free_bytes(ptr: *mut u8) {
    let size_bytes = unsafe { [*ptr, *ptr.offset(1), *ptr.offset(2), *ptr.offset(3)] };
    let size = u32::from_le_bytes(size_bytes) as usize;

    unsafe {
        let _ = Vec::from_raw_parts(ptr, 0, size);
    }
}

pub fn get_ptr_from_bytes(bytes: Vec<u8>) -> *mut u8 {
    let size_bytes = (bytes.len() as u32).to_le_bytes();
    let mut mem = vec![0u8; bytes.len() + 4];
    for i in 0..4 {
        mem[i] = size_bytes[i];
    }
    for i in 0..bytes.len() {
        mem[i + 4] = bytes[i];
    }

    let ptr = mem.as_mut_ptr();
    std::mem::forget(mem);
    return ptr;
}

pub fn get_bytes_from_ptr(ptr: *mut u8) -> Vec<u8> {
    let size_bytes = unsafe { [*ptr, *ptr.offset(1), *ptr.offset(2), *ptr.offset(3)] };
    let size = u32::from_le_bytes(size_bytes) as usize;

    let mut bytes = vec![0u8; size];
    for i in 0..size {
        bytes[i] = unsafe { *ptr.offset(i as isize + 4) };
    }

    return bytes;
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_alloc() {
        let ptr = alloc_bytes(10);
        let bytes = get_bytes_from_ptr(ptr);
        assert_eq!(bytes.len(), 10);
        free_bytes(ptr);
    }
}
