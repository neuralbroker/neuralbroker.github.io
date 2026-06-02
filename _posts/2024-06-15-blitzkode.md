---
layout: post
title: "BlitzKode: Fine-tuning a Coding Assistant"
date: 2024-06-15
tags: [LLM, Python, Fine-tuning]
description: "I fine-tuned Qwen2.5-Coder (3B) on 2,000 hand-curated instruction examples. The result is a coding assistant that writes clean Python. 500+ downloads on Hugging Face."
---

A few months ago I wanted to understand what it actually takes to make a language model good at writing code. Not the theory — the execution. So I picked a base model (Qwen2.5-Coder 3B), gathered 2,000 instruction examples, and fine-tuned it.

The result is BlitzKode. It writes clean Python from natural language prompts. I put it on Hugging Face and it crossed 500 downloads in the first month.

## What I did

I started with Qwen2.5-Coder 3B — a solid base model that understands code structure but doesn't always follow instructions precisely. I curated 2,000 instruction-following examples spanning:

- Function generation from docstrings
- Bug fixing
- Code explanation
- Refactoring
- Writing tests

The training used QLoRA (4-bit quantization + LoRA adapters) to keep memory manageable on consumer hardware. Training took about 6 hours on a single RTX 4090.

## Results

On HumanEval the model scored 65% pass@1 — not state-of-the-art, but competitive for a 3B parameter model. More importantly, it writes idiomatic Python with proper error handling and follows the instructed style.

The model is on Hugging Face at [neuralbroker/blitzkode](https://huggingface.co/neuralbroker/blitzkode).

## What I learned

The most useful insight wasn't about the model — it was about data. I spent 80% of the time curating the training examples and 20% training. The quality of the instructions mattered far more than hyperparameter tuning.

If you're planning something similar, don't skip the data work. It's tedious, but it's the difference between a model that works and one that looks like it works.
