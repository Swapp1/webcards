/**
 * Calcule la luminosité perçue d'une couleur (0-255)
 */
function getLuminance(hex: string): number {
	const cleanHex = hex.replace('#', '');
	const rgb = cleanHex.length === 8 
		? cleanHex.slice(2) // ARGB -> RGB
		: cleanHex;
	
	const r = parseInt(rgb.slice(0, 2), 16);
	const g = parseInt(rgb.slice(2, 4), 16);
	const b = parseInt(rgb.slice(4, 6), 16);
	
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Retourne la couleur de texte optimale pour la lisibilité
 * @param bgColor - Couleur de fond en hex
 * @returns 'black' ou 'white'
 */
export function getTextColor(bgColor: string): 'black' | 'white' {
	return getLuminance(bgColor) > 128 ? 'black' : 'white';
}