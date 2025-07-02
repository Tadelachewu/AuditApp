"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { runRiskAssessment } from '@/app/risk-assessment/actions';
import type { RiskAssessmentOutput } from '@/ai/flows/risk-assessment';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, ListChecks, ShieldAlert, FileSignature } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  historicalData: z.string().min(10, {
    message: "Historical data must be at least 10 characters.",
  }),
  regulatoryChanges: z.string().min(10, {
    message: "Regulatory changes must be at least 10 characters.",
  }),
  industryTrends: z.string().min(10, {
    message: "Industry trends must be at least 10 characters.",
  }),
});

export function RiskAssessmentForm() {
  const [result, setResult] = useState<RiskAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalData: "",
      regulatoryChanges: "",
      industryTrends: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runRiskAssessment(values);
      setResult(response);
    } catch (error) {
        console.error("Risk assessment failed:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to perform risk assessment. Please try again.",
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Input</CardTitle>
          <CardDescription>Provide data to identify potential risks based on historical data, regulatory changes, and industry trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="historicalData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Audit Data</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Findings from Q2 2023 audit included weaknesses in access control..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include past findings and resolutions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="regulatoryChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recent Regulatory Changes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., New data privacy law (XYZ Act) effective Jan 1, 2024 requires..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List relevant new laws or regulations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industryTrends"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Industry Trends</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Increased phishing attacks targeting financial institutions..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mention trends that may impact risk.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assess Risks
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-center flex-col gap-4 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h3 className="text-xl font-semibold">Analyzing Risks...</h3>
                    <p className="text-muted-foreground">Our AI is processing the data to identify potential risks. This may take a moment.</p>
                </div>
            </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
            <Alert>
                <FileSignature className="h-4 w-4" />
                <AlertTitle>Risk Summary</AlertTitle>
                <AlertDescription>
                    {result.riskSummary}
                </AlertDescription>
            </Alert>
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldAlert /> Detailed Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {result.riskDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks /> Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {result.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
