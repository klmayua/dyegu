#!/usr/bin/env python3
"""DYEGU Operations & Triage CLI (zero raw SQL needed).

Requires environment variables:
  SUPABASE_URL              (default: https://hhnvirsisuxumwchntjf.supabase.co)
  SUPABASE_SERVICE_ROLE_KEY (required for reading/updating protected tables)

Usage:
  python tools/ops_cli.py status
  python tools/ops_cli.py export-substack --out comeback_batch.csv [--mark]
  python tools/ops_cli.py enquiries [--limit 20]
  python tools/ops_cli.py volunteers [--limit 20]
  python tools/ops_cli.py circles
  python tools/ops_cli.py rebuilds [--care-only]
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import sys
import urllib.parse
import urllib.request

DEFAULT_URL = "https://hhnvirsisuxumwchntjf.supabase.co"


def api_req(path: str, method: str = "GET", body: dict | None = None, prefer: str | None = None):
    base = (os.environ.get("SUPABASE_URL") or DEFAULT_URL).rstrip("/")
    key = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
    if not key:
        raise SystemExit("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(f"{base}/rest/v1/{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8")
        return json.loads(raw) if raw else []


def cmd_status(_args):
    print("\n=== DYEGU OPERATIONS SNAPSHOT ===")
    for tbl in ["subscribers", "enquiries", "volunteers", "community_requests", "rebuilds"]:
        rows = api_req(f"{tbl}?select=id,created_at")
        print(f"  {tbl:<20} {len(rows):>6} total")

    try:
        cohorts = api_req("v_circle_cohorts_ready?select=*")
        if cohorts:
            print("\n--- Rebuild Circles Cohort Readiness ---")
            for c in cohorts:
                flag = "READY" if c.get("ready_to_launch") else "filling"
                print(f"  {c['stage']:<10} | {c['tz_band']:<18} | {c['waiting_members']:>2} waiting [{flag}]")
    except Exception:
        print("\n(Run site/supabase/migrations/001_ops_schema.sql to enable cohort readiness views.)")


def cmd_export_substack(args):
    rows = api_req("subscribers?select=id,email,stage,page,utm,created_at&list=eq.comeback_file&exported_at=is.null&order=created_at.asc")
    if not rows:
        print("No unexported comeback_file subscribers found.")
        return
    with open(args.out, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["email", "stage", "page", "utm", "created_at"])
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in w.fieldnames})
    print(f"Wrote {len(rows)} subscribers to {args.out}")
    if args.mark:
        batch_id = dt.datetime.now(dt.timezone.utc).strftime("substack_%Y%m%d_%H%M%S")
        now_iso = dt.datetime.now(dt.timezone.utc).isoformat()
        ids = ",".join(str(r["id"]) for r in rows)
        api_req(
            f"subscribers?id=in.({urllib.parse.quote(ids)})",
            method="PATCH",
            body={"exported_at": now_iso, "exported_batch_id": batch_id},
            prefer="return=minimal",
        )
        print(f"Marked {len(rows)} subscribers exported (batch: {batch_id}).")
    else:
        print("Dry-run only. Re-run with --mark after importing CSV into Substack.")


def cmd_list(table: str, fields: str, limit: int, extra_filter: str = ""):
    q = f"{table}?select={fields}&order=created_at.desc&limit={limit}{extra_filter}"
    rows = api_req(q)
    print(f"\n=== {table.upper()} (latest {len(rows)}) ===")
    for r in rows:
        print(" ", json.dumps(r, ensure_ascii=False))


def cmd_monday(_args):
    """Executive Monday readout aligned with 06_GROWTH/Launch_Feedback_Readout.md."""
    print("\n=== DYEGU MONDAY LAUNCH READOUT ===")
    subs = api_req("subscribers?select=list,stage,utm,created_at")
    by_list: dict[str, int] = {}
    by_stage: dict[str, int] = {}
    for s in subs:
        by_list[s.get("list") or "other"] = by_list.get(s.get("list") or "other", 0) + 1
        if s.get("stage"):
            by_stage[s["stage"]] = by_stage.get(s["stage"], 0) + 1
    print("  Subscribers by list:", json.dumps(by_list))
    print("  Top rebuild chapters:", json.dumps(dict(sorted(by_stage.items(), key=lambda x: -x[1])[:5])))
    enqs = api_req("enquiries?select=id,status&status=eq.new")
    vols = api_req("volunteers?select=id,status&status=eq.applied")
    rebs = api_req("rebuilds?select=id,priority_flag&status=eq.unread")
    care = sum(1 for r in rebs if r.get("priority_flag") == "care_review")
    print(f"  Pending triage: {len(enqs)} new enquiries | {len(vols)} volunteer apps | {len(rebs)} unread stories ({care} care_review)")
    try:
        cohorts = api_req("v_circle_cohorts_ready?select=*&ready_to_launch=eq.true")
        print(f"  Circles ready to open (>=6 members): {len(cohorts)}")
        for c in cohorts:
            print(f"    -> {c['stage']} ({c['tz_band']}): {c['waiting_members']} waiting")
    except Exception:
        pass


def main():
    p = argparse.ArgumentParser(description="DYEGU Operations CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("status").set_defaults(func=cmd_status)
    sub.add_parser("monday").set_defaults(func=cmd_monday)

    exp = sub.add_parser("export-substack")
    exp.add_argument("--out", default="comeback_file_export.csv")
    exp.add_argument("--mark", action="store_true", help="Mark rows exported_at=now() after writing CSV")
    exp.set_defaults(func=cmd_export_substack)

    enq = sub.add_parser("enquiries")
    enq.add_argument("--limit", type=int, default=20)
    enq.set_defaults(func=lambda a: cmd_list("enquiries", "id,created_at,name,organisation,kind,budget,event_date,status", a.limit))

    vol = sub.add_parser("volunteers")
    vol.add_argument("--limit", type=int, default=20)
    vol.set_defaults(func=lambda a: cmd_list("volunteers", "id,created_at,full_name,profession,country,hours_per_month,status", a.limit))

    cir = sub.add_parser("circles")
    cir.add_argument("--limit", type=int, default=30)
    cir.set_defaults(func=lambda a: cmd_list("community_requests", "id,created_at,kind,stage,timezone,topics,status,priority_flag", a.limit))

    reb = sub.add_parser("rebuilds")
    reb.add_argument("--limit", type=int, default=20)
    reb.add_argument("--care-only", action="store_true")
    reb.set_defaults(func=lambda a: cmd_list(
        "rebuilds",
        "id,created_at,first_name,stage,consent_contact,consent_feature,priority_flag,status",
        a.limit,
        "&priority_flag=eq.care_review" if a.care_only else "",
    ))

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
