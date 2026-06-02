---
layout: post
title: "SentinelML: Production Fraud Detection"
date: 2025-01-10
tags: [ML, Random Forest, MLOps, FastAPI]
description: "Full MLOps fraud detection system with 25 engineered features, 0.94 ROC-AUC, drift detection, auto-retraining, and Prometheus/Grafana observability. Deployable via Docker Compose."
---

Fraud detection is a classic ML problem — imbalanced classes, adversarial patterns, and the constant pressure to catch more without flagging everything as suspicious.

SentinelML isn't a notebook. It's a full MLOps system: synthetic data generation, feature engineering, model training, FastAPI serving, Redis caching, PostgreSQL audit logging, drift detection, and auto-retraining.

## Architecture

<div class="diagram">
<div class="diagram-title">MLOps Pipeline</div>
<div class="mermaid">
graph TD
    subgraph Data["Data Layer"]
        A[SyntheticDataGenerator] -->|50K transactions| B[DataPreprocessor]
    end

    subgraph Features["Feature Engineering"]
        B --> C[FeatureEngineer]
        C -->|25 features| D[fit_transform]
    end

    subgraph Model["Model Training"]
        D --> E[ModelTrainer]
        E -->|RandomForest| F[0.94 ROC-AUC]
        F -->|Joblib| G[Model Artifact]
    end

    subgraph Serve["Serving"]
        G --> H[FastAPI Server]
        H -->|/predict| I[Redis Cache]
        H -->|Audit| J[PostgreSQL]
    end

    subgraph Monitor["Monitoring"]
        K[DriftDetector] -->|PSI + KS test| L[AlertingSystem]
        L -->|auto-retrain| E
        K -->|MLflow| M[Experiment Tracking]
    end

    H --> K
</div>
</div>

## How it works

### Feature engineering pipeline

The heart of the ML system. 25 features across 4 categories: time-based, user behavioral, risk scores, and change detection.

<div class="code-callout">
<div class="code-label">engineering.py — Feature Pipeline</div>

```python
def fit_transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, List[str]]:
    df = self.extract_time_features(df)      # hour, day, weekend, night
    df = self.compute_user_features(df)       # velocity, z-scores, rolling windows
    df = self.compute_risk_scores(df)         # merchant/country risk
    df = self.compute_change_features(df)     # device/location switches
    df = self.encode_categorical(df, fit=True)
    df = self.normalize_features(df, fit=True)
    return df[feature_cols].values, feature_cols
```
</div>

The `compute_user_features` method uses rolling windows (1h, 24h, 7d), cumulative counts, and z-scores to build per-user behavioral baselines that catch anomalies. The `txn_velocity_1h` feature alone improved AUC by 6 points — it catches the pattern where fraudsters drain an account quickly before detection.

### Chronological data splitting

A critical detail done correctly. The data is sorted by timestamp and split chronologically (not randomly), which prevents future information leakage. The feature engineer is fit only on training data and applied without refitting to test data.

<div class="code-callout">
<div class="code-label">trainer.py — Chronological Split</div>

```python
df = df.sort_values("timestamp")
test_cutoff = int(len(df) * (1 - test_size))
train_df = df.iloc[:test_cutoff]
test_df = df.iloc[test_cutoff:]

X_train, feature_names = self.feature_engineer.fit_transform(train_df)
X_test = self.feature_engineer.transform(test_df)  # no refit
```
</div>

### Drift detection with PSI and KS tests

The monitoring system tracks feature distribution shift using Population Stability Index (PSI) and Kolmogorov-Smirnov tests. When drift exceeds thresholds, the system automatically triggers retraining.

<div class="code-callout">
<div class="code-label">drift.py — PSI Calculation</div>

```python
def calculate_psi(self, feature_name, test_data=None, buckets=10):
    reference = self.reference_distributions[feature_name]
    breakpoints = np.percentile(reference, np.linspace(0, 100, buckets + 1))
    ref_pct = np.histogram(reference, bins=breakpoints)[0] / len(reference) + 1e-10
    test_pct = np.histogram(test_data, bins=breakpoints)[0] / len(test_data) + 1e-10
    psi = np.sum((test_pct - ref_pct) * np.log(test_pct / ref_pct))
    return psi
```
</div>

PSI interpretation: <0.1 = stable, 0.1–0.25 = moderate change, >0.25 = significant change. Combined with KS tests and threshold-based alerting, this creates a closed-loop monitoring pipeline.

## Metrics

<div class="metrics">
    <div class="metric"><span class="metric-value">0.94</span><span class="metric-label">ROC-AUC</span></div>
    <div class="metric"><span class="metric-value">25</span><span class="metric-label">Features</span></div>
    <div class="metric"><span class="metric-value">50K</span><span class="metric-label">Transactions</span></div>
    <div class="metric"><span class="metric-value">22</span><span class="metric-label">Tests</span></div>
</div>

## Impact

<div class="impact">
<div class="impact-title">Why this matters</div>

**Production-ready architecture, not a notebook.** Training pipeline, versioned model artifacts, feature pipeline persistence, FastAPI serving, Redis caching, PostgreSQL audit logging, MLflow experiment tracking, and Docker Compose orchestration.

**Domain-aware feature engineering.** The 25-feature pipeline captures what actually matters in fraud detection: velocity (transactions per hour/day), behavioral deviation (amount z-score vs. user history), temporal patterns (night/weekend flags), entity-level risk scores, and state-change detection (device/location switches).

**Self-correcting MLOps loop.** The retraining pipeline monitors for three triggers — scheduled intervals, new data volume, and data drift — and can automatically retrain. The A/B test simulation provides model comparison with traffic splitting for safe champion/challenger deployment.

**Graceful degradation everywhere.** Redis, PostgreSQL, and MLflow are all optional — the system logs warnings and continues without them. Same codebase works in development (no dependencies) and production (full stack).
</div>

The code is on [GitHub](https://github.com/neuralbroker/sentinel-ml).
