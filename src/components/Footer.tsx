import { site } from "@/data/site";

type FooterProps = {
  footer?: typeof site.footer;
  email?: string;
};

export default function Footer({ footer = site.footer, email = site.email }: FooterProps = {}) {

  return (
    <footer className="footer" aria-label="Footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a className="footer__logo" href="#home" aria-label="Novel Axis Solutions">
            <span className="nav__logo-mark" aria-hidden="true">
              N
            </span>
            <span className="footer__logo-text">NOVEL AXIS SOLUTIONS</span>
          </a>
          <p className="footer__tagline">{footer.tagline}</p>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={`Footer — ${col.title}`}>
            <h4 className="footer__title">{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer__col">
          <h4 className="footer__title">{footer.contactTitle}</h4>
          <ul>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {footer.socials.map((name) => (
              <li key={name}>
                <a href="#" aria-label={`${name} (placeholder)`}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{footer.copyright}</p>
          <p className="footer__legal">
            <a href="#" aria-label="Privacy policy (placeholder)">
              Privacy
            </a>
            <span aria-hidden="true">•</span>
            <a href="#" aria-label="Terms (placeholder)">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}