import { HumanCodec } from "mx-human-codec";

import { useState } from "react";
import TypeSelector from "./components/TypeSelector";
import Upload from "./components/Upload";

const codec = await HumanCodec.init();

function App() {
	const [types, setTypes] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [value, setValue] = useState<string>("");

	return (
		<div style={{ padding: "1rem" }}>
			<h1>Human Codec</h1>
			<Upload
				onUpload={(json) => {
					console.log("abi json", json);

					codec.loadAbi(json);

					setTypes(codec.types);
					setSelectedType(codec.types[0] ?? null);

					if (codec.types.length > 0) {
						setValue(codec.getDefaultForType(codec.types[0]));
					} else {
						setValue("");
					}
				}}
			/>
			{types.length > 0 && (
				<div style={{ marginTop: "20px" }}>
					<p>type: </p>
					<TypeSelector
						types={types}
						onSelect={(t) => {
							setSelectedType(t);
							setValue(codec.getDefaultForType(t));
						}}
					/>
				</div>
			)}
			{selectedType && (
				<div style={{ marginTop: "20px" }}>
					<p>value for type {selectedType}: </p>
					<pre>{value}</pre>
				</div>
			)}
		</div>
	);
}

export default App;
