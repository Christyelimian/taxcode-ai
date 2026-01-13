import { getTeamMembers } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, User } from 'lucide-react';
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

export default async function TeamPage() {
  const { success, data: teamMembers } = await getTeamMembers();
  
  if (!success || !teamMembers) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Our Team</h1>
            <p className="text-muted-foreground">Unable to load team information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our dedicated team of tax experts, educators, and professionals are committed to providing 
            you with accurate tax information, education, and guidance to navigate the complexities 
            of the Nigerian tax system.
          </p>
        </div>

        {/* Team Members Grid */}
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 group-hover:scale-105 transition-transform">
                      <AvatarImage asChild>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      </AvatarImage>
                      <AvatarFallback className="text-xl">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {member.title}
                      </CardDescription>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${member.email}`} 
                      className="hover:text-foreground truncate"
                      title={member.email}
                    >
                      {member.email}
                    </a>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/team/${member.id}`}>
                        <User className="h-4 w-4 mr-1" />
                        Profile
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No Team Members Found</h2>
            <p className="text-muted-foreground">
              Check back later to meet our team of tax experts.
            </p>
          </div>
        )}

        {/* About Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Join Our Team</CardTitle>
              <CardDescription>
                Interested in contributing to tax education in Nigeria?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We're always looking for passionate tax professionals, educators, and content creators 
                who want to help make tax information accessible to everyone. If you have expertise 
                in Nigerian tax law, tax administration, or tax education, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}