import { loadModule, ModuleLoadOptions } from "./lib/module";

export interface HumanCodecOptions {
	load?: ModuleLoadOptions;
}

export async function createHumanCodec(options: HumanCodecOptions = {}) {
	const module = await loadModule(options.load);
	const instance = new WebAssembly.Instance(module, {});

	const textDecoder = new TextDecoder();
	const textEncoder = new TextEncoder();

	function getExportedFunction<ReturnType = any, ArgTypes extends any[] = any[]>(
		name: string
	): (...args: ArgTypes) => ReturnType {
		const exportedValue = instance.exports[name];
		if (typeof exportedValue !== "function") {
			throw new Error(`Exported value ${name} is not a function`);
		}
		return exportedValue as (...args: ArgTypes) => ReturnType;
	}

	const lib = {
		memory: instance.exports.memory as WebAssembly.Memory,
		alloc: getExportedFunction<number, [len: number]>("alloc_bytes"),
		free: getExportedFunction<void, [ptr: number]>("free_bytes"),
		doubleString: getExportedFunction<number, [ptr: number]>("double_str"),
	} as const;

	function allocBuffer(len: number) {
		let ptr = lib.alloc(len);
		return createBuffer(ptr);
	}

	function createBuffer(ptr: number) {
		let len = new Uint32Array(lib.memory.buffer, ptr, 1)[0];
		let buf = new Uint8Array(lib.memory.buffer, ptr + 4, len);

		return {
			ptr,
			len,
			buf,
			free() {
				lib.free(ptr);
			},
		};
	}

	function doubleString(str: string): string {
		let strBytes = textEncoder.encode(str);
		let strBuf = allocBuffer(strBytes.length);
		strBuf.buf.set(strBytes);

		let outPtr = lib.doubleString(strBuf.ptr);

		let outBuf = createBuffer(outPtr);
		let outStr = textDecoder.decode(outBuf.buf);

		strBuf.free();
		outBuf.free();

		return outStr;
	}

	return {
		createBuffer,
		allocBuffer,
		lib,
		exports: instance.exports,
		doubleString,
	};
}
