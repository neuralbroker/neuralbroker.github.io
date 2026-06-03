---
title: "Fine-tuning small models is mostly data work"
subtitle: "On BlitzKode and what I got wrong first"
date: 2024-11-15
---

I built a code-completion model last year. Qwen2.5-Coder at 1.5B parameters, instruction-tuned on a small dataset of synthetic coding tasks, then quantized to GGUF so it could run on a laptop. The repo is [BlitzKode](https://github.com/neuralbroker/blitzkode), and I keep it around mostly as a reference for the kind of work I want to do.

I learned almost nothing from the training itself. The thing I learned, and the thing I keep relearning, is that fine-tuning is a data problem before it's a model problem.

## The first version was bad

I had a base model and a list of ideas. I wrote a script to pull Python functions from a few popular open-source repos, paired each with a prompt like "write a function that does X," and ran a single supervised fine-tuning pass. The result was a model that was confidently wrong in a way no metric caught.

I had a held-out evaluation set. The model did well on it. It also did well on a tiny smoke-test I had written by hand. What I hadn't done was just *use it* for an hour. The first time I tried to get it to write anything outside the eval distribution, the outputs were mush. Token soup, made-up function names, syntax that parsed but meant nothing.

The eval was wrong. Not in any technical sense — the numbers were right, the splits were clean. The eval was wrong because it tested the wrong thing. It tested "does the model produce something that looks like the reference." I needed to test "does the model produce something I would have written."

## What changed

I rewrote the dataset. Three rules, in order of importance:

1. **Write the inputs and outputs yourself.** Not all of them — I used GPT-4 to bootstrap, but I personally audited every example that ended up in the final mix. I deleted about 60% of what the bootstrap model produced.
2. **Make the outputs look like the inputs.** The base model already had a strong prior. I wasn't trying to teach it Python. I was trying to teach it *my* Python. The dataset style matched the eval style, because they were the same person.
3. **Throw in adversarial examples.** Code that intentionally violates the style. Code with comments in it. Code with a bug I knew about. The model needs to learn what not to do, not just what to do.

The training run took the same time, used the same compute, used the same base model. The only thing that changed was the data. The model got dramatically better.

## The DPO stage was anticlimactic

I did a DPO pass after the SFT. I'd read enough papers to feel like I should. The numbers moved a little. In practice I couldn't tell the difference in real use, and the people I had try it couldn't either. The DPO pass is in the pipeline because it costs me nothing, not because I think it matters.

I think this is true more generally: the SFT data is the whole game. RLHF and DPO are last-mile polish on a thing that mostly needs to be the right thing in the first place.

## What I'm taking forward

The lesson isn't really about fine-tuning. It's about evaluation. A model is only as good as your ability to tell whether it's good, and the only way to build that ability is to use the model a lot, in the conditions you care about, and notice when it fails. Everything else is theater.

The other lesson is more humbling. The 1.5B model is, on any honest benchmark, worse than the 70B model I could call with an API key. The reason BlitzKode exists is because there's a class of problems where latency, cost, and offline use matter more than peak capability. If you don't have those constraints, you should just use a bigger model. Fine-tuning is for the cases where the bigger model isn't an option, or where the style of the output is the product.
