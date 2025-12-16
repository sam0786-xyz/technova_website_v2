"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PartnershipForm() {
    return (
        <Card className="max-w-xl mx-auto bg-black/40 border-white/10">
            <CardHeader>
                <CardTitle>Partner With Us</CardTitle>
                <CardDescription>
                    Fill out the form below to inquire about sponsorship opportunities or collaborations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action="mailto:contact@technova.club" method="post" encType="text/plain" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" name="company" placeholder="Acme Corp" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interest">Area of Interest</Label>
                        <Input id="interest" name="interest" placeholder="Sponsorship, Mentorship, Recruiting..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="Tell us how you'd like to collaborate..." className="min-h-[120px]" />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Send Inquiry
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
