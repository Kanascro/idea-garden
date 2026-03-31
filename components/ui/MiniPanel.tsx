type Props = {
    title: string;
    children: React.ReactNode;
};

export function MiniPanel({ title, children }: Props) {
    return (
        <div className="theme-panel-strong rounded-[1.6rem] border p-4 shadow-neuSoft">
            <h4 className="theme-text text-base font-semibold">{title}</h4>
            <p className="theme-text-soft mt-2 text-sm leading-7">{children}</p>
        </div>
    );
}