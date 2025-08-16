import React, { useMemo, useState } from "react";
import { skills } from "../data/skills";
import { Skill, SkillCategory } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PixelIcon } from "./PixelIcon";

const categories: SkillCategory[] = [
  "Web Development",
  "Backend & APIs",
  "Tools & Platforms",
  "Other",
];

function SkillModal({
  skill,
  open,
  setOpen,
}: {
  skill: Skill;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <PixelIcon label={skill.name} />
            <div>
              <DialogTitle>{skill.name}</DialogTitle>
              <DialogDescription>{skill.category}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div>
            <h5 className="text-sm font-semibold text-gray-900">What it is</h5>
            <p className="mt-1 text-gray-700">{skill.description}</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-gray-900">My experience</h5>
            <p className="mt-1 text-gray-700">{skill.experience}</p>
          </div>
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900">
            Highlight: I enjoy pairing cozy, game‑inspired UI touches with solid engineering
            practices for approachable, reliable software.
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
            >
              <Button variant="secondary">Work with me</Button>
            </a>
            <DialogClose>Close</DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SkillCard({ skill, onOpen }: { skill: Skill; onOpen: () => void }) {
  return (
    <Card className="group hover:translate-y-[-2px] transition-transform duration-200">
      <CardHeader className="flex items-center gap-3">
        <div className="shrink-0">
          <PixelIcon label={skill.name} />
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate">{skill.name}</CardTitle>
          <p className="text-xs text-green-700">{skill.category}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3">
          {skill.description}
        </p>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={onOpen}>
                Learn more
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const byCategory = useMemo(() => {
    const map: Record<SkillCategory, Skill[]> = {
      "Web Development": [],
      "Backend & APIs": [],
      "Tools & Platforms": [],
      "Other": [],
    };
    for (const s of skills) map[s.category].push(s);
    return map;
  }, []);

  const current = skills.find((s) => s.id === active) || null;

  return (
    <section id="skills" className="w-full">
      <div className="section-container py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900">
            Skills that feel like home
          </h2>
          <p className="mt-3 text-gray-700">
            A blend of modern web fundamentals and back‑of‑house craftsmanship.
            Click any card to open a cozy info modal.
          </p>
        </div>

        <div className="mt-10 space-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-xl font-semibold text-green-800 mb-4">{cat}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {byCategory[cat].map((skill) => (
                  <div key={skill.id}>
                    <SkillCard
                      skill={skill}
                      onOpen={() => setActive(skill.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {current && (
          <SkillModal
            skill={current}
            open={Boolean(current)}
            setOpen={(o) => !o ? setActive(null) : void 0}
          />
        )}
      </div>
    </section>
  );
}