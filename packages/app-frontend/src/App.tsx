import { createHumanCodec } from "mx-human-codec";
import { useState } from "react";

const codec = await createHumanCodec({
	load: {
		debug: import.meta.env.DEV,
	},
});

function App() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	return (
		<>
			<input
				placeholder="text"
				value={input}
				onChange={(e) => setInput(e.target.value ?? "")}
			/>
			<button
				onClick={() => {
					if (input.trim() === "") return;

					const str = codec.doubleString(input);
					setOutput(str);
				}}
			>
				double str
			</button>
			<br />
			<p>{output}</p>
		</>
	);
}

export default App;
