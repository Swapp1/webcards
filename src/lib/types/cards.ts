export type SwappsTypes = {
    detail: string;
    extras: {
        [key: string]: string | undefined;
        customIcon?: string;
        customName?: string;
        customTitle?: string;
    }
    groupId: string;
    help: string;
    hexColorCode: string;
    icon: string
    link: string;
    logo: string;
    title: string;
    type: string;
}