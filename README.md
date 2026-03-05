# Bill Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority issue: the three-phase bill approval visibility and broken approval filter. It should display a bills list view with a clear multi-stage approval status indicator showing the current approval phase (e.g. 'Awaiting Approval', 'Partially Approved – Phase 2 Pending', 'Final Approval Required'). Each bill row should show which approvers have approved and who still needs to act. A working filter panel should allow users to filter bills by individual approver name and by approval phase/status. Clicking into a bill should show an approval timeline or audit trail panel. Additionally, a secondary section of the prototype should show a Day Works docket detail view with an 'Add Internal Note' capability that appends entries to an audit log without modifying the docket document itself.

## Features shown
- Additional approval status (e.g. 'Final Approval') to clearly indicate which approval phase a bill is in within a three-phase workflow
- Fix approval filter to correctly filter bills by individual approver when multiple approvers are assigned
- Ability to directly adjust the GST figure on a bill so subtotal and GST total match the physical invoice
- Reliable automatic bill syncing to Xero with clear error handling and visibility into sync status
- Ability to add internal notes or audit log entries to submitted Day Works dockets without the note appearing on the docket itself
- User-facing interface to view, upload, and amend Day Works charge rates directly within Varicon
- WBS copy/duplicate functionality to apply the same WBS assignment across all lines of a bill
- Lost time / stand-down tracking and reporting capability
- In-app approval status visibility to replace or supplement ineffective email notifications

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
