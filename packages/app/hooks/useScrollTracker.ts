import { useCallback, useRef, useState } from 'react';
import {
    type LayoutChangeEvent,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    type ScrollView,
    useWindowDimensions,
} from 'react-native';

export interface UseScrollTrackerReturn {
    /** Attach to ScrollView's onScroll */
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Returns an onLayout handler for a given section id */
    getSectionLayoutHandler: (id: string) => (event: LayoutChangeEvent) => void;
    /** Scroll to a section by id */
    scrollToSection: (id: string) => void;
    /** Currently active section id */
    activeId: string | null;
    /** Ref to attach to ScrollView */
    scrollViewRef: React.RefObject<ScrollView>;
}

/**
 * Pure algorithm to determine which section is currently active based on
 * scroll position. Finds the last section whose y offset is at or above
 * the scroll position plus a viewport margin.
 *
 * @param sectionOffsets - Map of section ID to y offset
 * @param sectionIds - Ordered list of section IDs (determines priority order)
 * @param scrollY - Current vertical scroll offset
 * @param viewportMargin - Pixel margin added to scrollY for early activation
 * @returns The active section ID, or null if none qualifies
 */
export function findActiveSection(
    sectionOffsets: Map<string, number>,
    sectionIds: string[],
    scrollY: number,
    viewportMargin: number,
): string | null {
    const threshold = scrollY + viewportMargin;
    let activeId: string | null = null;

    for (const id of sectionIds) {
        const offset = sectionOffsets.get(id);
        if (offset === undefined) continue;
        if (offset <= threshold) {
            activeId = id;
        }
    }

    return activeId;
}

/** Default padding subtracted from the section offset before scrolling */
export const SCROLL_PADDING = 20;

/**
 * Compute the scroll-to y value for a given section ID. Returns the
 * clamped offset (offset − padding, min 0) or null if the section is
 * not found in the offsets map.
 *
 * @param sectionOffsets - Map of section ID to y offset
 * @param id - The section ID to scroll to
 * @param scrollPadding - Pixels subtracted so the heading isn't hidden
 * @returns The y value to scroll to, or null if the section is unknown
 */
export function computeScrollTarget(
    sectionOffsets: Map<string, number>,
    id: string,
    scrollPadding: number = SCROLL_PADDING,
): number | null {
    const offset = sectionOffsets.get(id);
    if (offset === undefined) return null;
    return Math.max(0, offset - scrollPadding);
}

/**
 * Hook that tracks scroll position and section layouts to determine
 * which section is currently visible. Provides scroll-to-section
 * functionality and active section highlighting.
 *
 * @param sectionIds - Ordered list of section IDs to track
 */
export function useScrollTracker(sectionIds: string[]): UseScrollTrackerReturn {
    const sectionOffsets = useRef<Map<string, number>>(new Map());
    const scrollViewRef = useRef<ScrollView>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const { height: viewportHeight } = useWindowDimensions();

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const scrollY = event.nativeEvent.contentOffset.y;
            const margin = viewportHeight * 0.2;

            const newActiveId = findActiveSection(
                sectionOffsets.current,
                sectionIds,
                scrollY,
                margin,
            );

            setActiveId(newActiveId);
        },
        [sectionIds, viewportHeight],
    );

    const getSectionLayoutHandler = useCallback(
        (id: string) => (event: LayoutChangeEvent) => {
            sectionOffsets.current.set(id, event.nativeEvent.layout.y);
        },
        [],
    );

    const scrollToSection = useCallback((id: string) => {
        if (!scrollViewRef.current) return;

        const y = computeScrollTarget(sectionOffsets.current, id);
        if (y === null) return;

        scrollViewRef.current.scrollTo({ y, animated: true });
    }, []);

    return {
        handleScroll,
        getSectionLayoutHandler,
        scrollToSection,
        activeId,
        scrollViewRef,
    };
}
