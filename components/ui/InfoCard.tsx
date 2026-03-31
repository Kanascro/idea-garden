type Props = {
    icon: React.ReactNode;
    title: string;
    body: string;
};

export function InfoCard({ icon, title, body }: Props) {
    return (
        <div className="theme-panel h-full rounded-[2rem] border p-5 shadow-neu">
            <div className="theme-panel-strong mb-3 inline-flex rounded-2xl border p-3 shadow-neuSoft">
                {icon}
            </div>
            <h3 className="theme-text text-xl font-semibold">{title}</h3>
            <p className="theme-text-soft mt-2 leading-7">{body}</p>
        </div>
    );
}