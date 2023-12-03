import { HumanCodec } from "mx-human-codec";

import { useState } from "react";
import Editor from "./components/Editor";
import TypeSelector from "./components/TypeSelector";
import Upload from "./components/Upload";

const codec = await HumanCodec.init();

function App() {
	const [types, setTypes] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [defaultValue, setDefaultValue] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const [output, setOutput] = useState<string>("");

	function setError(e: unknown) {
		console.error(e);
		setLoading(false);
		if (typeof e === "string") {
			setOutput(e);
		} else if (e instanceof Error) {
			setOutput(e.message);
		} else {
			setOutput("unknown error");
		}
	}

	function initAbi(json: string) {
		try {
			codec.loadAbi(json);

			setTypes(codec.types);

			if (codec.types.length > 0) {
				setType(codec.types[0]!);
			} else {
				throw new Error("no types found");
			}
		} catch (e) {
			setError(e);
		}
	}

	function computeOutput(type: string, input: string) {
		try {
			const output = codec.decodeValueOfType(type, input);
			setLoading(false);
			setOutput(output);
		} catch (e) {
			setError(e);
		}
	}

	function setType(type: string) {
		try {
			const value = codec.getDefaultForType(type);
			setSelectedType(type);
			setDefaultValue(value);
			computeOutput(type, value);
		} catch (e) {
			setError(e);
		}
	}

	return (
		<div style={{ padding: "1rem" }}>
			<h1>Human Codec</h1>
			<Upload
				onUpload={(json) => {
					console.log("abi json", json);
					initAbi(json);
				}}
			/>
			{types.length > 0 && (
				<div style={{ marginTop: "20px" }}>
					<p>type: </p>
					<TypeSelector
						types={types}
						onSelect={(t) => {
							setType(t);
						}}
					/>
				</div>
			)}
			{!loading && output !== "" && <p style={{ marginTop: "20px" }}>Result: {output}</p>}
			{loading && <p style={{ marginTop: "20px" }}>loading...</p>}
			{selectedType && (
				<div style={{ marginTop: "20px" }}>
					<p>value for type {selectedType}: </p>
					<Editor
						defaultValue={defaultValue}
						onChange={(v) => {
							computeOutput(selectedType, v ?? defaultValue);
						}}
						onStartedChange={() => {
							setLoading(true);
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
