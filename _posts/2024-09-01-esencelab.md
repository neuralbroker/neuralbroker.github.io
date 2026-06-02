---
layout: post
title: "EsenceLab: Leading a Hackathon Team to Build Sentiment Analysis"
date: 2024-09-01
tags: [FastAPI, WebSockets, Team Lead]
description: "Led a team of 4 engineers to build a real-time sentiment analysis platform at a college hackathon. Won 2nd Prize at Innovision."
---

Hackathons are a different kind of engineering. You trade clean architecture for speed, and you learn more about teamwork in 48 hours than a semester of group projects.

EsenceLab was that project. I led a team of 4 to build a real-time sentiment analysis platform at the Innovision college hackathon.

## What we built

A web app that takes live text input — from social media streams or manual entry — and runs sentiment analysis in real time. The stack was FastAPI for the backend, WebSockets for streaming results, and VADER (a rule-based sentiment analyzer) for the NLP.

The frontend was a dashboard showing sentiment breakdowns, trends over time, and flagged items. We used WebSockets so new results appeared without refreshing the page.

## How it went

We won second prize. More importantly, the team gelled fast — everyone found their role within the first few hours. I learned that the best debugging tool isn't Stack Overflow; it's a teammate who's been staring at the same bug for 20 minutes and can spot the missing semicolon you've been ignoring.

## What I'd do differently

If I rebuilt this, I'd swap VADER for a transformer-based model (DistilBERT or similar) for better accuracy. At the time, VADER was quick to integrate and good enough for the demo. A production version would need better accuracy, especially for sarcasm and context-dependent sentiment.
