---
title: "Your ML system will fail in production. Plan for it."
subtitle: "A postmortem of SentinelML"
date: 2024-12-03
---

I spent most of 2024 building [SentinelML](https://github.com/neuralbroker/sentinel-ml), a credit-card fraud detection system. The model part was the easy part. The model was a RandomForest on 25 features. I trained it, it hit 0.94 ROC-AUC on a held-out set, I wrote a FastAPI wrapper, I shipped it. The hard part was everything after that, and "everything after that" is most of what makes an ML system work.

This is the postmortem I wish I'd had before I started.

## The first thing that broke was the data, not the model

Two weeks into production, the model's precision started to drift. False positives went from 4% to 9% over ten days. The model hadn't changed. The data had.

What I learned: data drift is the default. Not a thing that might happen. A thing that is happening, all the time, invisibly. If you don't have a system to detect it, you will be the last person to know.

I added PSI (population stability index) on the top ten features and a KS test on the rest. Alert when PSI > 0.2 on any single feature. The numbers turned out to be tractable to interpret and easy to wire up. I should have done this before deploying.

## The second thing that broke was me

I retrained the model manually when drift crossed the threshold. That worked for about a month, then I missed a week. There was no alert. The model was making bad calls. I didn't know because I wasn't looking.

The fix was obvious in retrospect: schedule the retrain, not the person. I wrote a job that runs weekly, retrains on the last 60 days of data, and only ships the new model if it beats the old one on a fresh holdout. The whole thing is about 80 lines. I had avoided writing it because it felt like infrastructure work, and I wanted to be doing model work.

Both kinds of work matter. The infrastructure work is what keeps the model work running.

## The third thing that broke was the right thing

I had a feature called `txn_velocity_24h` — the count of transactions on the card in the last 24 hours. It was a hand-engineered feature, the kind of thing feature-selection papers tell you to distrust. It turned out to be the most important feature in the model by a wide margin. SHAP values, permutation importance, and partial dependence all agreed.

The lesson wasn't "feature engineering beats deep learning" — that would be the kind of take I'd roll my eyes at. The lesson was that *domain knowledge shows up in the features*. The model can't see what you didn't put in. I knew what `txn_velocity_24h` meant because I'd read the fraud-team reports. The model learned the relationship because the relationship was true.

This is also why I'm skeptical of the "just throw the raw data at a transformer" framing. For tabular data with strong human-understandable structure, a feature you can name is usually better than an embedding you can't.

## What I would do differently

Three things:

1. **Build the monitoring before the model.** PSI on the inputs, calibration plots on the outputs, and a held-out stream of recent data the model never trains on. The point is not to detect every problem. The point is to detect problems faster than your users do.
2. **Treat retraining as a cron job, not a project.** If you have to think about whether to retrain, you've already lost. The decision should be automatic and the rollback should be automatic too.
3. **Spend more time on the data dictionary than the model card.** Anyone who works with the system in six months will need to know what every feature means, where it came from, and what assumptions it encodes. A model card is for outsiders. A data dictionary is for the next person on call at 3 AM.

## What this is not

This is not a tutorial. The techniques here are standard and you can find better explanations elsewhere. What I'm trying to do is give you a sense of where the time actually goes, because almost no public writeup does that. Most ML writeups are about the model. The model is the part you can describe in a paragraph. Everything else is the part you actually have to build.
