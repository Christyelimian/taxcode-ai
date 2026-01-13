import { notFound } from 'next/navigation';
import { getFacultyMemberById, getInsights } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Calendar, Eye, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  image: string;
  email: string;
  role: string;
}

interface Insight {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  authorName?: string;
  authorImage?: string;
  authorTitle?: string;
  createdAt: string;
  viewCount: number;
}

export default async function FacultyProfilePage({ params }: { params: { id: string } }) {
  const { success, data: facultyMember } = await getFacultyMemberById(params.id);
  
  if (!success || !facultyMember) {
    notFound();
  }

  // Get insights by this faculty member
  const { success: insightsSuccess, data: allInsights } = await getInsights(true);
  const facultyInsights = insightsSuccess 
    ? allInsights.filter(insight => insight.authorId === params.id && insight.isPublished)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/team">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Team
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage asChild>
                      <Image
                        src={facultyMember.image}
                        alt={facultyMember.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </AvatarImage>
                    <AvatarFallback className="text-2xl">
                      {facultyMember.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{facultyMember.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {facultyMember.title}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {facultyMember.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${facultyMember.email}`} className="hover:text-foreground">
                    {facultyMember.email}
                  </a>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Connect</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${facultyMember.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {facultyMember.name} is a {facultyMember.role.toLowerCase()} at TaxCode with expertise in tax education, 
                  compliance, and digital tax administration. They contribute to the development of educational 
                  content and help taxpayers understand their rights and obligations.
                </p>
              </CardContent>
            </Card>

            {/* Recent Insights */}
            {facultyInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Insights</CardTitle>
                  <CardDescription>
                    Latest tax insights and educational content by {facultyMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facultyInsights.slice(0, 6).map((insight) => (
                      <div key={insight.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <Link href={`/insights/${insight.slug}`} className="font-medium hover:text-primary">
                            {insight.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(insight.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {insight.viewCount} views
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="mt-2 sm:mt-0">
                          <Link href={`/insights/${insight.slug}`}>
                            Read More
                          </Link>
                        </Button>
                      </div>
                    ))}
                    
                    {facultyInsights.length > 6 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" asChild>
                          <Link href={`/insights?author=${facultyMember.id}`}>
                            View All Insights
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {facultyInsights.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Published Insights
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {facultyInsights.reduce((total, insight) => total + insight.viewCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Views
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}