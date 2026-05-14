import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
import { t, type EmailLocale } from "@/lib/emailI18n";

interface TrialWarningEmailProps {
  businessName: string;
  daysLeft: number;
  adminName?: string;
  locale?: EmailLocale;
}

export const TrialWarningEmail = ({ businessName, daysLeft, adminName, locale = 'es' }: TrialWarningEmailProps) => {
  const isExpired = daysLeft <= 0;
  return (
    <Html>
      <Head />
      <Preview>{t.trialPreview(daysLeft, locale)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.trialHeading(daysLeft, locale)}</Heading>
          <Text style={text}>{t.trialBody(businessName, adminName, daysLeft, locale)}</Text>
          <Section style={isExpired ? dangerBox : warningBox}>
            <Text style={boxText}>{t.trialBoxText(daysLeft, locale)}</Text>
          </Section>
          <Section style={buttonSection}>
            <Button style={button} href="mailto:soporte@zyncrox.com">
              {t.trialButton(locale)}
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>{t.trialFooter(locale)}</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TrialWarningEmail;

const main = { backgroundColor: "#f6f9fc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", maxWidth: "520px" };
const h1 = { color: "#6b46c1", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const, margin: "30px 0" };
const text = { color: "#555", fontSize: "16px", lineHeight: "26px", textAlign: "center" as const };
const warningBox = { padding: "16px 20px", backgroundColor: "#fffbeb", borderRadius: "8px", margin: "20px 0", borderLeft: "4px solid #f59e0b" };
const dangerBox = { padding: "16px 20px", backgroundColor: "#fff1f2", borderRadius: "8px", margin: "20px 0", borderLeft: "4px solid #f43f5e" };
const boxText = { color: "#444", fontSize: "15px", margin: "0", textAlign: "center" as const };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#6b46c1", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: "bold", textDecoration: "none", padding: "12px 28px", display: "inline-block" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
