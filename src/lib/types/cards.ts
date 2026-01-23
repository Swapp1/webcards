import type { CardStyleType } from '$lib/config/card-styles';

export type SwappsTypes = {
    detail: string;
    extras: {
        [key: string]: string | undefined;
        customIcon?: string;
        customName?: string;
        customTitle?: string;
        countryCode?: string;
        linkName?: string;
        attachmentFilePath?: string;
        attachmentThumbnail?: string;
    }
    groupId: string;
    help: string;
    hexColorCode: string;
    icon: string;
    link: string;
    logo: string;
    title: string;
    type: string;
}

export type CardType = 'personal' | 'professional';
export type ProfessionalCardType = 'staff' | 'jobSeeker' | 'student';

export interface CardData {
    // Identity
    personalizedLink: string;
    displayName: string;
    profilePicture: string;
    heading: string;

    // Type
    type: CardType;
    professionalCardType?: ProfessionalCardType;

    // Style
    cardStyleType?: CardStyleType;
    cardDesignType?: 'centered' | 'default';
    cardColor?: string;

    // Professional info
    jobTitle?: string;
    company?: string;
    companyLogo?: string;
    companyLink?: string;

    // Student info
    schoolName?: string;
    schoolMajor?: string;

    // Additional info
    bio?: string;
    keySkills?: string[];

    // Content
    swapps: SwappsTypes[];
}
