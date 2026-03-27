import { useEffect, useState } from "react";

export function useResponsiveFilters() {
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        function syncFiltersForScreen() {
            setFiltersOpen(window.innerWidth >= 1024);
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