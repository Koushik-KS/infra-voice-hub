# Citizen Pulse

CivilIntel Frontend Design Prompt

Build a modern, professional, high-impact frontend for a project called CivilIntel – AI-Powered Citizen Development Intelligence Platform.

Project Purpose

CivilIntel is a scalable multilingual Digital Public Good designed to help governments understand citizen development needs and make better infrastructure investment decisions.

Governments currently receive development requests through fragmented channels and in multiple languages. This makes it difficult to identify real infrastructure gaps, demand hotspots, and high-priority projects.

CivilIntel solves this by collecting citizen development requests through text, voice, and messaging channels, analyzing them with AI, and combining citizen demand with demographic data, infrastructure indices, and public investment data.

The platform helps policymakers answer:

Where is citizen demand highest?

What infrastructure problems are most urgent?

Which regions are underserved?

What development project should be prioritized?

Why should that project receive priority?

Important Technical Requirement

Build only the frontend using:

React

Vite

JavaScript only, NOT TypeScript

Tailwind CSS

React Router

Axios

Recharts

Lucide React

Leaflet / React Leaflet

The frontend will connect to an existing Node.js + Express + MongoDB backend running locally at:

http://localhost:5000

Do not create Supabase authentication, Supabase database, Firebase, or any other backend/database.

Use clean, reusable React components and a professional folder structure.

Design Direction

The application should look like a premium government AI intelligence and analytics platform, not a simple complaint website.

Design style:

Modern and highly professional

Clean dashboard

Minimal but visually impressive

Trustworthy government/public infrastructure appearance

Premium AI analytics platform

Responsive on desktop, tablet, and mobile

Smooth transitions and hover effects

Good spacing and typography

Use Lucide icons

Avoid excessive gradients and excessive glass effects

Use subtle cards, borders, shadows, and clear visual hierarchy

Use a sophisticated color palette based on:

Deep navy / dark blue

Blue

White

Light gray backgrounds

Green for positive/completed status

Orange for warnings

Red for critical priority

Support light and dark mode.

Application Layout

Create a responsive layout with:

Sidebar

Logo and project name:

CivilIntel

Subtitle:

Development Intelligence Platform

Navigation items:

Overview

Submit Request

Requests

Demand Hotspots

Project Recommendations

Regional Intelligence

At the bottom of the sidebar:

Settings

Light/Dark mode toggle

On mobile, convert the sidebar into a responsive menu.

1. Overview Dashboard

Create a powerful policymaker dashboard.

Top header:

Good Morning, Policymaker

Subtitle:

Real-time intelligence from citizen development requests and regional infrastructure data.

Add a country selector for future BRICS scalability:

India

Brazil

Russia

China

South Africa

Default: India

Top KPI Cards

Display:

Total Citizen Requests

Active Demand Hotspots

Critical Issues

High Priority Projects

Each card should have:

Relevant Lucide icon

Large number

Small descriptive text

Optional trend indicator

Example values:

12,486 Total Requests

24 Demand Hotspots

183 Critical Issues

8 High Priority Projects

Demand by Category Chart

Create a professional bar chart showing:

Water

Road

Healthcare

Agriculture

Education

Electricity

Sanitation

Citizen Demand Trend

Create a line chart showing citizen requests over time.

Top Priority Regions

Show a table/card section with:

Rank

District

Category

Request Count

Priority Score

Priority Level

Example:

Chikkamagaluru | Water | 247 requests | 87/100 | Critical

Hassan | Road | 186 requests | 76/100 | High

Mandya | Agriculture | 143 requests | 68/100 | High

Use visually clear priority badges:

Critical = Red

High = Orange

Medium = Yellow

Low = Green

AI Insight Card

Create a prominent card titled:

CivilIntel AI Insight

Example insight:

“Chikkamagaluru shows a significant drinking water infrastructure gap. High citizen demand, low infrastructure performance, and insufficient investment indicate that this region should be prioritized.”

Add an AI/brain icon.

2. Submit Development Request Page

This is the citizen-facing page.

Title:

Report a Development Need

Subtitle:

Help shape development priorities in your region. Submit your infrastructure or public service concern.

Create a clean form with:

Input Fields

Citizen Name (optional)

Development Request / Message

Country

State

District

Message Input

Large textarea with placeholder:

“Describe the development problem in your area. You can write in your preferred language.”

Example:

“ನಮ್ಮ ಊರಿನಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ ಇದೆ”

Add a character counter.

Language Support

Display:

AI supports multilingual requests

Show language chips:

English

ಕನ್ನಡ

हिन्दी

Português

Русский

中文

Input Method

Create three tabs or buttons:

Text

Voice

Messaging

For Voice, create a microphone interface using browser speech recognition.

Show:

Microphone button

Recording animation when active

Recognized speech area

Location

Fields:

Country

State

District

Also include a “Use Current Location” button.

Submit Button

Large button:

Analyze & Submit Request

After submission, show a polished analysis result card.

Example:

AI Analysis Complete

Detected Language: Kannada

Category: Water

Priority: High

