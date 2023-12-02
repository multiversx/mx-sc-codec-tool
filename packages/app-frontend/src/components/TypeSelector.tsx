export interface TypeSelectorProps {
	types: string[];
	onSelect: (typeName: string) => void;
}

export default function TypeSelector({ types, onSelect }: TypeSelectorProps) {
	return (
		<>
			<select onChange={(e) => onSelect(e.target.value)}>
				{types.map((t, i) => (
					<option key={i} value={t}>
						{t}
					</option>
				))}
			</select>
		</>
	);
}
