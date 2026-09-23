"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { site } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

const INITIAL: FormValues = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

const socialAria: Record<string, string> = {
  GitHub: "GitHub (placeholder)",
  LinkedIn: "LinkedIn (placeholder)",
  X: "X / Twitter (placeholder)",
  Dribbble: "Dribbble (placeholder)",
};

type ContactProps = {
  email?: string;
  phone?: string;
  infoText?: string;
  socials?: readonly string[];
};

export default function Contact({
  email = site.email,
  phone = site.phone,
  infoText = site.contact.infoText,
  socials = site.contact.socials,
}: ContactProps = {}) {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [phase, setPhase] = useState<"idle" | "loading" | "sent">("idle");

  const update =
    (field: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: false }));
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Partial<Record<keyof FormValues, boolean>> = {};
    if (!values.name.trim()) next.name = true;
    if (!EMAIL_RE.test(values.email.trim())) next.email = true;
    if (!values.message.trim()) next.message = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("sent"), 1600);
  };

  const fieldClass = (field: keyof FormValues) =>
    `contact__field${errors[field] ? " is-error" : values[field] ? " is-valid" : ""}`;

  const selectOptions = (options: readonly string[], placeholder: string) => (
    <>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </>
  );

  return (
    <section className="contact section section--cream" id="contact" aria-label="Contact">
      <div className="container">
        <SectionHeading eyebrow="09 — CONTACT" title="What are you building?" />

        <div className="contact__layout">
          <div className="contact__info">
            <div className="contact__info-block">
              <p className="contact__info-text">{infoText}</p>
              <a className="contact__email" href={`mailto:${email}`} data-cursor="hover">
                {email}
              </a>
              {phone ? (
                <a
                  className="contact__phone"
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  data-cursor="hover"
                >
                  {phone}
                </a>
              ) : null}
            </div>

            <p className="contact__meta">Response within two business days.</p>

            <ul className="contact__socials">
              {socials.map((social, i) => (
                <li key={social}>
                  <a href="#" data-cursor="hover" aria-label={socialAria[social] ?? `${social} (placeholder)`}>
                    <span className="contact__social-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="contact__social-name">{social}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="contact__form" noValidate onSubmit={onSubmit}>
            <div className="contact__row">
              <div className={fieldClass("name")}>
                <label className="contact__label" htmlFor="cf-name">
                  Name
                </label>
                <input
                  className="contact__input"
                  type="text"
                  id="cf-name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update("name")}
                />
                <span className="contact__error">Please enter your name.</span>
              </div>

              <div className={fieldClass("email")}>
                <label className="contact__label" htmlFor="cf-email">
                  Email
                </label>
                <input
                  className="contact__input"
                  type="email"
                  id="cf-email"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={update("email")}
                />
                <span className="contact__error">Please enter a valid email address.</span>
              </div>
            </div>

            <div className="contact__row">
              <div className={fieldClass("company")}>
                <label className="contact__label" htmlFor="cf-company">
                  Company
                </label>
                <input
                  className="contact__input"
                  type="text"
                  id="cf-company"
                  name="company"
                  autoComplete="organization"
                  value={values.company}
                  onChange={update("company")}
                />
              </div>

              <div className={fieldClass("service")}>
                <label className="contact__label" htmlFor="cf-service">
                  Service
                </label>
                <select
                  className="contact__input contact__select"
                  id="cf-service"
                  name="service"
                  value={values.service}
                  onChange={update("service")}
                >
                  {selectOptions(site.contact.services, "Select a service…")}
                </select>
              </div>
            </div>

            <div className="contact__row">
              <div className={fieldClass("budget")}>
                <label className="contact__label" htmlFor="cf-budget">
                  Budget
                </label>
                <select
                  className="contact__input contact__select"
                  id="cf-budget"
                  name="budget"
                  value={values.budget}
                  onChange={update("budget")}
                >
                  {selectOptions(site.contact.budgets, "Select a range…")}
                </select>
              </div>

              <div className={fieldClass("timeline")}>
                <label className="contact__label" htmlFor="cf-timeline">
                  Timeline
                </label>
                <select
                  className="contact__input contact__select"
                  id="cf-timeline"
                  name="timeline"
                  value={values.timeline}
                  onChange={update("timeline")}
                >
                  {selectOptions(site.contact.timelines, "Select a timeline…")}
                </select>
              </div>
            </div>

            <div className={fieldClass("message")}>
              <label className="contact__label" htmlFor="cf-message">
                Project Description
              </label>
              <textarea
                className="contact__input contact__textarea"
                id="cf-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={update("message")}
              />
              <span className="contact__error">Tell us briefly what you&apos;re building.</span>
            </div>

            <div className="contact__submit">
              <button
                type="submit"
                className={`btn btn--primary${phase === "loading" ? " is-loading" : ""}${phase === "sent" ? " is-sent" : ""}`}
                data-cursor="hover"
              >
                <span className="btn__label">
                  {phase === "sent" ? "Sent" : "Send Project Inquiry"}
                </span>
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <span className="contact__status" role="status" aria-live="polite">
                {phase === "sent" ? "Thanks — we&apos;ll be in touch within two business days." : ""}
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}