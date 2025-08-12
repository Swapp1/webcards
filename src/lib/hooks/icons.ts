export function getIcons(title: string) {
    const lightIcons = import.meta.glob('$lib/assets/light-icons/*.svg', { eager: true });
    const darkIcons = import.meta.glob('$lib/assets/dark-icons/*.svg', { eager: true });

    const titleKey = title.split(' ').join('_').toLocaleLowerCase()

    const lightIconKey = Object.keys(lightIcons).find((key) =>
        key.includes(titleKey)
    );
    const darkIconKey = Object.keys(darkIcons).find((key) =>
        key.includes(titleKey)
    );


    let light: string = '';
    let dark: string = '';

    if (lightIconKey) {
        light = (lightIcons[lightIconKey] as { default: string }).default;
    }

    if (darkIconKey) {
        dark = (darkIcons[darkIconKey] as { default: string }).default;
    }

    return [light, dark];
}


export function getAllIcons() {
    const icons = import.meta.glob('$lib/assets/svg/*.svg', { eager: true });

    return Object.values(icons).map(icon => (icon as { default: string }).default)

}



export function argbToHex(argb: number | string): string {
    // If argb is a number (e.g., 0xAARRGGBB)
    if (typeof argb === 'number') {
        const alpha = ((argb >> 24) & 0xFF).toString(16).padStart(2, '0');
        const red = ((argb >> 16) & 0xFF).toString(16).padStart(2, '0');
        const green = ((argb >> 8) & 0xFF).toString(16).padStart(2, '0');
        const blue = (argb & 0xFF).toString(16).padStart(2, '0');

        return `#${red}${green}${blue}${alpha}`;
    }

    // If argb is a string with # prefix (#AARRGGBB)
    if (typeof argb === 'string' && argb.startsWith('#') && argb.length === 9) {
        const alpha = argb.substring(1, 3);
        const red = argb.substring(3, 5);
        const green = argb.substring(5, 7);
        const blue = argb.substring(7, 9);

        return `#${red}${green}${blue}${alpha}`;
    }

    // If argb is a string with 0x prefix (0xAARRGGBB)
    if (typeof argb === 'string' && argb.startsWith('0x') && argb.length === 10) {
        const alpha = argb.substring(2, 4);
        const red = argb.substring(4, 6);
        const green = argb.substring(6, 8);
        const blue = argb.substring(8, 10);

        return `#${red}${green}${blue}${alpha}`;
    }

    return '#FFFFFF'

}

export function hexToRgba(hex: string, opacity?: number): string {
    let r = 255, g = 255, b = 255, a = 1;

    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16) / 255;
    } else {
        // Invalid hex, fallback to white
        return 'rgba(255,255,255,1)';
    }

    if (typeof opacity === 'number') {
        a = opacity;
    }

    return `rgba(${r},${g},${b},${a})`;
}