export interface ModuleLoadOptions {
	debug?: boolean;
	wasmUrl?: string;
}

async function getDefaultUrl(debug: boolean): Promise<string> {
	if (debug)
		return (
			await import("../../../target/wasm32-unknown-unknown/debug/mx_human_codec.wasm?url")
		).default;
	else
		return (
			await import("../../../target/wasm32-unknown-unknown/release/mx_human_codec.wasm?url")
		).default;
}

async function fetchBytes(url: string): Promise<ArrayBuffer> {
	return (await fetch(url)).arrayBuffer();
}

export async function loadModule(options?: ModuleLoadOptions): Promise<WebAssembly.Module> {
	const url = options?.wasmUrl ?? (await getDefaultUrl(options?.debug ?? false));
	const bytes = await fetchBytes(url);
	const module = new WebAssembly.Module(bytes);
	return module;
}
