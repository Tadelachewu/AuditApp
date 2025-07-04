import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, ClipboardCheck, AlertTriangle, FileText, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fetchCardData, fetchRecentActivities, fetchUpcomingDeadlines } from '@/lib/queries';
import type { Activity as ActivityType } from '@/lib/definitions';
import { DashboardLayout } from '@/components/dashboard-layout';
import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const user = await getSession();
  const { 
    ongoingAuditsCount,
    checklistsCount,
    openFindingsCount,
    generatedReportsCount 
  } = await fetchCardData();
  
  const upcomingDeadlines = await fetchUpcomingDeadlines();
  const recentActivities = await fetchRecentActivities();
  
  const activityIcons: Record<ActivityType['type'], React.ReactNode> = {
    Audit: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
    Checklist: <ClipboardCheck className="h-4 w-4 text-muted-foreground" />,
    Report: <FileText className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing Audits</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingAuditsCount}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Checklists</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checklistsCount}</div>
              <p className="text-xs text-muted-foreground">Available for use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openFindingsCount}</div>
              <p className="text-xs text-muted-foreground">Across all finalized reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generatedReportsCount}</div>
              <p className="text-xs text-muted-foreground">Total reports generated</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A log of the most recent activities in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {activityIcons[activity.type as keyof typeof activityIcons]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Audits that are scheduled or in-progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{audit.name}</p>
                        <p className="text-sm text-muted-foreground">{audit.auditor.name}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm">{format(new Date(audit.end_date), "dd MMM yyyy")}</p>
                         <Badge variant={audit.status === 'In Progress' ? 'secondary' : 'default'} className="mt-1">{audit.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