Status: Submitted Successfully

Do not require the user to manually select category or priority. The backend automatically analyzes these.

3. Requests Page

Create a page showing all submitted citizen development requests.

Title:

Citizen Development Requests

Add:

Search bar

Filter by category

Filter by priority

Filter by state

Filter by district

Filter by source

Date filter

Create a responsive data table.

Columns:

Request

Category

Location

Language

Priority

Source

Status

Date

Use badges for:

Category:

Water

Road

Healthcare

Agriculture

Education

Electricity

Sanitation

Other

Priority:

Critical

High

Medium

Low

Clicking a request should open a detailed modal or side panel.

4. Demand Hotspots Page

This page should visually demonstrate the geographic intelligence capability of CivilIntel.

Title:

Demand Hotspots

Subtitle:

Regions with concentrated citizen demand requiring attention.

At the top show summary cards:

Total Hotspots

Critical Hotspots

Most Requested Category

Most Affected District

Create an interactive map using Leaflet and OpenStreetMap.

Show hotspot markers for sample Indian locations.

Marker size/intensity should represent demand.

Color:

Red = Critical

Orange = High

Yellow = Medium

Green = Low

When clicking a marker, show:

District

State

Category

Request Count

Critical Requests

High Priority Requests

Below the map, show a ranked hotspot table.

Columns:

Rank

District

State

Category

Request Count

Critical Count

High Count

5. Project Recommendations Page

This is the most important policymaker decision page.

Title:

AI-Powered Project Recommendations

Subtitle:

Data-driven recommendations generated from citizen demand and regional development indicators.

Display recommendation cards ranked by Priority Score.

Example:

Priority #1

Chikkamagaluru – Drinking Water Infrastructure

Priority Score:

87 / 100

Badge:

CRITICAL

Show score progress bar.

Why This Project?

Show four transparent scoring factors:

Citizen Demand: 40 points

Urgency: 8 points

Infrastructure Gap: 17 points

Population Impact: 12 points

Investment Gap: 10 points

Also display regional context:

Population

Infrastructure Index

Public Investment

Total Citizen Requests

Add an AI-generated explanation:

“High citizen demand combined with a significant infrastructure gap and limited public investment makes drinking water infrastructure the highest priority for this region.”

Add a clear recommended action:

Prioritize Drinking Water Infrastructure Project

Create multiple recommendation cards for:

Water

Road

Healthcare

Agriculture

Education

Electricity

Sanitation

Sort by highest Priority Score.

6. Regional Intelligence Page

Create a detailed data intelligence page.

Allow selecting:

Country

State

District

Show:

Regional Profile

Population

Infrastructure Index

Public Investment

Total Citizen Requests

Critical Requests

Infrastructure Gap

Use a radial/progress visualization for the Infrastructure Index.

Demand Distribution

Use a donut chart showing categories.

Priority Factors

Use a horizontal bar chart showing:

Citizen Demand

Urgency

Infrastructure Gap

Population Impact

Investment Gap

Add a section:

Development Intelligence Summary

Generate a professional natural-language summary based on the displayed data.

Backend API Integration

Use Axios and create a reusable API service.

Base URL:

http://localhost:5000/api

Existing endpoints:

Development Requests

GET:

/requests

POST:

/requests

Example POST body:

{
  "citizenName": "Anonymous Citizen",
  "message": "There is a serious drinking water problem in our village.",
  "language": "en",
  "location": {
    "country": "India",
    "state": "Karnataka",
    "district": "Chikkamagaluru"
  },
  "source": "Text"
}


The backend automatically returns AI analysis including category and priority.

Hotspots

GET:

/intelligence/hotspots

Expected fields:

district

state

category

requestCount

criticalCount

highCount

Project Recommendations

GET:

/intelligence/recommendations

Expected fields include:

country

state

district

category

citizenDemand

regionalContext

priority

recommendedProject

Priority contains:

totalScore

level

breakdown

Do not hardcode the main application data when the backend API is available. Use loading states, empty states, and error states.

For visual demonstration, if an API has no data yet, show clearly labeled sample/demo data rather than pretending it is live data.

Priority Score Explanation

The recommendation system uses a transparent scoring model.

Factors:

Citizen Demand

Urgency

Infrastructure Gap

Population Impact

Investment Gap

Final score is capped at:

100

Priority levels:

80–100: Critical

60–79: High

35–59: Medium

Below 35: Low

Create a small “How is this score calculated?” tooltip or information modal explaining this transparent methodology.

Important Product Message

Throughout the application, communicate that CivilIntel is:

“Turning citizen voices into data-driven development decisions.”

The platform should feel scalable beyond India and suitable for BRICS nations.

Add a small footer:

CivilIntel — A Digital Public Good for Smarter Development Decisions

Build all pages, components, navigation, responsive states, loading states, empty states, and polished interactions. Prioritize a professional hackathon-quality product that clearly demonstrates the complete flow from citizen voice to government development decision.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://infra-voice-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/31d55673-51c7-4677-a9af-5b1ce2f51e5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
