import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Flame,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  Trophy,
  ScrollText,
  Landmark,
  ShieldCheck,
  Vote,
  HardDrive,
  Users,
  Bitcoin,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bet {
  id: string;
  title: string;
  description: string;
  proposedBy: 'ODELL' | 'Marty';
  against: 'ODELL' | 'Marty';
  amount: string;
  odds: string;
  /** Who gets the favorable odds (null/undefined = even odds) */
  oddsHolder?: 'ODELL' | 'Marty';
  oddsExplainer: string;
  deadline: string;
  deadlineDate: Date;
  status: 'active' | 'settled';
  winner?: 'ODELL' | 'Marty' | 'wash';
  /** Sats collected by the winner (for settled bets) */
  satsWon?: number;
  icon: typeof Flame;
}

function formatSats(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toString();
}

const BETS: Bet[] = [
  // ── Active bets ──
  {
    id: 'iran-ceasefire',
    title: 'Iran Ceasefire',
    description: '5 days of ceasefire in Iran by April 21 — called a wash, terms were not clear enough',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '2:1',
    oddsHolder: 'Marty',
    oddsExplainer: 'No payout — bet called off',
    deadline: 'April 21, 2026 23:59 UTC',
    deadlineDate: new Date('2026-04-21T23:59:00Z'),
    status: 'settled',
    winner: 'wash',
    satsWon: 0,
    icon: Target,
  },
  {
    id: 'btc-ath-gold-silver',
    title: 'BTC ATH in Gold & Silver',
    description: 'Bitcoin hits new all-time highs priced in gold and silver by end of 2026',
    proposedBy: 'ODELL',
    against: 'Marty',
    amount: '100,000 sats',
    odds: '2:1',
    oddsHolder: 'ODELL',
    oddsExplainer: 'ODELL wins 200k if BTC hits ATH in both, loses 100k if not',
    deadline: 'December 31, 2026 23:59 UTC',
    deadlineDate: new Date('2026-12-31T23:59:00Z'),
    status: 'active',
    icon: TrendingUp,
  },
  // ── Settled bets ──
  {
    id: 'mempool-clear',
    title: 'Mempools Clear Before Halving',
    description: 'Marty bets mempools will clear before the next halving',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '1,000,000 sats',
    odds: 'Even',
    oddsExplainer: 'Marty won 1M sats',
    deadline: 'Next halving',
    deadlineDate: new Date('2024-04-20'),
    status: 'settled',
    winner: 'Marty',
    satsWon: 1_000_000,
    icon: HardDrive,
  },
  {
    id: 'bitbonds',
    title: 'US Gov Issues BitBonds',
    description: 'Marty bets the US government will issue BitBonds by end of 2025',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '2:1',
    oddsHolder: 'Marty',
    oddsExplainer: 'ODELL won 100k sats',
    deadline: 'End of 2025',
    deadlineDate: new Date('2025-12-31'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 100_000,
    icon: Landmark,
  },
  {
    id: 'tether-hack',
    title: 'Tether Gets Hacked BTC Back',
    description: 'Marty bets Tether gets their hacked bitcoin back by July 16, 2025',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '200,000 sats',
    odds: '2:1',
    oddsHolder: 'ODELL',
    oddsExplainer: 'ODELL won 400k sats (2:1 odds)',
    deadline: 'July 16, 2025',
    deadlineDate: new Date('2025-07-16'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 400_000,
    icon: ShieldCheck,
  },
  {
    id: 'sbr-bill',
    title: 'Strategic Bitcoin Reserve Bill Signed',
    description: 'Marty bets a strategic bitcoin reserve bill is signed by June 15, 2025',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '200,000 sats',
    odds: 'Even',
    oddsExplainer: 'ODELL won 200k sats',
    deadline: 'June 15, 2025',
    deadlineDate: new Date('2025-06-15'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 200_000,
    icon: ScrollText,
  },
  {
    id: 'election-cancelled',
    title: '2024 US Presidential Election Won\'t Happen',
    description: 'Marty bets the 2024 US presidential election won\'t happen',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '10:1',
    oddsHolder: 'Marty',
    oddsExplainer: 'ODELL won 100k sats',
    deadline: 'Election Day 2024',
    deadlineDate: new Date('2024-11-05'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 100_000,
    icon: Vote,
  },
];

interface GuestBet {
  id: string;
  title: string;
  description: string;
  host: 'ODELL' | 'Marty';
  guest: string;
  amount: string;
  odds: string;
  oddsHolder?: string;
  deadline: string;
  deadlineDate: Date;
  status: 'active' | 'settled';
  winner?: string;
  icon: typeof Flame;
}

const GUEST_BETS: GuestBet[] = [
  {
    id: 'strategy-1m-btc',
    title: 'Strategy Holds 1M+ Bitcoin',
    description: 'Marty bets Strategy will hold over one million bitcoin by June 15, 2026 at 4pm ET',
    host: 'Marty',
    guest: 'Seth (Satoshi Pacioli)',
    amount: '100,000 sats',
    odds: 'Even',
    deadline: 'June 15, 2026 4:00 PM ET',
    deadlineDate: new Date('2026-06-15T20:00:00Z'),
    status: 'active',
    icon: Bitcoin,
  },
];

function getTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    const remainingMonths = Math.floor((days - years * 365) / 30);
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
  }
  if (months > 0) return `${months}mo ${days % 30}d`;
  if (days > 0) return `${days}d`;
  return '<1d';
}

function getUrgencyClass(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 14) return 'text-destructive';
  if (days <= 60) return 'text-[hsl(var(--accent))]';
  return 'text-muted-foreground';
}

function ActiveBetCard({ bet }: { bet: Bet }) {
  const Icon = bet.icon;
  const timeRemaining = getTimeRemaining(bet.deadlineDate);
  const urgency = getUrgencyClass(bet.deadlineDate);

  return (
    <Card className="group overflow-hidden border-border bg-card/40 transition-colors duration-300 hover:border-border/80 hover:bg-card/70">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
              <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="serif mb-1 text-base font-medium leading-snug text-foreground sm:text-lg">
              {bet.title}
            </h3>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {bet.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">{bet.proposedBy}</span>
                <span className="text-muted-foreground/40">vs</span>
                <span className="font-medium text-foreground/80">{bet.against}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className={cn('h-3 w-3', urgency)} strokeWidth={1.75} />
                <span className={urgency}>{timeRemaining}</span>
              </span>
              <span className="tabular-nums">
                <span className="font-bold text-[hsl(var(--accent))]">{bet.amount}</span>
                {bet.oddsHolder ? (
                  <>
                    {' · '}
                    <span>{bet.odds}</span>
                    <span className="text-muted-foreground/60"> for {bet.oddsHolder}</span>
                  </>
                ) : (
                  ' · even'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Always-visible details */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border/60 pt-5 text-xs sm:grid-cols-3">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Deadline
            </div>
            <div className="text-foreground/90">{bet.deadline}</div>
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Odds
            </div>
            <div className="text-foreground/90">
              {bet.oddsHolder ? `${bet.odds} for ${bet.oddsHolder}` : 'Even'}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Payout
            </div>
            <div className="text-foreground/90">{bet.oddsExplainer}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SettledBetRow({ bet }: { bet: Bet }) {
  const Icon = bet.icon;

  return (
    <div className="group flex items-center gap-4 border-b border-border/40 py-3.5 last:border-b-0">
      <div className="flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-sm font-medium text-foreground/90">{bet.title}</h3>
          <span className="text-[11px] font-bold tabular-nums text-[hsl(var(--accent))]">
            {bet.amount}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground/70">
          {bet.description}
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5 text-xs">
        {bet.winner === 'wash' ? (
          <span className="rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Wash
          </span>
        ) : (
          <>
            <Trophy className="h-3 w-3 text-[hsl(var(--accent))]/70" strokeWidth={1.75} />
            <span className="font-medium text-foreground/90">{bet.winner}</span>
          </>
        )}
      </div>
    </div>
  );
}

function GuestBetRow({ bet }: { bet: GuestBet }) {
  const Icon = bet.icon;
  const timeRemaining = bet.status === 'active' ? getTimeRemaining(bet.deadlineDate) : null;
  const urgency = bet.status === 'active' ? getUrgencyClass(bet.deadlineDate) : '';

  return (
    <div className="flex items-start gap-4 border-b border-border/40 py-3.5 last:border-b-0">
      <div className="mt-0.5 flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-sm font-medium text-foreground/90">{bet.title}</h3>
          <span className="text-[11px] font-bold tabular-nums text-[hsl(var(--accent))]">
            {bet.amount}
          </span>
        </div>
        <p className="mb-1.5 mt-0.5 text-xs text-muted-foreground/70">
          {bet.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground/70">
          <span>
            <span className="font-medium text-foreground/80">{bet.host}</span>
            <span className="text-muted-foreground/40"> vs </span>
            <span className="font-medium text-foreground/80">{bet.guest}</span>
          </span>
          {timeRemaining && (
            <span className={cn('flex items-center gap-1', urgency)}>
              <Clock className="h-3 w-3" strokeWidth={1.75} />
              {timeRemaining}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 text-xs">
        {bet.status === 'settled' && bet.winner ? (
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3 w-3 text-[hsl(var(--accent))]/70" strokeWidth={1.75} />
            <span className="font-medium text-foreground/90">{bet.winner}</span>
          </div>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-[hsl(var(--accent))]/80">
            Live
          </span>
        )}
      </div>
    </div>
  );
}

function GuestBetsSection() {
  const [showGuest, setShowGuest] = useState(false);

  return (
    <div className="mt-12">
      <button
        onClick={() => setShowGuest(!showGuest)}
        className="group flex w-full items-center justify-center gap-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <div className="h-px flex-1 max-w-[80px] bg-border/60" />
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 transition-colors group-hover:bg-card">
          <Users className="h-3 w-3" strokeWidth={1.75} />
          <span className="font-medium">Guest bets</span>
          <span className="tabular-nums text-muted-foreground/50">({GUEST_BETS.length})</span>
          {showGuest ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.75} />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.75} />
          )}
        </div>
        <div className="h-px flex-1 max-w-[80px] bg-border/60" />
      </button>

      {showGuest && (
        <div className="animate-fade-in-up mt-4" style={{ animationDuration: '0.3s' }}>
          {GUEST_BETS.map((bet) => (
            <GuestBetRow key={bet.id} bet={bet} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BetTracker() {
  const activeBets = BETS.filter((b) => b.status === 'active');
  const settledBets = BETS.filter((b) => b.status === 'settled');

  const odellWins = settledBets.filter((b) => b.winner === 'ODELL').length;
  const martyWins = settledBets.filter((b) => b.winner === 'Marty').length;
  const odellSatsWon = settledBets
    .filter((b) => b.winner === 'ODELL')
    .reduce((sum, b) => sum + (b.satsWon ?? 0), 0);
  const martySatsWon = settledBets
    .filter((b) => b.winner === 'Marty')
    .reduce((sum, b) => sum + (b.satsWon ?? 0), 0);

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
            <span className="h-px w-8 bg-border" />
            <span>The Wager</span>
            <span className="h-px w-8 bg-border" />
          </div>
          <h2 className="serif mb-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            ODELL <span className="italic text-muted-foreground">vs</span> Marty
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            Active bets between the hosts — settled on air, paid in sats.
          </p>
        </div>

        {/* Scoreboard */}
        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="bg-card p-5 text-center">
            <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/70">
              ODELL
            </div>
            <div className="serif mb-1 text-3xl font-normal tabular-nums text-foreground">
              {odellWins}
            </div>
            <div className="text-[11px] tabular-nums text-muted-foreground">
              <span className="font-bold text-[hsl(var(--accent))]">{formatSats(odellSatsWon)}</span> sats won
            </div>
          </div>
          <div className="bg-card p-5 text-center">
            <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Marty
            </div>
            <div className="serif mb-1 text-3xl font-normal tabular-nums text-foreground">
              {martyWins}
            </div>
            <div className="text-[11px] tabular-nums text-muted-foreground">
              <span className="font-bold text-[hsl(var(--accent))]">{formatSats(martySatsWon)}</span> sats won
            </div>
          </div>
        </div>

        {/* Active bet cards */}
        <div className="space-y-3">
          {activeBets.map((bet) => (
            <ActiveBetCard key={bet.id} bet={bet} />
          ))}
        </div>

        {/* Total stake */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <span className="font-bold tabular-nums text-[hsl(var(--accent))]">200k</span> sats at stake
        </div>

        {/* Settled bets */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
            <span className="h-px w-8 bg-border" />
            <span>Past bets</span>
            <span className="h-px w-8 bg-border" />
          </div>

          <div>
            {settledBets.map((bet) => (
              <SettledBetRow key={bet.id} bet={bet} />
            ))}
          </div>
        </div>

        {/* Guest bets */}
        <GuestBetsSection />
      </div>
    </section>
  );
}
