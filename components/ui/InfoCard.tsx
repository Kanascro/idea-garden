type Props = {
    icon: React.ReactNode;
    title: string;
    body: string;
};

export function InfoCard({ icon, title, body }: Props) {
    return (
        <div className="h-full rounded-[2rem] border border-white/60 glass-panel p-5 shadow-neu">
            <div className="mb-3 inline-flex rounded-2xl border border-white/70 bg-white/65 p-3 shadow-neuSoft">
                {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 leading-7 text-ink/74">{body}</p>
        </div>
    );
}