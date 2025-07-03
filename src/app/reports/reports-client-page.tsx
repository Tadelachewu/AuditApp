
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getReportDetails } from "./actions";
import type { Report, DetailedReport } from "@/lib/definitions";

const statusVariant = {
  'Finalized': 'default',
  'Draft': 'secondary',
} as const;

export default function ReportsClientPage({ reports }: { reports: Report[] }) {
  const [selectedReport, setSelectedReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-select the first report if available
    if (reports.length > 0 && !selectedReport) {
      handleSelectReport(reports[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  const handleSelectReport = async (reportId: string) => {
    setIsLoading(true);
    setSelectedReport(null);
    try {
      const reportDetails = await getReportDetails(reportId);
      if (reportDetails) {
        setSelectedReport(reportDetails);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Report details could not be found." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch report details." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (selectedReport) {
      toast({
        title: "Preparing Download",
        description: `Your report for ${selectedReport.id} is opening in a new tab.`,
      });
      window.open(`/reports/${selectedReport.id}/print`, '_blank');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Reports</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Select a report to preview.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow 
                      key={report.id} 
                      onClick={() => handleSelectReport(report.id)}
                      className="cursor-pointer"
                      data-state={selectedReport?.id === report.id ? 'selected' : ''}
                    >
                      <TableCell className="font-medium">{report.id}<br/><span className="text-xs text-muted-foreground">{report.title}</span></TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell><Badge variant={statusVariant[report.status]}>{report.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <Card>
                <CardContent className="pt-6 flex items-center justify-center h-96">
                    <div className="flex items-center justify-center flex-col gap-4 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <h3 className="text-xl font-semibold">Loading Report...</h3>
                    </div>
                </CardContent>
            </Card>
          ) : selectedReport ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Report Preview: {selectedReport.id}</CardTitle>
                  <CardDescription>{selectedReport.title}</CardDescription>
                </div>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedReport.summary}
                  </p>
                </div>
                
                {selectedReport.compliance_score !== null && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold">Compliance Status</h3>
                      <div className="mt-2 flex items-center gap-4">
                        <BarChart2 className="h-10 w-10 text-primary" />
                        <div>
                          <p className="font-bold text-2xl">{selectedReport.compliance_score}% Compliant</p>
                          <p className="text-sm text-muted-foreground">{selectedReport.compliance_details}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedReport.findings && selectedReport.findings.length > 0 && (
                   <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold">Key Findings & Recommendations</h3>
                      <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                        {selectedReport.findings.map((finding) => (
                          <li key={finding.id}>
                            <span className="font-semibold">{finding.title}</span>
                            <br/><span className="text-muted-foreground pl-4">→ Recommendation: {finding.recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                   </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No report to display</CardTitle>
                <CardDescription>Select a report from the list to preview it here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">There are no reports available to preview.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
