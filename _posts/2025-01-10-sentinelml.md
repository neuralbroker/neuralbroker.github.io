---
layout: post
title: "SentinelML: Fraud Detection with Feature Engineering"
date: 2025-01-10
tags: [ML, Random Forest, Feature Engineering]
description: "Built a fraud detection model using random forest with engineered features. 0.94 ROC-AUC."
---

Fraud detection is a classic ML problem — imbalanced classes, adversarial patterns, and the constant pressure to catch more without flagging everything as suspicious.

SentinelML is my take on it: a random forest classifier with carefully engineered features, scoring 0.94 ROC-AUC on the test set.

## The approach

I started with raw transaction data: amounts, timestamps, merchant categories, user history. From there, I engineered features that captured behavioral patterns:

- **Transaction velocity**: how many transactions a user makes in a rolling time window
- **Amount deviation**: how far a transaction deviates from the user's mean
- **Merchant diversity**: how many unique merchants a user visits
- **Time-of-day entropy**: whether transactions happen at unusual hours

The most impactful feature was transaction velocity. Adding it alone improved the ROC-AUC by 6 points. It catches the pattern where fraudsters drain an account quickly before detection.

## Results

The final model (random forest, 200 trees, max depth 12) scored 0.94 ROC-AUC with a precision of 0.87 at the operating point.

## What I learned

Good features beat good models. I spent more time understanding the transaction data — talking to domain experts, reading fraud reports — than tuning hyperparameters. The features I engineered from those conversations were worth more than any model architecture change.

The project code is on [GitHub](https://github.com/neuralbroker/sentinelml).
