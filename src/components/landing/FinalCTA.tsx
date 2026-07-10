import Link from "next/link";
import { LandingButton } from "./LandingButton";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full h-[400px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/20 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-[720px] flex-col items-center px-6 py-24 text-center sm:py-32">
        <h2 className="text-balance text-3xl font-bold tracking-[-1px] text-white sm:text-5xl">
          Ready to Level Up?
        </h2>

        <LandingButton href="/register" className="mt-10">
          Start Your Journey — Free
        </LandingButton>

        <p className="mt-6 text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white/80 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
