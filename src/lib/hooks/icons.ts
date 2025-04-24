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



export function argbToRgba(argb: number | string): string {
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