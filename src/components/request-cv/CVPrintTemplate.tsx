'use client';

import { forwardRef } from 'react';
import { WorkerCV } from '@/data/cvData';

type Props = {
  worker: WorkerCV;
  locale?: string;
};

const COLOR_DARK = '#1A1F00';
const COLOR_MID = '#E8870A';
const COLOR_LIGHT_BG = '#F5F5F0';
const TEXT_MAIN = '#1A1F00';
const TEXT_MUTED = '#666666';

const CVPrintTemplate = forwardRef<HTMLDivElement, Props>(({ worker, locale = 'en' }, ref) => {
  const isAr = locale === 'ar';
  const name = isAr ? worker.nameAr : worker.name;
  const jobTitle = isAr ? worker.jobTypeAr : worker.jobType;
  const bio = isAr ? worker.bioAr : worker.bio;
  const skills = isAr ? worker.skillsAr : worker.skills;

  return (
    <div
      ref={ref}
      style={{
        width: '794px',
        height: '1123px',
        position: 'relative',
        overflow: 'hidden',
        direction: isAr ? 'rtl' : 'ltr',
        backgroundColor: '#FFFFFF',
        fontFamily: '"Montserrat", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: TEXT_MAIN,
      }}
    >
      {/* ════════ BACKGROUND SHAPES ════════ */}
      <svg viewBox="0 0 794 140" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '140px', zIndex: 1, transform: isAr ? 'scaleX(-1)' : 'none' }}>
        <polygon points="0,60 794,110 0,140" fill={COLOR_LIGHT_BG} />
        <polygon points="794,20 794,140 180,80" fill={COLOR_MID} />
        <polygon points="0,0 794,0 794,30 0,110" fill={COLOR_DARK} />
      </svg>

      <svg viewBox="0 0 794 140" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 1, transform: isAr ? 'scaleX(-1)' : 'none' }}>
        <polygon points="0,30 794,70 794,140 0,140" fill={COLOR_LIGHT_BG} />
        <polygon points="0,50 794,90 794,140 0,140" fill={COLOR_MID} />
        <polygon points="0,100 794,20 794,140 0,140" fill={COLOR_DARK} />
      </svg>

      {/* ════════ FOREGROUND CONTENT ════════ */}
      <div style={{ position: 'relative', zIndex: 10, padding: '110px 45px 130px 45px', display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', gap: '35px', alignItems: 'center', marginBottom: '40px' }}>
          {/* Photo */}
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '25px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#f0f0f0'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={worker.photoUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Name & Title */}
          <div style={{ flex: 1, paddingInlineStart: '10px' }}>
            <div style={{ fontSize: '42px', fontWeight: '900', color: TEXT_MAIN, textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.1 }}>
              {name}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '400', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '3px', marginTop: '8px' }}>
              {jobTitle}
            </div>
            <div style={{ width: '80px', height: '4px', backgroundColor: TEXT_MAIN, marginTop: '18px' }} />
          </div>
        </div>

        {/* ── COLUMNS ── */}
        <div style={{ display: 'flex', gap: '40px', flex: 1 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ width: '230px', display: 'flex', flexDirection: 'column', gap: '35px' }}>

            {/* CONTACT */}
            <div>
              <SectionTitleLeft title={isAr ? 'تواصل' : 'CONTACT'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <ContactRow icon={<PhoneIcon />} text="+123-456-7890" />
                <ContactRow icon={<MailIcon />} text="hello@reallygreatsite.com" />
                <ContactRow icon={<PinIcon />} text={isAr ? 'المنطقة الشرقية، السعودية' : '123 Anywhere St., Any City'} />
                <ContactRow icon={<GlobeIcon />} text="www.reallygreatsite.com" />
              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <SectionTitleLeft title={isAr ? 'التعليم' : 'EDUCATION'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <EducationItem
                  date="2029 - 2030"
                  school={isAr ? 'جامعة بورسيل' : 'BORCELLE UNIVERSITY'}
                  lines={[
                    isAr ? 'ماجستير في إدارة الأعمال' : 'Master of Business Management'
                  ]}
                />
                <EducationItem
                  date="2025 - 2029"
                  school={isAr ? 'جامعة بورسيل' : 'BORCELLE UNIVERSITY'}
                  lines={[
                    isAr ? 'بكالوريوس في الأعمال' : 'Bachelor of Business',
                    'GPA: 3.8 / 4.0'
                  ]}
                />
              </div>
            </div>

            {/* SKILLS */}
            {skills.length > 0 && (
              <div>
                <SectionTitleLeft title={isAr ? 'المهارات' : 'SKILLS'} />
                <ul style={{ margin: 0, paddingInlineStart: '18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: TEXT_MAIN, fontWeight: '500' }}>
                  {skills.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* PROFILE */}
            <div>
              <SectionTitleRight title={isAr ? 'الملف الشخصي' : 'PROFILE'} />
              <div style={{ fontSize: '11px', color: TEXT_MUTED, lineHeight: 1.7, textAlign: 'justify' }}>
                {bio}
              </div>
            </div>

            {/* WORK EXPERIENCE */}
            <div>
              <SectionTitleRight title={isAr ? 'خبرة العمل' : 'WORK EXPERIENCE'} />
              <div style={{
                borderInlineStart: `1.5px solid ${TEXT_MAIN}`,
                paddingInlineStart: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <ExperienceItem
                  date="2030 - PRESENT"
                  company="Borcelle Studio"
                  title={isAr ? `مدير ومختص ${worker.jobTypeAr}` : `${worker.jobType} Manager & Specialist`}
                  bullets={[
                    isAr ? 'تطوير وتنفيذ استراتيجيات وحملات تسويقية شاملة.' : 'Develop and execute comprehensive marketing strategies and campaigns that align with the company\'s goals and objectives.',
                    isAr ? 'قيادة وتوجيه وإدارة فريق تسويق عالي الأداء.' : 'Lead, mentor, and manage a high-performing marketing team, fostering a collaborative and results-driven work environment.',
                    isAr ? 'مراقبة اتساق العلامة التجارية عبر قنوات التسويق.' : 'Monitor brand consistency across marketing channels and materials.'
                  ]}
                />

                {worker.experience >= 3 && (
                  <ExperienceItem
                    date="2025 - 2029"
                    company="Fauget Studio"
                    title={isAr ? `مدير ومختص ${worker.jobTypeAr}` : `${worker.jobType} Manager & Specialist`}
                    bullets={[
                      isAr ? 'إنشاء وإدارة ميزانية التسويق بشكل فعال.' : 'Create and manage the marketing budget, ensuring efficient allocation of resources and optimizing ROI.',
                      isAr ? 'الإشراف على أبحاث السوق لتحديد الاتجاهات الناشئة.' : 'Oversee market research to identify emerging trends, customer needs, and competitor strategies.',
                      isAr ? 'مراقبة اتساق العلامة التجارية عبر قنوات التسويق.' : 'Monitor brand consistency across marketing channels and materials.'
                    ]}
                  />
                )}
              </div>
            </div>

            {/* REFERENCE */}
            <div style={{ marginTop: 'auto' }}>
              <SectionTitleRight title={isAr ? 'المراجع' : 'REFERENCE'} />
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>Benjamin Shah</div>
                  <div style={{ fontSize: '11px', color: TEXT_MAIN, marginTop: '3px' }}>Wardiere Inc. / CTO</div>
                  <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '6px' }}>Phone: 123-456-7890</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>Ketut Susilo</div>
                  <div style={{ fontSize: '11px', color: TEXT_MAIN, marginTop: '3px' }}>Wardiere Inc. / CEO</div>
                  <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '6px' }}>Phone: 123-456-7890</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

CVPrintTemplate.displayName = 'CVPrintTemplate';
export default CVPrintTemplate;

// ── Helpers & Components ──────────────────────────────────────────────────────

function SectionTitleLeft({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: '15px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      color: TEXT_MAIN,
      marginBottom: '16px',
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
  );
}

function SectionTitleRight({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <div style={{
        fontSize: '15px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        color: TEXT_MAIN,
        paddingInlineEnd: '15px',
        textTransform: 'uppercase'
      }}>
        {title}
      </div>
      <div style={{ flex: 1, height: '1.5px', backgroundColor: '#D1D1D1' }} />
    </div>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ color: TEXT_MAIN, display: 'flex', alignItems: 'center' }}>
        {icon}
      </div>
      <div style={{ color: TEXT_MAIN, fontSize: '10.5px', fontWeight: '500' }}>{text}</div>
    </div>
  );
}

function EducationItem({ date, school, lines }: { date: string; school: string; lines: string[] }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: TEXT_MAIN, marginBottom: '4px' }}>{date}</div>
      <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: TEXT_MAIN, marginBottom: '6px', textTransform: 'uppercase' }}>{school}</div>
      <ul style={{ margin: 0, paddingInlineStart: '18px', fontSize: '10.5px', color: TEXT_MUTED, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {lines.map((l, i) => <li key={i} style={{ paddingInlineStart: '4px' }}>{l}</li>)}
      </ul>
    </div>
  );
}

function ExperienceItem({ date, company, title, bullets }: { date: string; company: string; title: string; bullets: string[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        insetInlineStart: '-24.5px',
        top: '3px',
        width: '9px',
        height: '9px',
        borderRadius: '50%',
        backgroundColor: TEXT_MAIN
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>{company}</div>
        <div style={{ fontSize: '10.5px', color: TEXT_MUTED, textTransform: 'uppercase' }}>{date}</div>
      </div>
      <div style={{ fontSize: '12px', color: TEXT_MAIN, marginBottom: '10px' }}>{title}</div>
      <ul style={{ margin: 0, paddingInlineStart: '18px', fontSize: '11px', color: TEXT_MUTED, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {bullets.map((b, i) => <li key={i} style={{ paddingInlineStart: '4px' }}>{b}</li>)}
      </ul>
    </div>
  );
}

// ── Icons ───────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.02l-2.2 2.2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}