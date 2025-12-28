"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "Basic directory listing",
      "Email notifications",
      "Profile management",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 5000,
    pricePeriod: "month",
    features: [
      "Everything in Free",
      "Featured listing",
      "Priority in search results",
      "Analytics dashboard",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 15000,
    pricePeriod: "month",
    features: [
      "Everything in Basic",
      "Top placement in search",
      "Advanced analytics",
      "Custom profile sections",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 50000,
    pricePeriod: "month",
    features: [
      "Everything in Premium",
      "Multiple consultant profiles",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
];

export default function ConsultantPaymentPage() {
  // TODO: Get current plan from consultant profile
  const currentPlan = "free";

  async function handleSubscribe(planId: string) {
    // TODO: Integrate with payment provider (Stripe, Paystack, etc.)
    // For now, this is a placeholder
    console.log("Subscribe to plan:", planId);
    
    // Example flow:
    // 1. Create payment intent/session
    // 2. Redirect to payment page
    // 3. On success, update consultant.paymentStatus
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">Choose a plan that fits your needs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${currentPlan === plan.id ? "border-primary shadow-lg" : ""}`}
            >
              {currentPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <Badge>Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  {plan.pricePeriod && (
                    <span className="text-muted-foreground">/{plan.pricePeriod}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={currentPlan === plan.id ? "outline" : "default"}
                  disabled={currentPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {currentPlan === plan.id ? (
                    "Current Plan"
                  ) : plan.price === 0 ? (
                    "Select Free"
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Secure payments powered by Paystack/Stripe. All transactions are encrypted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Payment integration coming soon. For now, contact admin to upgrade your plan.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/contact">Contact Admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




