import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface EvaluatorUpdateEmailProps {
    evaluatorName: string;
    formTitle: string;
    evaluateUrl: string;
    subject: string;
    message: string;
}

export const EvaluatorUpdateEmail = ({
    evaluatorName = 'Evaluator',
    formTitle = 'Form',
    evaluateUrl = 'https://technovashardauniversity.in',
    subject = 'Update on Evaluation',
    message = 'We have an update regarding the evaluation process of Technova Nominations.',
}: EvaluatorUpdateEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{subject}</Preview>
            <Body style={{ backgroundColor: '#09090b', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: '16px', margin: '40px 0' }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid #27272a', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    
                    {/* Hero Section */}
                    <Section style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', padding: '48px 32px', textAlign: 'center' as const }}>
                        <Heading style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                            {subject}
                        </Heading>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: '12px', fontSize: '15px', fontWeight: 500 }}>
                            An important update regarding {formTitle}.
                        </Text>
                    </Section>

                    {/* Content Section */}
                    <Section style={{ padding: '40px 32px' }}>
                        <Text style={{ color: '#d4d4d8', fontSize: '17px', lineHeight: '1.6', marginTop: 0 }}>
                            Dear <strong style={{ color: '#ffffff' }}>{evaluatorName}</strong>,
                        </Text>
                        
                        {/* Custom Message Container */}
                        <div style={{ backgroundColor: '#1e1e22', border: '1px solid #27272a', borderRadius: '12px', padding: '24px', marginTop: '24px', color: '#d4d4d8', fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                            {message}
                        </div>
                        
                        {/* CTA Box */}
                        <Section style={{ backgroundColor: '#27272a', borderRadius: '16px', padding: '32px', marginTop: '32px', border: '1px solid #3f3f46', textAlign: 'center' as const }}>
                            <Text style={{ color: '#d4d4d8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                                Click below to access your unique evaluation portal:
                            </Text>
                            <Link
                                href={evaluateUrl}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: '#ffffff',
                                    padding: '14px 28px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '15px',
                                    display: 'inline-block',
                                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                                }}
                            >
                                Open Evaluation Portal
                            </Link>
                        </Section>
                    </Section>

                    {/* Footer Section */}
                    <Hr style={{ borderColor: '#27272a', margin: 0 }} />
                    <Section style={{ padding: '32px', textAlign: 'center' as const, backgroundColor: '#141416' }}>
                        <Text style={{ color: '#52525b', fontSize: '13px', margin: 0 }}>
                            © {new Date().getFullYear()} Technova Sharda University. All rights reserved.
                        </Text>
                        <Text style={{ color: '#52525b', fontSize: '13px', marginTop: '8px' }}>
                            This is a secure, unique link. Please do not share it with anyone. Reach out to <Link href="mailto:technova@sharda.ac.in">technova@sharda.ac.in</Link> for any queries.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EvaluatorUpdateEmail;
