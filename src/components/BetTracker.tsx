import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Target,
  Clock,
  Swords,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

interface Bet {
  id: string;
  title: string;
  description: string;
  proposedBy: 'ODELL' | 'Marty';
  against: 'ODELL' | 'Marty';
  amount: string;
  odds: string;
  oddsExplainer: string;
  deadline: string;
  deadlineDate: Date;
  status: 'active' | 'settled' | 'expired';
  icon: typeof Flame;
}

const ACTIVE_BETS: Bet[] = [
  {
    id: 'iran-ceasefire',
    title: 'Iran Ceasefire',
    description: '5 days of ceasefire in Iran by April 21',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '2:1',
    oddsExplainer: 'Marty wins 200k if ceasefire happens, loses 100k if not',
    deadline: 'April 21, 2026 23:59 UTC',
    deadlineDate: new Date('2026-04-21T23:59:00Z'),
    status: 'active',
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
    oddsExplainer: 'ODELL wins 200k if BTC hits ATH in both, loses 100k if not',
    deadline: 'December 31, 2026 23:59 UTC',
    deadlineDate: new Date('2026-12-31T23:59:00Z'),
    status: 'active',
    icon: TrendingUp,
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

function getUrgencyColor(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 14) return 'text-red-400';
  if (days <= 60) return 'text-amber-400';
  return 'text-emerald-400';
}

function BetCard({ bet }: { bet: Bet }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = bet.icon;
  const timeRemaining = getTimeRemaining(bet.deadlineDate);
  const urgencyColor = getUrgencyColor(bet.deadlineDate);

  return (
    <Card
      className="group relative border-amber-500/15 bg-card/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />

      <CardContent className="p-4 sm:p-5">
        {/* Main row */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors duration-300">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                {bet.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-xs border-amber-500/20 bg-amber-500/5 text-amber-400 font-semibold px-2 py-0.5"
                >
                  <Zap className="w-2.5 h-2.5 mr-0.5" />
                  {bet.amount}
                </Badge>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2">
              {bet.description}
            </p>

            {/* Matchup & Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/80">
              <span className="flex items-center gap-1">
                <Swords className="w-3 h-3 text-amber-500/60" />
                <span className="font-semibold text-amber-400">{bet.proposedBy}</span>
                <span className="text-muted-foreground/40">vs</span>
                <span className="font-semibold text-foreground/80">{bet.against}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${urgencyColor}`} />
                <span className={urgencyColor}>{timeRemaining}</span>
              </span>
              <span className="text-muted-foreground/60">
                {bet.odds} odds
              </span>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-amber-500/10 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                <span className="text-muted-foreground/60 block mb-0.5">Deadline</span>
                <span className="font-semibold text-foreground/90">{bet.deadline}</span>
              </div>
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                <span className="text-muted-foreground/60 block mb-0.5">Odds</span>
                <span className="font-semibold text-foreground/90">{bet.odds} ({bet.proposedBy})</span>
              </div>
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10 sm:col-span-1">
                <span className="text-muted-foreground/60 block mb-0.5">Payout</span>
                <span className="font-semibold text-foreground/90">{bet.oddsExplainer}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BetTracker() {
  const activeBets = ACTIVE_BETS.filter((b) => b.status === 'active');

  return (
    <section className="relative py-10 sm:py-14 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(245,158,11,0.04),transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <Flame className="w-4 h-4" />
            Live Bet Tracker
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">ODELL</span>
            <span className="text-foreground"> vs </span>
            <span className="gradient-text">Marty</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Active bets between the hosts — settled on air, paid in sats.
          </p>
        </div>

        {/* Bet cards */}
        <div className="space-y-3">
          {activeBets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>

        {/* Total stake */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">200k</span> sats at stake
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
