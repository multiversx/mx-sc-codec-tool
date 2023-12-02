import { useRef } from "react";

export interface UploadProps {
	onUpload: (abiStr: string) => void;
}

function validateAbi(abiStr: string) {
	// TODO: @Laur this is only the most basic validation, it might not even be correct; needs improvement, but it's ok to stop people from uploading random json files
	try {
		let abi = JSON.parse(abiStr);

		if (typeof abi !== "object") return false;

		if (typeof abi.buildInfo !== "object") return false;
		if (
			!abi.buildInfo.rustc ||
			!abi.buildInfo.contractCrate ||
			typeof abi.buildInfo.framework !== "object"
		) {
			return false;
		}

		if (abi.buildInfo.framework.name !== "multiversx-sc") return false;
	} catch (e) {
		return false;
	}

	return true;
}

export default function Upload({ onUpload }: UploadProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	return (
		<>
			<input
				type="file"
				ref={fileInputRef}
				accept="application/json"
				style={{ display: "none" }}
				onChange={(e) => {
					if (e.target.files) {
						let file = e.target.files[0];

						let reader = new FileReader();

						reader.onload = (e) => {
							if (e.target) {
								let abiStr = e.target.result as string;

								if (validateAbi(abiStr)) {
									onUpload(abiStr);
								} else {
									alert("Invalid ABI format! Check the uploaded file.");
								}
							}
						};

						reader.readAsText(file);

						e.target.value = "";
					}
				}}
			/>
			<button onClick={() => fileInputRef.current?.click()}>Upload ABI</button>
		</>
	);
}
