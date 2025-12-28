'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, LoaderCircle, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardUser {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  level: number;
  xp: number;
  reputationScore: number;
  isVerified: boolean;
  _count: {
    questions: number;
    answers: number;
  };
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'xp' | 'answers' | 'questions' | 'reputation'>('xp');

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/leaderboard?type=${type}&limit=50`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-semibold">#{index + 1}</span>;
  };

  const getDisplayValue = (user: LeaderboardUser) => {
    switch (type) {
      case 'xp':
        return user.xp;
      case 'answers':
        return user._count.answers;
      case 'questions':
        return user._count.questions;
      case 'reputation':
        return user.reputationScore;
      default:
        return 0;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'xp':
        return 'XP';
      case 'answers':
        return 'Answers';
      case 'questions':
        return 'Questions';
      case 'reputation':
        return 'Reputation';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Leaderboard</h1>
          <p className="text-muted-foreground">
            Top contributors and most active members of the Tax Code community
          </p>
        </div>

        <Tabs value={type} onValueChange={(v) => setType(v as typeof type)} className="mb-6">
          <TabsList>
            <TabsTrigger value="xp">
              <TrendingUp className="mr-2 h-4 w-4" />
              XP Points
            </TabsTrigger>
            <TabsTrigger value="answers">Most Answers</TabsTrigger>
            <TabsTrigger value="questions">Most Questions</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No leaderboard data available yet. Be the first to contribute!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/community/users/${user.username || user.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {user.name || user.username || 'Anonymous'}
                          </Link>
                          {user.isVerified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            Level {user.level}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {user._count.questions} questions • {user._count.answers} answers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{getDisplayValue(user)}</div>
                      <div className="text-xs text-muted-foreground">{getTypeLabel()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



