import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-session';
import { render } from '@react-email/render';
import React from 'react';
import { BookingConfirmationEmail } from '@/components/emails/BookingConfirmationEmail';
import { BookingReminderEmail } from '@/components/emails/BookingReminderEmail';
import { BookingCancellationEmail } from '@/components/emails/BookingCancellationEmail';
import { BookingRescheduleEmail } from '@/components/emails/BookingRescheduleEmail';
import { TrialWarningEmail } from '@/components/emails/TrialWarningEmail';
import { SurveyInviteEmail } from '@/components/emails/SurveyInviteEmail';
import { db } from '@/db';
import { platformConfig } from '@/db/schema';

function replaceVars(html: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value ?? '');
  }, html);
}

const SAMPLE = {
  customerName: 'María González',
  serviceName: 'Corte y Peinado Premium',
  date: 'lunes, 15 de enero',
  time: '10:00 AM',
  branchName: 'Sucursal Central',
  staffName: 'Ana López',
  tenantName: 'Salón Bella',
  oldDate: 'viernes, 12 de enero',
  oldTime: '02:00 PM',
  newDate: 'lunes, 15 de enero',
  newTime: '10:00 AM',
  businessName: 'Salón Bella',
  daysLeft: '3',
  adminName: 'Carlos Rodríguez',
  surveyUrl: 'https://zyncrox.com/survey/demo',
};

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const template = req.nextUrl.searchParams.get('template');
  const cfg = await db.select().from(platformConfig).limit(1).then(rows => rows[0] ?? null);

  let html = '';

  switch (template) {
    case 'confirmation': {
      if (cfg?.emailTplConfirmation) {
        html = replaceVars(cfg.emailTplConfirmation, SAMPLE);
      } else {
        html = await render(React.createElement(BookingConfirmationEmail, {
          customerName: SAMPLE.customerName,
          serviceName: SAMPLE.serviceName,
          date: SAMPLE.date,
          time: SAMPLE.time,
          branchName: SAMPLE.branchName,
          staffName: SAMPLE.staffName,
          tenantName: SAMPLE.tenantName,
        }));
      }
      break;
    }
    case 'reminder': {
      if (cfg?.emailTplReminder) {
        html = replaceVars(cfg.emailTplReminder, SAMPLE);
      } else {
        html = await render(React.createElement(BookingReminderEmail, {
          customerName: SAMPLE.customerName,
          serviceName: SAMPLE.serviceName,
          date: SAMPLE.date,
          time: SAMPLE.time,
          branchName: SAMPLE.branchName,
          staffName: SAMPLE.staffName,
          tenantName: SAMPLE.tenantName,
        }));
      }
      break;
    }
    case 'cancellation': {
      if (cfg?.emailTplCancellation) {
        html = replaceVars(cfg.emailTplCancellation, SAMPLE);
      } else {
        html = await render(React.createElement(BookingCancellationEmail, {
          customerName: SAMPLE.customerName,
          serviceName: SAMPLE.serviceName,
          date: SAMPLE.date,
          time: SAMPLE.time,
          branchName: SAMPLE.branchName,
          tenantName: SAMPLE.tenantName,
        }));
      }
      break;
    }
    case 'reschedule': {
      if (cfg?.emailTplReschedule) {
        html = replaceVars(cfg.emailTplReschedule, SAMPLE);
      } else {
        html = await render(React.createElement(BookingRescheduleEmail, {
          customerName: SAMPLE.customerName,
          serviceName: SAMPLE.serviceName,
          oldDate: SAMPLE.oldDate,
          oldTime: SAMPLE.oldTime,
          newDate: SAMPLE.newDate,
          newTime: SAMPLE.newTime,
          branchName: SAMPLE.branchName,
          staffName: SAMPLE.staffName,
          tenantName: SAMPLE.tenantName,
        }));
      }
      break;
    }
    case 'trialWarning': {
      if (cfg?.emailTplTrialWarning) {
        html = replaceVars(cfg.emailTplTrialWarning, SAMPLE);
      } else {
        html = await render(React.createElement(TrialWarningEmail, {
          businessName: SAMPLE.businessName,
          daysLeft: parseInt(SAMPLE.daysLeft),
          adminName: SAMPLE.adminName,
        }));
      }
      break;
    }
    case 'surveyInvite': {
      if (cfg?.emailTplSurveyInvite) {
        html = replaceVars(cfg.emailTplSurveyInvite, SAMPLE);
      } else {
        html = await render(React.createElement(SurveyInviteEmail, {
          customerName: SAMPLE.customerName,
          tenantName: SAMPLE.tenantName,
          surveyUrl: SAMPLE.surveyUrl,
        }));
      }
      break;
    }
    default:
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 });
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
