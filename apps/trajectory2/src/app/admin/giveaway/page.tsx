'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logger } from '@/lib/logger';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Download,
  RefreshCw,
  Search,
  Dice6,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ExternalLink,
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

interface GiveawayEntry {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  entry_number: number;
  transformation_goal: string | null;
  is_winner: boolean;
  prize_won: string | null;
  created_at: string;
  newsletter_subscribed: boolean;
  verified: boolean;
  convertkit_subscriber_id: string | null;
  liked_post: boolean;
  shared_post: boolean;
  tagged_friend: boolean;
}

interface GiveawayConfig {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  prizes: any[];
}

interface GiveawayStats {
  totalEntries: number;
  verifiedEntries: number;
  newsletterSubscribed: number;
  averageGoalLength: number;
  topGoalWords: string[];
  entriesPerDay: Record<string, number>;
}

// Admin emails that have access
const ADMIN_EMAILS = ['jean@killtheboy.com', 'admin@trajectory.com', 'jsanchez@trajectorygroup.org'];
const CONVERTKIT_URL = 'https://app.convertkit.com/';

export default function AdminGiveawayPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [giveawayConfig, setGiveawayConfig] = useState<GiveawayConfig | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<GiveawayEntry[]>([]);
  const [stats, setStats] = useState<GiveawayStats | null>(null);
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
          entry.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.transformation_goal && entry.transformation_goal.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    await fetchGiveawayData();
  };

  const fetchGiveawayData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get active giveaway config
      const { data: config } = await supabase
        .from('giveaway_config')
        .select('*')
        .eq('status', 'active')
        .single();

      if (config) {
        setGiveawayConfig(config);

        // Get all entries
        const { data: entriesData } = await supabase
          .from('giveaway_entries')
          .select('*')
          .eq('giveaway_id', config.id)
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

  const calculateStats = (entries: GiveawayEntry[]) => {
    const allGoals = entries
      .map((e) => e.transformation_goal)
      .filter(Boolean)
      .join(' ');
    const words = allGoals.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    const commonWords = ['i', 'to', 'my', 'and', 'the', 'a', 'want', 'transform', 'be'];

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

    const verifiedEntries = entries.filter((e) => e.verified).length;
    const newsletterSubscribed = entries.filter((e) => e.newsletter_subscribed).length;

    setStats({
      totalEntries: entries.length,
      verifiedEntries,
      newsletterSubscribed,
      averageGoalLength: entries.length > 0
        ? Math.round(
            entries.reduce((sum, e) => sum + (e.transformation_goal?.length || 0), 0) / entries.length
          )
        : 0,
      topGoalWords: topWords,
      entriesPerDay,
    });
  };

  const toggleVerification = async (entryId: string, currentVerified: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('giveaway_entries')
      .update({ verified: !currentVerified })
      .eq('id', entryId);

    if (error) {
      alert('Failed to update verification status');
      console.error('Verification update error:', error);
    } else {
      // Refresh data
      await fetchGiveawayData();
    }
  };

  const selectWinners = async () => {
    if (!giveawayConfig || !confirm('Are you ready to select winners? This action is final.')) {
      return;
    }

    const supabase = createClient();

    // Get all verified entries only
    const { data: verifiedEntries } = await supabase
      .from('giveaway_entries')
      .select('*')
      .eq('giveaway_id', giveawayConfig.id)
      .eq('verified', true);

    if (!verifiedEntries || verifiedEntries.length === 0) {
      alert('No verified entries to select winners from.');
      return;
    }

    // Shuffle entries using Fisher-Yates algorithm
    const shuffled = [...verifiedEntries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select winners based on prize configuration
    const winners: Array<{ entry: GiveawayEntry; prize: any }> = [];
    let currentIndex = 0;

    for (const prize of giveawayConfig.prizes) {
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
        .from('giveaway_entries')
        .update({
          is_winner: true,
          prize_won: `${winner.prize.type}: ${winner.prize.value}`,
        })
        .eq('id', winner.entry.id);
    }

    alert(`${winners.length} winners selected successfully!`);
    await fetchGiveawayData();
  };

  const exportToCSV = () => {
    const headers = ['Entry #', 'Email', 'First Name', 'Last Name', 'Newsletter', 'Verified', 'Winner', 'Prize', 'Date'];
    const rows = filteredEntries.map((entry) => [
      entry.entry_number,
      entry.email,
      entry.first_name,
      entry.last_name,
      entry.newsletter_subscribed ? 'Yes' : 'No',
      entry.verified ? 'Yes' : 'No',
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
    link.setAttribute('download', `giveaway_entries_${Date.now()}.csv`);
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
        <motion.div
          className="text-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-8 h-8 text-sky-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-sky-800 mb-2">Giveaway Admin Dashboard</h1>
          <p className="text-sky-600">
            Manage the {giveawayConfig?.name} - {stats?.totalEntries || 0} Participants
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
                <CardTitle className="text-lg">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.verifiedEntries}</p>
                <p className="text-sm text-sky-600 mt-1">
                  {stats.totalEntries > 0
                    ? Math.round((stats.verifiedEntries / stats.totalEntries) * 100)
                    : 0}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Newsletter Subs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{stats.newsletterSubscribed}</p>
                <p className="text-sm text-sky-600 mt-1">ConvertKit verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Goals</CardTitle>
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
            <TabsTrigger value="unverified">Unverified</TabsTrigger>
            <TabsTrigger value="winners">Winners</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Giveaway Management</CardTitle>
                <CardDescription>Manage entries and select winners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <Button onClick={selectWinners} className="flex items-center gap-2">
                    <Dice6 className="w-4 h-4" />
                    Select Winners from Verified
                  </Button>
                  <Button onClick={exportToCSV} variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export All Entries
                  </Button>
                  <Button onClick={fetchGiveawayData} variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open(CONVERTKIT_URL, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open ConvertKit
                  </Button>
                </div>

                {/* Daily entry chart */}
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
                    placeholder="Search by name, email, or entry number..."
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
                        <TableHead>Name</TableHead>
                        <TableHead>Newsletter</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Winner</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-bold">#{entry.entry_number}</TableCell>
                          <TableCell className="max-w-xs truncate">{entry.email}</TableCell>
                          <TableCell>
                            {entry.first_name} {entry.last_name}
                          </TableCell>
                          <TableCell>
                            {entry.newsletter_subscribed ? (
                              <Badge className="bg-green-500">Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.verified ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
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
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleVerification(entry.id, entry.verified)}
                            >
                              {entry.verified ? 'Unverify' : 'Verify'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unverified">
            <Card>
              <CardHeader>
                <CardTitle>Unverified Entries</CardTitle>
                <CardDescription>
                  Review these entries against ConvertKit and Instagram before verifying
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEntries.filter((e) => !e.verified).length === 0 ? (
                  <p className="text-sky-600">All entries are verified!</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry #</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Newsletter</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries
                        .filter((e) => !e.verified)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-bold">#{entry.entry_number}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.email}</TableCell>
                            <TableCell>
                              {entry.first_name} {entry.last_name}
                            </TableCell>
                            <TableCell>
                              {entry.newsletter_subscribed ? (
                                <Badge className="bg-green-500">Yes</Badge>
                              ) : (
                                <Badge variant="secondary">No</Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => toggleVerification(entry.id, entry.verified)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verify
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
                        <TableHead>Name</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((e) => e.is_winner)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>#{entry.entry_number}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.email}</TableCell>
                            <TableCell>
                              {entry.first_name} {entry.last_name}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-500">{entry.prize_won}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.location.href = `mailto:${entry.email}?subject=You Won! - Kill The Boy Giveaway&body=Congratulations! You won ${entry.prize_won}`;
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
