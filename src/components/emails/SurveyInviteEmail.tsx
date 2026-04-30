import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SurveyInviteEmailProps {
  customerName: string;
  tenantName: string;
  tenantLogo?: string;
  surveyUrl: string;
}

export const SurveyInviteEmail = ({
  customerName,
  tenantName,
  tenantLogo,
  surveyUrl,
}: SurveyInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>¿Cómo fue tu experiencia en {tenantName}?</Preview>
    <Body style={main}>
      <Container style={container}>
        {tenantLogo && (
          <Img src={tenantLogo} width="150" alt={tenantName} style={logo} />
        )}
        <Heading style={h1}>¡Gracias por visitarnos, {customerName}!</Heading>
        <Text style={text}>
          Nos importa mucho tu opinión. ¿Podrías tomarte un momento para
          contarnos cómo fue tu experiencia en <strong>{tenantName}</strong>?
        </Text>
        <Section style={buttonSection}>
          <Button href={surveyUrl} style={button}>
            Completar encuesta
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Gracias por confiar en {tenantName}. Tu opinión nos ayuda a mejorar.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SurveyInviteEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const logo = {
  margin: "0 auto 20px auto",
  display: "block",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#9333ea",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 28px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
