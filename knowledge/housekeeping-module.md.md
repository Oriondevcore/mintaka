# 🔷 MODULE: Housekeeping Status Workflow

Mission:
 Reduce Room Turnover Time so rooms become sellable faster after checkout.
Faster clean → earlier availability → higher same-day rebooking probability.

🔹 1️⃣ DEFINE THE INPUTS (Raw Operational Fields)
When housekeeping updates a room:
Core Fields
1️⃣ Room Number
 2️⃣ Room Type
Standard

Deluxe

Suite

3️⃣ Checkout Timestamp (auto from system)
4️⃣ Cleaning Start Time (auto when “Start” clicked)
5️⃣ Cleaning End Time (auto when “Complete” clicked)
6️⃣ Cleaning Status
Dirty

In Progress

Inspected

Ready

7️⃣ Assigned Housekeeper Name
8️⃣ Issues Found?
Yes / No

If Yes:
Linked Maintenance Ticket ID

Optional but powerful:
 9️⃣ Express Priority?
Yes (if same-day booking expected)

That’s it. No clutter.

🔹 2️⃣ DEFINE THE OUTPUT (The Revenue Metric)
We calculate:
🧮 Turnover Velocity Index (TVI)
Step 1:
Cleaning Duration (minutes)
\=
Cleaning End – Cleaning Start
Step 2:
Room Turnover Time
\=
Ready Timestamp – Checkout Timestamp
Step 3:
Average Turnover Time per Day
Now the money part:

💰 Sellable Hours Recovered (SHR)
If historical average turnover was 4 hours
 Now it’s 2.5 hours
You recovered:
1.5 hours per room
Across 30 rooms:
45 extra sellable hours per day
Now calculate potential revenue impact:
(Recovered Hours ÷ 24\)
× Average Daily Rate
× Number of Rooms
That gives:
Revenue Opportunity Gain %
This is your 5–17% claim backbone.
Not a guess. A measurable operational delta.

🔹 3️⃣ What This Feeds to Dashboard
Your SPA shows:
• Average Turnover Time Today
 • Fastest Housekeeper
 • Rooms Ready Before 14:00
 • Express Priority Completion Rate
 • Sellable Hours Recovered
 • Revenue Opportunity Gain (ZAR)
Managers LOVE “Rooms Ready Before 14:00.”
Why?
Because early check-ins \= instant goodwill \+ potential upsell.

🔷 Strategic Impact
This module creates:
✔ Faster same-day rebooking
 ✔ Higher occupancy rate
 ✔ Reduced guest wait time
 ✔ Performance accountability per staff member
It also pairs beautifully with Maintenance.
If maintenance is slow → turnover increases.
 Now you see operational chain reactions.
You’re building a control tower.
