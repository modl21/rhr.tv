import { useSeoMeta } from '@unhead/react';
import {
  Podcast,
  Bitcoin,
  Radio,
  Video,
  MonitorPlay,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonateDialog } from '@/components/DonateDialog';
import { TopSupporters } from '@/components/TopSupporters';
import { BetTracker } from '@/components/BetTracker';

const LINKS = {
  podcast: 'https://www.fountain.fm/show/VDaMppQRUBZioj2XkaLn',
  nostrFeed: 'https://primal.net/rhr',
  odellNostr: 'https://primal.net/odell',
  martyNostr: 'https://primal.net/marty',
  stream: 'https://rhr.tv/stream',
  twitch: 'https://www.twitch.tv/rabbitholerecap',
  youtube: 'https://www.youtube.com/@TFTC/',
  logo: '/rhrb.webp',
};

function HeroSection() {
  const weeks = Math.floor(
    (Date.now() - new Date('2018-08-27').getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Small label */}
        <div className="animate-fade-in-up mb-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
          <span className="h-px w-8 bg-border" />
          <span>Est. 2018</span>
          <span className="h-px w-8 bg-border" />
        </div>

        {/* Logo */}
        <div className="animate-fade-in-up animation-delay-100 mb-10">
          <img
            src={LINKS.logo}
            alt="Rabbit Hole Recap"
            className="h-28 w-28 rounded-full object-cover ring-1 ring-border sm:h-32 sm:w-32"
          />
        </div>

        {/* Title */}
        <h1 className="serif animate-fade-in-up animation-delay-200 mb-5 text-4xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Rabbit Hole<br />
          <span className="italic accent-text">Recap</span>
        </h1>

        {/* Tagline */}
        <p className="animate-fade-in-up animation-delay-300 mb-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Bitcoin &amp; freedom tech, weekly. Hosted by{' '}
          <a
            href={LINKS.odellNostr}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            ODELL
          </a>{' '}
          &amp;{' '}
          <a
            href={LINKS.martyNostr}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Marty Bent
          </a>
          .
        </p>

        {/* Streak badge */}
        <div className="animate-fade-in-up animation-delay-400 mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs tracking-wide text-muted-foreground backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent))] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          </span>
          <span className="tabular-nums">{weeks}</span>
          <span className="text-muted-foreground/70">weeks in a row</span>
        </div>

        {/* Primary actions */}
        <div className="animate-fade-in-up animation-delay-400 mb-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <DonateDialog>
            <Button
              size="lg"
              className="h-11 w-full rounded-full bg-[hsl(var(--accent))] px-7 text-sm font-medium text-[hsl(var(--accent-foreground))] transition-colors hover:bg-[hsl(var(--accent))]/90 sm:w-auto"
            >
              <Bitcoin className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Support with Bitcoin
            </Button>
          </DonateDialog>
          <Button
            asChild
            size="lg"
            className="h-11 w-full rounded-full border border-sky-300 bg-sky-300 px-7 text-sm font-medium text-[hsl(var(--accent))] transition-colors hover:bg-sky-200 hover:text-[hsl(var(--accent))] sm:w-auto"
          >
            <a href={LINKS.podcast} target="_blank" rel="noopener noreferrer">
              <Podcast className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Listen to podcast
            </a>
          </Button>
        </div>

        {/* Top supporters */}
        <div className="animate-fade-in-up animation-delay-500 mb-10">
          <TopSupporters />
        </div>

        <QuickLinks />
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    { label: 'Nostr', href: LINKS.nostrFeed, icon: Radio, gold: true },
    { label: 'Twitch', href: LINKS.twitch, icon: MonitorPlay },
    { label: 'YouTube', href: LINKS.youtube, icon: Video },
  ];

  return (
    <div className="animate-fade-in-up animation-delay-500 flex w-full items-center justify-center gap-2 sm:gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            link.gold
              ? "group inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--accent))] px-4 py-2 text-xs font-medium text-[hsl(var(--accent-foreground))] transition-all duration-200 hover:bg-[hsl(var(--accent))]/90"
              : "group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-border/80 hover:bg-card hover:text-foreground"
          }
        >
          <link.icon
            className={
              link.gold
                ? "h-3.5 w-3.5 text-[hsl(var(--accent-foreground))]"
                : "h-3.5 w-3.5 text-muted-foreground/60 transition-colors group-hover:text-[hsl(var(--accent))]"
            }
            strokeWidth={1.75}
          />
          {link.label}
        </a>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <img
            src={LINKS.logo}
            alt="Rabbit Hole Recap"
            className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
          />
          <span className="serif text-sm tracking-tight text-foreground/90">rhr.tv</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a
            href={LINKS.podcast}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Podcast
          </a>
          <a
            href={LINKS.nostrFeed}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Nostr
          </a>
          <a
            href={LINKS.twitch}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Twitch
          </a>
          <a
            href={LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            YouTube
          </a>
          <DonateDialog className="inline">
            <button className="cursor-pointer transition-colors hover:text-foreground">
              Donate
            </button>
          </DonateDialog>
        </nav>

        <div className="text-[11px] text-muted-foreground/50">
          Vibed with{' '}
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Shakespeare
          </a>
        </div>
      </div>
    </footer>
  );
}

const Index = () => {
  useSeoMeta({
    title: 'RHR — Rabbit Hole Recap',
    description: 'This Week in Bitcoin and Freedom Tech with ODELL and Marty Bent.',
    ogTitle: 'RHR — Rabbit Hole Recap',
    ogDescription: 'This Week in Bitcoin and Freedom Tech with ODELL and Marty Bent.',
    ogImage: 'https://rhr.tv/rhrb.webp',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'RHR — Rabbit Hole Recap',
    twitterDescription: 'This Week in Bitcoin and Freedom Tech with ODELL and Marty Bent.',
    twitterImage: 'https://rhr.tv/rhrb.webp',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <div className="mx-auto h-px w-full max-w-3xl hairline" />
      <BetTracker />
      <Footer />
    </div>
  );
};

export default Index;
