import { db } from "$lib/config/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment, serverTimestamp, type FieldValue } from "firebase/firestore";
import { browser } from "$app/environment";

// Get today's date in YYYY-MM-DD format
const getDateKey = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Get or create a unique viewer ID stored in localStorage
export const getViewerId = (): string => {
    if (!browser) return '';

    const VIEWER_ID_KEY = 'swapp_viewer_id';
    let viewerId = localStorage.getItem(VIEWER_ID_KEY);

    if (!viewerId) {
        viewerId = `web_${crypto.randomUUID()}`;
        localStorage.setItem(VIEWER_ID_KEY, viewerId);
    }

    return viewerId;
};

// Check if the viewer is the card owner (don't track self-views)
const isSelfView = (cardOwnerId: string | undefined, viewerId: string): boolean => {
    if (!cardOwnerId) return false;
    return cardOwnerId === viewerId;
};

// Initialize card stats document if it doesn't exist
const initializeCardStats = async (cardId: string, cardOwnerId: string) => {
    const statsRef = doc(db, 'card_stats', cardId);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
        await setDoc(statsRef, {
            cardOwnerId,
            totalViews: 0,
            totalClicks: 0,
            totalSaves: 0,
            uniqueViewers: 0,
            clicksByType: {},
            viewerIds: [],
            dailyStats: {},
            dailyClicksByType: {},
            lastViewedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    return statsRef;
};

// Track card view
export const trackCardView = async (
    cardId: string,
    cardOwnerId: string | undefined,
    cardType: string,
    cardOwnerName: string
) => {
    if (!browser) return;

    const viewerId = getViewerId();
    if (!viewerId || !cardOwnerId) return;

    // Don't track self-views
    if (isSelfView(cardOwnerId, viewerId)) return;

    try {
        const statsRef = await initializeCardStats(cardId, cardOwnerId);
        const statsDoc = await getDoc(statsRef);
        const dateKey = getDateKey();

        const existingData = statsDoc.data();
        const isNewViewer = !existingData?.viewerIds?.includes(viewerId);

        // Prepare daily stats update
        const dailyStatsUpdate: Record<string, FieldValue> = {
            [`dailyStats.${dateKey}.views`]: increment(1)
        };

        if (isNewViewer) {
            dailyStatsUpdate[`dailyStats.${dateKey}.newContacts`] = increment(1);
        }

        // Update the stats document
        await updateDoc(statsRef, {
            totalViews: increment(1),
            ...(isNewViewer && {
                uniqueViewers: increment(1),
                viewerIds: arrayUnion(viewerId)
            }),
            ...dailyStatsUpdate,
            lastViewedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Also log to Firebase Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'viewed_card', {
                card_id: cardId,
                viewer_id: viewerId,
                card_owner_id: cardOwnerId,
                card_owner_name: cardOwnerName,
                card_type: cardType
            });
        }
    } catch (error) {
        console.error('Error tracking card view:', error);
    }
};

// Track content click (link, social, etc.)
export const trackContentClick = async (
    cardId: string,
    cardOwnerId: string | undefined,
    contentType: string,
    cardType: string,
    cardOwnerName: string
) => {
    if (!browser) return;

    const viewerId = getViewerId();
    if (!viewerId || !cardOwnerId) return;

    // Don't track self-clicks
    if (isSelfView(cardOwnerId, viewerId)) return;

    try {
        const statsRef = doc(db, 'card_stats', cardId);
        const dateKey = getDateKey();

        // Normalize content type (lowercase, no spaces)
        const normalizedType = contentType.toLowerCase().replace(/\s+/g, '_');

        await updateDoc(statsRef, {
            totalClicks: increment(1),
            [`clicksByType.${normalizedType}`]: increment(1),
            [`dailyStats.${dateKey}.clicks`]: increment(1),
            [`dailyClicksByType.${dateKey}.${normalizedType}`]: increment(1),
            updatedAt: serverTimestamp()
        });

        // Also log to Firebase Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'card_content_clicked', {
                card_id: cardId,
                viewer_id: viewerId,
                card_owner_id: cardOwnerId,
                card_owner_name: cardOwnerName,
                card_type: cardType,
                card_content_type: normalizedType
            });
        }
    } catch (error) {
        console.error('Error tracking content click:', error);
    }
};

// Track contact save
export const trackContactSave = async (
    cardId: string,
    cardOwnerId: string | undefined,
    cardType: string,
    cardOwnerName: string
) => {
    if (!browser) return;

    const viewerId = getViewerId();
    if (!viewerId || !cardOwnerId) return;

    // Don't track self-saves
    if (isSelfView(cardOwnerId, viewerId)) return;

    try {
        const statsRef = doc(db, 'card_stats', cardId);
        const dateKey = getDateKey();

        await updateDoc(statsRef, {
            totalSaves: increment(1),
            [`dailyStats.${dateKey}.saves`]: increment(1),
            updatedAt: serverTimestamp()
        });

        // Also log to Firebase Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'save_contact_to_device', {
                card_id: cardId,
                viewer_id: viewerId,
                card_owner_id: cardOwnerId,
                card_owner_name: cardOwnerName,
                card_type: cardType
            });
        }
    } catch (error) {
        console.error('Error tracking contact save:', error);
    }
};
