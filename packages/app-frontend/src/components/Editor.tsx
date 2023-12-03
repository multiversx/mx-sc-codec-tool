import MonacoEditor from "@monaco-editor/react";

import type * as MonacoNs from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useRef } from "react";
type Monaco = typeof MonacoNs;

export interface EditorProps {
	onChange: (value: string | undefined) => void;
	onStartedChange: () => void;
	defaultValue: string;
	schema?: object;
}

function useDebounce<T extends (...args: any) => void>(
	func: T,
	firstInteraction: (() => void) | null,
	delay: number
): T {
	const stateRef = useRef<number | undefined>(undefined);
	return ((...args: any[]) => {
		if (stateRef.current !== undefined) {
			clearTimeout(stateRef.current);
		} else {
			firstInteraction?.();
		}

		stateRef.current = setTimeout(() => {
			clearTimeout(stateRef.current);
			stateRef.current = undefined;
			func(...args);
		}, delay);
	}) as T;
}

export default function Editor({ onChange, onStartedChange, defaultValue, schema }: EditorProps) {
	const monacoRef = useRef<Monaco | null>(null);

	const debouncedHandleChange = useDebounce(
		(value: string | undefined) => {
			onChange(value);
		},
		() => {
			onStartedChange();
		},
		500
	);

	function updateSchema(schema: object) {
		const monaco = monacoRef.current;
		if (!monaco) return;

		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			enableSchemaRequest: false,
			schemas: [
				{
					uri: "http://mx/root.json",
					fileMatch: ["*"],
					schema,
				},
			],
		});
	}

	useEffect(() => {
		if (schema) {
			updateSchema(schema);
		}
	}, [schema]);

	return (
		<>
			<MonacoEditor
				width="100%"
				height="800px"
				language="json"
				theme="vs-light"
				value={defaultValue}
				options={{
					minimap: {
						enabled: false,
					},
					lineNumbers: "off",
				}}
				onMount={(_editor, monaco) => {
					monacoRef.current = monaco;

					if (schema) {
						updateSchema(schema);
					}
				}}
				onChange={debouncedHandleChange}
			/>
		</>
	);
}
