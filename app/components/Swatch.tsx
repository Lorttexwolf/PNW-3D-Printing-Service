import { useState } from "react";
import Filament from "../Types/Filament/Filament";
import classNames from "classnames";

export type SwatchConfiguration = {
	name: string;
	monoColor?: string;
	diColor?: {
		colorA: string;
		colorB: string;
	};
};

export function templatePNW(): SwatchConfiguration {
	return {
		name: "PNW Gold",
		monoColor: "#b1810b"
	};
}

export function validateColors(swatch: SwatchConfiguration): void {
	if (swatch?.name == undefined) {
		throw new TypeError("Swatch name cannot be undefined!");
	}
	if (swatch?.monoColor == undefined && swatch?.diColor == undefined) {
		throw new TypeError("Swatch must contain either a mono or di color!");
	}
}

export function formatToCSSGradient(
	swatch: SwatchConfiguration,
	degree?: number
): string {
	degree = degree ?? 90;

	if (swatch?.diColor == undefined) {
		throw new TypeError("Swatch must be a diColor!");
	}
	return `linear-gradient(${degree}deg, ${swatch.diColor!.colorA} 0%, ${swatch.diColor.colorB} 100%)`;
}

export function getSingleColor(swatch: SwatchConfiguration): string {
	return swatch.monoColor ?? swatch.diColor!.colorA;
}

export function isGradient(swatch: SwatchConfiguration): boolean {
	return (
		swatch.diColor?.colorA != undefined &&
		swatch.diColor?.colorB != undefined
	);
}

export function NamedSwatch({ swatch, style }: { swatch: SwatchConfiguration, style: "compact" | "long" }) {
	validateColors(swatch);

	return (
		<span className="bg-transparent">
			<span className="text-inherit mr-2">{swatch.name}</span>
			<Swatch swatch={swatch} style={style}></Swatch>
		</span>
	);
}

export function Swatch({ swatch, style }: { swatch: SwatchConfiguration, style: "compact" | "long" }) {
	validateColors(swatch);

	return (
		<span
			className={classNames("inline-block h-2.5 shadow-sm rounded-md outline outline-gray-200", {
				"w-2.5": style == "compact",
				"w-12": style == "long"
			})}
			style={{
				outlineWidth: "3px",
				backgroundColor: swatch.monoColor,
				backgroundImage:
					swatch.diColor != undefined
						? formatToCSSGradient(swatch)
						: undefined
			}}></span>
	);
}

export function SwatchColorBlock({ swatch }: { swatch: SwatchConfiguration }) {
	return <div>
		<div className="w-auto h-8 out" style={{
			backgroundColor: swatch.monoColor,
			backgroundImage:
				swatch.diColor != undefined
					? formatToCSSGradient(swatch)
					: undefined
		}} />
		<span className="text-sm px-1 text-nowrap">{swatch.name}</span>
	</div>
}