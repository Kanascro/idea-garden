import { useEffect, useState } from "react";

export function useResponsiveFilters() {
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        function syncFiltersForScreen() {
            if (window.innerWidth >= 1024) {
                setFiltersOpen(true);
            }
        }

        syncFiltersForScreen();
        window.addEventListener("resize", syncFiltersForScreen);

        return () => window.removeEventListener("resize", syncFiltersForScreen);
    }, []);

    return {
        filtersOpen,
        setFiltersOpen,
    };
}