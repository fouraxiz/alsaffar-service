'use client';

import { forwardRef } from 'react';
import QRCode from 'react-qr-code';
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
  const languages = isAr ? worker.languagesAr : worker.languages;

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

      {/* ── BRANDING HEADER ── */}
      <div style={{
        position: 'absolute',
        top: '25px',
        insetInlineStart: '45px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>
          {isAr ? 'الصّفّار للخدمات العمالية' : 'ALSAFFAR MANPOWER'}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>
          {isAr ? 'شريك التوظيف الموثوق' : 'Trusted Recruitment Partner'}
        </div>
      </div>

      <svg viewBox="0 0 794 140" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 1, transform: isAr ? 'scaleX(-1)' : 'none' }}>
        <polygon points="0,0 794,15 794,140 0,140" fill={COLOR_LIGHT_BG} />
        <polygon points="0,15 794,30 794,140 0,140" fill={COLOR_MID} />
        <polygon points="0,30 794,45 794,140 0,140" fill={COLOR_DARK} />
      </svg>

      {/* ── BRANDING FOOTER ── */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '45px',
        right: '45px',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        color: '#FFFFFF'
      }}>
        {/* Left Side: Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isAr ? 'مكتب الصّفّار للاستقدام' : 'Alsaffar Recruitment'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PinIcon /> {isAr ? 'المنطقة الشرقية، المملكة العربية السعودية' : 'Eastern Province, Saudi Arabia'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneIcon /> +966 92 002 1201
          </div>
        </div>

        {/* Center: QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <QRCode value="https://alsaffar-service.com" size={56} />
          </div>
          <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>
            {isAr ? 'امسح الرمز للتواصل' : 'SCAN TO HIRE'}
          </div>
        </div>

        {/* Right Side: Online */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px', alignItems: 'flex-end', textAlign: 'end' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px', visibility: 'hidden' }}>
            SPACER
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MailIcon /> info@alsaffar-service.com
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GlobeIcon /> www.alsaffar-service.com
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', fontWeight: 'bold', color: COLOR_MID, letterSpacing: '0.5px' }}>
            {isAr ? 'مرخص من مساند' : 'MUSANED LICENSED'}
          </div>
        </div>
      </div>

      {/* ════════ FOREGROUND CONTENT ════════ */}
      <div style={{ position: 'relative', zIndex: 10, padding: '100px 45px 120px 45px', display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '20px' }}>
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
        <div style={{ display: 'flex', gap: '30px', flex: 1 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ width: '230px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* PERSONAL INFO */}
            <div>
              <SectionTitleLeft title={isAr ? 'معلومات شخصية' : 'PERSONAL INFO'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: TEXT_MAIN, fontWeight: '600' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                  <span style={{ color: TEXT_MUTED }}>{isAr ? 'العمر' : 'Age'}</span>
                  <span>{worker.age} {isAr ? 'سنة' : 'YRS'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                  <span style={{ color: TEXT_MUTED }}>{isAr ? 'الخبرة' : 'Experience'}</span>
                  <span>{worker.experience} {isAr ? 'سنوات' : 'YRS'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                  <span style={{ color: TEXT_MUTED }}>{isAr ? 'الديانة' : 'Religion'}</span>
                  <span>{isAr ? worker.religionAr : worker.religion}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                  <span style={{ color: TEXT_MUTED }}>{isAr ? 'الحالة الاجتماعية' : 'Status'}</span>
                  <span>{isAr ? worker.maritalStatusAr : worker.maritalStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ color: TEXT_MUTED }}>{isAr ? 'الراتب' : 'Salary'}</span>
                  <span style={{ color: COLOR_MID, fontWeight: '800', fontSize: '12px' }}>{worker.salaryExpectation}</span>
                </div>
              </div>
            </div>

            {/* LANGUAGES */}
            {languages && languages.length > 0 && (
              <div>
                <SectionTitleLeft title={isAr ? 'اللغات' : 'LANGUAGES'} />
                <ul style={{ margin: 0, paddingInlineStart: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: TEXT_MAIN, fontWeight: '500' }}>
                  {languages.map(l => <li key={l}>{l}</li>)}
                </ul>
              </div>
            )}

            {/* EDUCATION */}
            <div>
              <SectionTitleLeft title={isAr ? 'التعليم' : 'EDUCATION'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <ul style={{ margin: 0, paddingInlineStart: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: TEXT_MAIN, fontWeight: '500' }}>
                  {skills.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* PROFILE */}
            <div>
              <SectionTitleRight title={isAr ? 'الملف الشخصي' : 'PROFILE'} />
              <div style={{ fontSize: '11px', color: TEXT_MUTED, lineHeight: 1.5, textAlign: 'justify' }}>
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
                gap: '16px'
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
              <SectionTitleRight title={isAr ? 'الترخيص والاعتماد' : 'CERTIFICATION'} />
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>Ministry of HR</div>
                  <div style={{ fontSize: '11px', color: TEXT_MAIN, marginTop: '3px' }}>Government of Saudi Arabia</div>
                  <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '6px' }}>License Valid & Verified</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>Musaned Platform</div>
                  <div style={{ fontSize: '11px', color: TEXT_MAIN, marginTop: '3px' }}>Official Recruitment</div>
                  <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '6px' }}>Registered Agency</div>
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
      marginBottom: '10px',
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
  );
}

function SectionTitleRight({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: TEXT_MAIN, marginBottom: '2px' }}>{date}</div>
      <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: TEXT_MAIN, marginBottom: '4px', textTransform: 'uppercase' }}>{school}</div>
      <ul style={{ margin: 0, paddingInlineStart: '18px', fontSize: '10.5px', color: TEXT_MUTED, display: 'flex', flexDirection: 'column', gap: '2px' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: TEXT_MAIN }}>{company}</div>
        <div style={{ fontSize: '10.5px', color: TEXT_MUTED, textTransform: 'uppercase' }}>{date}</div>
      </div>
      <div style={{ fontSize: '12px', color: TEXT_MAIN, marginBottom: '6px' }}>{title}</div>
      <ul style={{ margin: 0, paddingInlineStart: '18px', fontSize: '11px', color: TEXT_MUTED, lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: '3px' }}>
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