"""Vercel serverless function for the portfolio contact form.

Sends the message through Resend (https://resend.com) so the form works
without an email client. If RESEND_API_KEY is not configured the endpoint
returns 503 and the frontend falls back to a mailto: compose window.
"""

import json
import os
import re
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

MAX_NAME = 80
MAX_SUBJECT = 140
MAX_MESSAGE = 5000

RESEND_URL = "https://api.resend.com/emails"


def _clean(value, limit):
    """Collapse newlines so values can't inject extra mail headers."""
    return " ".join(str(value or "").split())[:limit]


def _fail(handler, code, error):
    body = json.dumps({"ok": False, "error": error}).encode("utf-8")
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def _send_email(payload):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return 503, "email_not_configured"

    to_addr = os.environ.get("CONTACT_TO", "carljoshuamcoloma@gmail.com")
    from_addr = os.environ.get(
        "CONTACT_FROM", "Portfolio <onboarding@resend.dev>"
    )

    body = json.dumps(
        {
            "from": from_addr,
            "to": [to_addr],
            "reply_to": payload["email"],
            "subject": payload["subject"],
            "text": payload["body"],
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        RESEND_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            if 200 <= response.status < 300:
                return 200, None
            return 502, "send_failed"
    except urllib.error.HTTPError:
        return 502, "send_failed"
    except (urllib.error.URLError, TimeoutError):
        return 502, "send_failed"


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw_body = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw_body or b"{}")
        except json.JSONDecodeError:
            payload = {}

        # Honeypot: real users never fill this field in.
        if (payload.get("company") or "").strip():
            _fail(self, 400, "invalid_request")
            return

        name = _clean(payload.get("name"), MAX_NAME)
        email = _clean(payload.get("email"), MAX_NAME)
        subject = _clean(payload.get("subject"), MAX_SUBJECT)
        message = str(payload.get("message") or "").strip()[:MAX_MESSAGE]

        if not name or not message or not EMAIL_RE.match(email):
            _fail(self, 400, "invalid_request")
            return

        if not subject:
            subject = f"Portfolio enquiry from {name}"

        status, error = _send_email(
            {
                "name": name,
                "email": email,
                "subject": subject,
                "body": (
                    f"Name: {name}\n"
                    f"Email: {email}\n"
                    f"Subject: {subject}\n\n"
                    f"{message}"
                ),
            }
        )

        if status != 200:
            _fail(self, status, error)
            return

        body = json.dumps({"ok": True}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
