# AnonymousDoc AI

Document processing webapp that uses AI to intelligently redact and anonymize sensitive information in PDFs, contracts, and reports while preserving document utility and context.

1. Users upload a document. 
2. The app uses AI to scan it and assign a "Cookie Score":

- Yummy Cookies (Green): Safe, non-sensitive data. The document is mostly public and safe. Minimal redaction needed
- Warm Cookies (Yellow): Potentially sensitive information. The document should be reviewed. Some information will be redacted.
- Flaming hot Cookies (Red): Highly sensitive PII (Personal Identifiable Information). The document is a privacy risk, users are advised to review before uploading