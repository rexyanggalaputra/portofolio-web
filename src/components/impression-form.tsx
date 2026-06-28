"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquareHeart, Send } from "lucide-react";
import { useState } from "react";
import { FieldLabel, inputClass } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function ImpressionForm() {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{ displayName?: string; roleDivision?: string; impression?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const displayName = String(form.get("displayName") ?? "").trim();
    const roleDivision = String(form.get("roleDivision") ?? "").trim();
    const impression = String(form.get("impression") ?? "").trim();
    const nextErrors = {
      displayName: displayName ? undefined : "Name is required.",
      roleDivision: roleDivision ? undefined : "Role or division is required.",
      impression: impression ? undefined : "Impression is required.",
    };

    setErrors(nextErrors);
    if (nextErrors.displayName || nextErrors.roleDivision || nextErrors.impression) {
      setStatus("");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 700));
      const response = await fetch("/api/impressions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, roleDivision, impression }),
      });
      await minimumDelay;

      const payload = (await response.json().catch(() => null)) as { error?: string; impression?: { isPositive?: boolean } } | null;

      if (!response.ok) {
        setStatus(payload?.error ?? "Your impression could not be submitted yet. Please try again.");
        return;
      }

      formElement.reset();
      setStatus(
        payload?.impression?.isPositive
          ? "Thank you. Your impression has been saved and may appear in the testimonials section."
          : "Thank you. Your impression has been saved for Rexy.",
      );
    } catch {
      setStatus("Your impression could not be submitted yet. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050917] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-violet-300/35 bg-white/5 px-4 text-sm font-semibold text-slate-200 transition hover:border-violet-300/70 hover:text-white">
          <ArrowLeft className="size-4" /> Back to Portfolio
        </Link>
        <div className="mt-6 rounded-[28px] border border-violet-400/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(14,165,233,0.12))] p-6 shadow-glow sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-200">
              <MessageSquareHeart className="size-6" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Feedback Form</p>
              <h1 className="text-3xl font-bold">Give Your Impression to Rexy</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Share your impression after collaborating, learning, or working with Rexy. Your impressions may be selected to appear in the
            &nbsp;What Clients Say section.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-[#08111f]/75 p-5 sm:p-6">
            <div>
              <FieldLabel>Nama</FieldLabel>
              <input
                name="displayName"
                className={inputClass}
                placeholder="e.g. Analytics Team, Business User, or a nickname"
              />
              {errors.displayName ? <p className="mt-2 text-sm text-red-200">{errors.displayName}</p> : null}
            </div>
            <div>
              <FieldLabel>Role / Divisi</FieldLabel>
              <input
                name="roleDivision"
                className={inputClass}
                placeholder="e.g. Finance Team, Data Analyst, Student, Product Team"
              />
              {errors.roleDivision ? <p className="mt-2 text-sm text-red-200">{errors.roleDivision}</p> : null}
            </div>
            <div>
              <FieldLabel>Impression</FieldLabel>
              <textarea
                name="impression"
                rows={6}
                className={cn(inputClass, "py-3")}
                placeholder="e.g. Rexy was helpful in explaining insights, the dashboard was clear, and the collaboration felt smooth."
              />
              {errors.impression ? <p className="mt-2 text-sm text-red-200">{errors.impression}</p> : null}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-500 to-sky-500 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
            >
              {submitting ? "Submitting..." : "Submit Impression"} <Send className="size-4" />
            </button>
            {status ? <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">{status}</p> : null}
          </form>
        </div>
      </div>
    </main>
  );
}
