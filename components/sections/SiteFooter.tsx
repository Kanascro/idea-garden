"use client";

import { Github, Heart, Linkedin, Coffee, BookHeart } from "lucide-react";

type ThemeName = "light" | "dark" | "rainbow";

type Props = {
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
};

const themeOptions: {
    value: ThemeName;
    label: string;
    swatchClass: string;
}[] = [
        {
            value: "light",
            label: "Light theme",
            swatchClass:
                "bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(236,242,255,0.95)_45%,rgba(245,240,255,0.95)_100%)]",
        },
        /*{
            value: "dark",
            label: "Dark theme",
            swatchClass:
                "bg-[linear-gradient(135deg,rgb(15,23,42)_0%,rgb(30,41,59)_45%,rgb(51,65,85)_100%)]",
        },
        {
            value: "rainbow",
            label: "Rainbow theme",
            swatchClass:
                "bg-[linear-gradient(135deg,rgb(255,214,224)_0%,rgb(255,236,179)_22%,rgb(214,245,214)_45%,rgb(209,233,255)_68%,rgb(232,214,255)_100%)]",
        },*/
    ];

function FooterLink({
    href,
    children,
    icon,
}: {
    href: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-sm text-ink/78 shadow-neuSoft transition hover:bg-white"
        >
            {icon}
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>
        </a>
    );
}

export function SiteFooter({ theme, onThemeChange }: Props) {
    return (
        <footer className="rounded-[1.8rem] border border-white/60 glass-panel px-4 py-3 shadow-neu sm:px-5 sm:py-3.5">
            <div className="flex flex-col gap-3 sm:gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink/72">
                    <p className="inline-flex items-center gap-1.5">
                        <span>Made with</span>
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <span>by</span>
                        <a
                            href="https://www.linkedin.com/in/marianne-perreault/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-ink transition hover:text-ink/80"
                        >
                            Marianne Perreault
                        </a>
                    </p>

                    <span className="hidden text-ink/30 lg:inline">•</span>

                    <p className="text-ink/62">
                        Open to collaborations.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 justify-end">
                    <div className="flex items-center gap-2 pr-1">
                        {themeOptions.map((option) => {
                            const active = theme === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onThemeChange(option.value)}
                                    aria-label={option.label}
                                    title={option.label}
                                    className={`h-6 w-6 rounded-full border transition ${active
                                        ? "scale-100 border-white shadow-neuSoft ring-2 ring-white/70"
                                        : "border-white/60 hover:scale-[1.04] hover:border-white/90"
                                        } ${option.swatchClass}`}
                                />
                            );
                        })}
                    </div>

                    <FooterLink href="https://github.com/Kanascro/idea-garden/">
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                    </FooterLink>

                    <FooterLink href="https://www.linkedin.com/in/marianne-perreault/">
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                    </FooterLink>

                    <FooterLink href="https://ko-fi.com/marianneperreault">
                        <Coffee className="h-3.5 w-3.5" />
                        Donate
                    </FooterLink>

                    <FooterLink href="https://unlicense.org/">
                        <BookHeart className="h-3.5 w-3.5" />
                        Unlicense
                    </FooterLink>
                </div>
            </div>
        </footer>
    );
}