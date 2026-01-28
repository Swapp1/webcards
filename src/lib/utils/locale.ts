import { browser } from '$app/environment';

export type SupportedLocale = 'en' | 'fr' | 'es';

export function getBrowserLocale(): SupportedLocale {
	if (!browser) return 'en';

	const lang = navigator.language.toLowerCase().split('-')[0];

	if (lang === 'fr') return 'fr';
	if (lang === 'es') return 'es';
	return 'en';
}

// Lead Capture Sheet translations
export const leadCaptureTranslations = {
	en: {
		title: 'Share your contact',
		subtitle: 'Send to',
		namePlaceholder: 'Your Name',
		emailPlaceholder: 'Email',
		phonePlaceholder: 'Phone number',
		jobPlaceholder: 'Your job',
		submitButton: 'Connect',
		submitting: 'Sending...',
		error: 'An error occurred. Please try again.'
	},
	fr: {
		title: 'Partagez votre contact',
		subtitle: 'Envoyer a',
		namePlaceholder: 'Votre Nom',
		emailPlaceholder: 'Email',
		phonePlaceholder: 'Numero de telephone',
		jobPlaceholder: 'Votre poste',
		submitButton: 'Connect',
		submitting: 'Envoi...',
		error: 'Une erreur est survenue. Veuillez reessayer.'
	},
	es: {
		title: 'Comparte tu contacto',
		subtitle: 'Enviar a',
		namePlaceholder: 'Tu Nombre',
		emailPlaceholder: 'Email',
		phonePlaceholder: 'Numero de telefono',
		jobPlaceholder: 'Tu trabajo',
		submitButton: 'Connect',
		submitting: 'Enviando...',
		error: 'Ocurrio un error. Por favor, intentalo de nuevo.'
	}
};

// Action Bar translations
export const actionBarTranslations = {
	en: {
		addToContacts: 'Add to Contacts',
		shareMyInfo: 'Share my Info',
		createFreeCard: 'Create my free card',
		poweredBy: 'Powered by',
		saveContact: 'Save Contact',
		save: 'Save',
		connect: 'Connect'
	},
	fr: {
		addToContacts: 'Ajouter aux Contacts',
		shareMyInfo: 'Partager mes infos',
		createFreeCard: 'Creer ma carte gratuite',
		poweredBy: 'Propulse par',
		saveContact: 'Enregistrer le Contact',
		save: 'Enregistrer',
		connect: 'Connect'
	},
	es: {
		addToContacts: 'Agregar a Contactos',
		shareMyInfo: 'Compartir mi info',
		createFreeCard: 'Crear mi tarjeta gratis',
		poweredBy: 'Desarrollado por',
		saveContact: 'Guardar Contacto',
		save: 'Guardar',
		connect: 'Connect'
	}
};

// Footer translations
export const footerTranslations = {
	en: {
		poweredBy: 'Powered by'
	},
	fr: {
		poweredBy: 'Propulse par'
	},
	es: {
		poweredBy: 'Desarrollado por'
	}
};

export function getLeadCaptureTexts() {
	const locale = getBrowserLocale();
	return leadCaptureTranslations[locale];
}

export function getActionBarTexts() {
	const locale = getBrowserLocale();
	return actionBarTranslations[locale];
}

export function getFooterTexts() {
	const locale = getBrowserLocale();
	return footerTranslations[locale];
}
