"use client";

import { Github, Heart, Linkedin, Coffee, BookHeart } from "lucide-react";

type ThemeName = "light" | "dark";

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
        {
            value: "dark",
            label: "Dark theme",
            swatchClass:
                "bg-[linear-gradient(135deg,rgb(15,23,42)_0%,rgb(30,41,59)_45%,rgb(51,65,85)_100%)]",
        },
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
            className="theme-panel-strong theme-text-soft inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm shadow-neuSoft transition hover:bg-[var(--surface-strong)]"
            style={{ borderColor: "var(--panel-border)" }}
        >
            {icon}
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>
        </a>
    );
}

export function SiteFooter({ theme, onThemeChange }: Props) {
    return (
        <footer
            className="glass-panel rounded-[1.8rem] border px-4 py-3 shadow-neu sm:px-5 sm:py-3.5"
            style={{ borderColor: "var(--panel-border)" }}
        >
            <div className="flex flex-col gap-3 sm:gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="theme-text-soft flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                    <p className="inline-flex items-center gap-1.5">
                        <span>Made with</span>
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <span>by</span>
                        <a
                            href="https://www.linkedin.com/in/marianne-perreault/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-text font-medium transition hover:opacity-80"
                        >
                            Marianne Perreault
                        </a>
                    </p>

                    <span className="theme-text-faint lg:inline">•</span>

                    <p className="theme-text-soft">
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
                                        ? "scale-100 shadow-neuSoft ring-2 ring-[var(--accent-border)]"
                                        : "hover:scale-[1.04]"
                                        } ${option.swatchClass}`}
                                    style={{
                                        borderColor: active ? "rgba(255,255,255,0.75)" : "var(--panel-border)",
                                    }}
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
                        Contribute
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