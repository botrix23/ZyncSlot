import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TrialWarningEmailProps {
  businessName: string;
  daysLeft: number;
  adminName?: string;
}

export const TrialWarningEmail = ({
  businessName,
  daysLeft,
  adminName,
}: TrialWarningEmailProps) => {
  const isExpired = daysLeft <= 0;
  const previewText = isExpired
    ? `Tu período de prueba en Zyncrox ha vencido`
    : `Tu trial en Zyncrox vence en ${daysLeft} día${daysLeft === 1 ? "" : "s"}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isExpired
              ? "Tu trial ha vencido"
              : `Tu trial vence en ${daysLeft} día${daysLeft === 1 ? "" : "s"}`}
          </Heading>
          <Text style={text}>
            Hola{adminName ? ` ${adminName}` : ""}, el período de prueba de{" "}
            <strong>{businessName}</strong> en Zyncrox{" "}
            {isExpired ? "ha vencido" : `vencerá en ${daysLeft} día${daysLeft === 1 ? "" : "s"}`}.
          </Text>
          <Section style={isExpired ? dangerBox : warningBox}>
            <Text style={boxText}>
              {isExpired
                ? "Tu acceso ha sido suspendido. Elige un plan para reactivar tu cuenta y seguir gestionando tus reservas."
                : "Para continuar sin interrupciones, contacta a soporte y elige el plan que mejor se adapte a tu negocio."}
            </Text>
          </Section>
          <Section style={buttonSection}>
            <Button style={button} href="mailto:soporte@zyncrox.com">
              Contactar soporte
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Zyncrox · Gestión de reservas premium</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TrialWarningEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  maxWidth: "520px",
};
const h1 = {
  color: "#6b46c1",
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
const warningBox = {
  padding: "16px 20px",
  backgroundColor: "#fffbeb",
  borderRadius: "8px",
  margin: "20px 0",
  borderLeft: "4px solid #f59e0b",
};
const dangerBox = {
  padding: "16px 20px",
  backgroundColor: "#fff1f2",
  borderRadius: "8px",
  margin: "20px 0",
  borderLeft: "4px solid #f43f5e",
};
const boxText = { color: "#444", fontSize: "15px", margin: "0", textAlign: "center" as const };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = {
  backgroundColor: "#6b46c1",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  padding: "12px 28px",
  display: "inline-block",
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
