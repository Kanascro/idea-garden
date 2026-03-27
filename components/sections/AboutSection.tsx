import { Bot, Compass, HeartHandshake, LibraryBig, Lightbulb, Sparkles } from "lucide-react";
import { InfoCard } from "../ui/InfoCard";

export function AboutSection() {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard
                icon={<LibraryBig className="h-5 w-5" />}
                title="What this is"
                body="A public collection of idea-notes."
            />
            <InfoCard
                icon={<HeartHandshake className="h-5 w-5" />}
                title="Use and reuse"
                body="No permission or credit required."
            />
            <InfoCard
                icon={<Sparkles className="h-5 w-5" />}
                title="AI assisted"
                body="These ideas and this website were clarified with Generative AI."
            />
            <InfoCard
                icon={<Compass className="h-5 w-5" />}
                title="Selective resonance"
                body="Some ideas may resonate strongly. Others may not."
            />
            <InfoCard
                icon={<Lightbulb className="h-5 w-5" />}
                title="Not truth"
                body="These are ideas, lenses, and possibilities."
            />
            <InfoCard
                icon={<Bot className="h-5 w-5" />}
                title="Possible contradictions"
                body="Some notes may contradict each other."
            />
        </section>
    );
}