'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  status: string;
  attempts: number;
  last_error?: string;
  created_at: string;
  payload: {
    data?: {
      object?: {
        payment?: {
          id: string;
          amount_money?: { amount: number };
        };
      };
    };
  };
}

export default function PaymentReconciliationDashboard() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [reconciling, setReconciling] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState('');

  const fetchEvents = async () => {
    if (!adminSecret) {
      setError('Please enter admin secret');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/reconcile-payments', {
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.unprocessed_events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const reconcilePayment = async (paymentId: string, webhookId: string) => {
    setReconciling(webhookId);
    setError(null);

    try {
      const response = await fetch('/api/admin/reconcile-payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          square_payment_id: paymentId,
          webhook_event_id: webhookId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reconcile payment');
      }

      const result = await response.json();

      // Refresh the list
      await fetchEvents();

      // Show success message
      alert(`Payment reconciled: ${result.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reconcile payment');
    } finally {
      setReconciling(null);
    }
  };

  const retryAllFailed = async () => {
    setRetrying(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/reconcile-payments', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retry events');
      }

      const result = await response.json();

      // Refresh the list
      await fetchEvents();

      // Show success message
      alert(`Processed ${result.processed} events`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry events');
    } finally {
      setRetrying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      failed: { color: 'destructive' as const, icon: XCircle },
      retrying: { color: 'outline' as const, icon: AlertCircle },
      pending: { color: 'secondary' as const, icon: AlertCircle },
      processing: { color: 'default' as const, icon: RefreshCw },
      completed: { color: 'default' as const, icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.color} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>Payment Reconciliation Dashboard</CardTitle>
          <CardDescription>
            Manage failed webhook events and reconcile payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <input
                type="password"
                placeholder="Admin Secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                onClick={fetchEvents}
                disabled={loading || !adminSecret}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Fetch Events'}
              </Button>
              <Button
                onClick={retryAllFailed}
                disabled={retrying || events.length === 0 || !adminSecret}
              >
                {retrying ? 'Retrying...' : 'Retry All Failed'}
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {adminSecret ? 'No unprocessed events found' : 'Enter admin secret and fetch events'}
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Found {events.length} unprocessed event(s)
                </div>
                {events.map((event) => {
                  const paymentId = event.payload?.data?.object?.payment?.id;
                  const amount = event.payload?.data?.object?.payment?.amount_money?.amount;

                  return (
                    <Card key={event.id} className="border-l-4 border-l-yellow-400">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(event.status)}
                              <Badge variant="outline">{event.event_type}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Attempts: {event.attempts}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <div>Event ID: <code className="text-xs">{event.event_id}</code></div>
                              {paymentId && (
                                <div>Payment ID: <code className="text-xs">{paymentId}</code></div>
                              )}
                              {amount && (
                                <div>Amount: ${(amount / 100).toFixed(2)}</div>
                              )}
                              <div>Created: {new Date(event.created_at).toLocaleString()}</div>
                            </div>
                          </div>

                          {paymentId && (
                            <Button
                              onClick={() => reconcilePayment(paymentId, event.id)}
                              disabled={reconciling === event.id}
                              size="sm"
                            >
                              {reconciling === event.id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Reconciling...
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  Reconcile
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {event.last_error && (
                          <div className="mt-3 p-2 bg-red-50 text-red-700 rounded text-sm">
                            <strong>Error:</strong> {event.last_error}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}