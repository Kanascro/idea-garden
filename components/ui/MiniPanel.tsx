type Props = {
    title: string;
    children: React.ReactNode;
};

export function MiniPanel({ title, children }: Props) {
    return (
        <div className="rounded-[1.6rem] border border-white/60 bg-white/62 p-4 shadow-neuSoft">
            <h4 className="text-base font-semibold">{title}</h4>
            <p className="mt-2 text-sm leading-7 text-ink/72">{children}</p>
        </div>
    );
}