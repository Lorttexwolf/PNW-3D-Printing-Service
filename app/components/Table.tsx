import { DetailedHTMLProps, TableHTMLAttributes } from "react";

export default function Table(
	props: DetailedHTMLProps<
		TableHTMLAttributes<HTMLTableElement>,
		HTMLTableElement
	>
): JSX.Element {
	return (
		<div
			{...props}
			className={`w-full overflow-x-auto ${props.className}`}>
			<table className={`w-full ${props.className}`}>{props.children}</table>
		</div>
	);
}
