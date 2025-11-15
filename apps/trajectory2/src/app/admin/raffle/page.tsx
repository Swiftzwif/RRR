'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
import {
  Trophy,
  Users,
  Download,
  RefreshCw,
  Search,
  Filter,
  Dice6,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RaffleEntry {
  id: string;
  email: string;
  phone: string | null;
  entry_number: number;
  commitment_message: string;
  transformation_goal: string;
  is_winner: boolean;
  prize_won: string | null;
  created_at: string;
  purchase: {
    amount_cents: number;
    square_payment_id: string;
  };
}

interface RaffleConfig {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  entry_price: number;
  regular_price: number;
  prizes: any[];
}

interface RaffleStats {
  totalEntries: number;
  totalRevenue: number;
  averageGoalLength: number;
  topGoalWords: string[];
  entriesPerDay: Record<string, number>;
}

// Admin emails that have access (you can move this to env or database)
const ADMIN_EMAILS = ['jean@killtheboy.com', 'admin@trajectory.com'];

export default function AdminRafflePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [raffleConfig, setRaffleConfig] = useState<RaffleConfig | null>(null);
  const [entries, setEntries] = useState<RaffleEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<RaffleEntry[]>([]);
  const [stats, setStats] = useState<RaffleStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = entries.filter(
        (entry) =>
          entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.transformation_goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.entry_number.toString().includes(searchTerm)
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [searchTerm, entries]);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      alert('Unauthorized access. Admin only.');
      router.push('/');
      return;
    }

    setIsAuthorized(true);
    await fetchRaffleData();
  };

  const fetchRaffleData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get active raffle config
      const { data: config } = await supabase
        .from('raffle_config')
        .select('*')
        .eq('status', 'active')
        .single();

      if (config) {
        setRaffleConfig(config);

        // Get all entries
        const { data: entriesData } = await supabase
          .from('raffle_entries')
          .select(`
            *,
            purchase:purchases!raffle_entries_purchase_id_fkey (
              amount_cents,
              square_payment_id
            )
          `)
          .eq('raffle_id', config.id)
          .order('created_at', { ascending: false });

        if (entriesData) {
          setEntries(entriesData as any);
          setFilteredEntries(entriesData as any);
          calculateStats(entriesData as any);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (entries: RaffleEntry[]) => {
    const totalRevenue = entries.reduce(
      (sum, entry) => sum + (entry.purchase?.amount_cents || 0),
      0
    );

    const allGoals = entries.map((e) => e.transformation_goal).join(' ');
    const words = allGoals.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    const commonWords = ['i', 'to', 'my', 'and', 'the', 'a', 'want', 'transform'];

    words.forEach((word) => {
      if (!commonWords.includes(word) && word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    // Calculate entries per day
    const entriesPerDay: Record<string, number> = {};
    entries.forEach((entry) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      entriesPerDay[date] = (entriesPerDay[date] || 0) + 1;
    });

    setStats({
      totalEntries: entries.length,
      totalRevenue: totalRevenue / 100,
      averageGoalLength: Math.round(
        entries.reduce((sum, e) => sum + e.transformation_goal.length, 0) / entries.length
      ),
      topGoalWords: topWords,
      entriesPerDay,
    });
  };

  const selectWinners = async () => {
    if (!raffleConfig || !confirm('Are you ready to select winners? This action is final.')) {
      return;
    }

    const supabase = createClient();

    // Shuffle entries using Fisher-Yates algorithm
    const shuffled = [...entries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select winners based on prize configuration
    const winners: Array<{ entry: RaffleEntry; prize: any }> = [];
    let currentIndex = 0;

    for (const prize of raffleConfig.prizes) {
      for (let i = 0; i < prize.quantity; i++) {
        if (currentIndex < shuffled.length) {
          winners.push({
            entry: shuffled[currentIndex],
            prize: prize,
          });
          currentIndex++;
        }
      }
    }

    // Update database with winners
    for (const winner of winners) {
      await supabase
        .from('raffle_entries')
        .update({
          is_winner: true,
          prize_won: `${winner.prize.type}: ${winner.prize.value}`,
        })
        .eq('id', winner.entry.id);
    }

    alert(`${winners.length} winners selected successfully!`);
    await fetchRaffleData();
  };

  const exportToCSV = () => {
    const headers = ['Entry #', 'Email', 'Phone', 'Goal', 'Commitment', 'Winner', 'Prize', 'Date'];
    const rows = filteredEntries.map((entry) => [
      entry.entry_number,
      entry.email,
      entry.phone || '',
      entry.transformation_goal,
      entry.commitment_message,
      entry.is_winner ? 'Yes' : 'No',
      entry.prize_won || '',
      new Date(entry.created_at).toLocaleString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `raffle_entries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleGoal = (entryId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedGoals(newExpanded);
  };

  if (!isAuthorized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedDiv
          className="text-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-8 h-8 text-sky-600" />
        </AnimatedDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-sky-800 mb-2">Raffle Admin Dashboard</h1>
          <p className="text-sky-600">
            Manage the {raffleConfig?.name} - {stats?.totalEntries} Warriors
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-sky-800">{stats.totalEntries}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Avg Goal Length</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-sky-800">{stats.averageGoalLength} chars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Goal Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {stats.topGoalWords.map((word) => (
                    <Badge key={word} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entries">All Entries</TabsTrigger>
            <TabsTrigger value="winners">Winners</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Raffle Management</CardTitle>
                <CardDescription>Select winners and manage the raffle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={selectWinners} className="flex items-center gap-2">
                    <Dice6 className="w-4 h-4" />
                    Select Winners Randomly
                  </Button>
                  <Button onClick={exportToCSV} variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export All Entries
                  </Button>
                  <Button onClick={fetchRaffleData} variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </Button>
                </div>

                {/* Daily entry chart (simplified) */}
                {stats && (
                  <div className="mt-8">
                    <h3 className="font-bold text-sky-800 mb-4">Entries Per Day</h3>
                    <div className="flex gap-2 items-end h-32">
                      {Object.entries(stats.entriesPerDay).map(([date, count]) => (
                        <div key={date} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-sky-500 rounded-t"
                            style={{
                              height: `${(count / Math.max(...Object.values(stats.entriesPerDay))) * 100}%`,
                            }}
                          />
                          <p className="text-xs mt-2 rotate-45">{date.split('/').slice(0, 2).join('/')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entries">
            <Card>
              <CardHeader>
                <CardTitle>All Entries ({filteredEntries.length})</CardTitle>
                <div className="flex items-center gap-2 mt-4">
                  <Search className="w-4 h-4 text-sky-600" />
                  <Input
                    placeholder="Search by email, goal, or entry number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry #</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Winner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-bold">#{entry.entry_number}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell className="max-w-xs">
                            <div>
                              <p className={expandedGoals.has(entry.id) ? '' : 'truncate'}>
                                {entry.transformation_goal}
                              </p>
                              {entry.transformation_goal.length > 50 && (
                                <button
                                  onClick={() => toggleGoal(entry.id)}
                                  className="text-sky-600 text-sm mt-1 flex items-center gap-1"
                                >
                                  {expandedGoals.has(entry.id) ? (
                                    <>
                                      <ChevronUp className="w-3 h-3" /> Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3" /> Show more
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {entry.is_winner ? (
                              <Badge className="bg-yellow-500">
                                <Trophy className="w-3 h-3 mr-1" />
                                Winner
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winners">
            <Card>
              <CardHeader>
                <CardTitle>Winners</CardTitle>
                <CardDescription>All selected winners and their prizes</CardDescription>
              </CardHeader>
              <CardContent>
                {entries.filter((e) => e.is_winner).length === 0 ? (
                  <p className="text-sky-600">No winners selected yet. Use the Overview tab to select winners.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry #</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((e) => e.is_winner)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>#{entry.entry_number}</TableCell>
                            <TableCell>{entry.email}</TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-500">{entry.prize_won}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {entry.transformation_goal}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.location.href = `mailto:${entry.email}?subject=You Won! - Kill The Boy Raffle&body=Congratulations! You won ${entry.prize_won}`;
                                }}
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}