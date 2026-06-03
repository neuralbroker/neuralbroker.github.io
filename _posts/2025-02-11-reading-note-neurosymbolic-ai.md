---
title: "A reading note on neurosymbolic AI"
subtitle: "What I think I understand, and where I don't"
date: 2025-02-11
---

I read a survey on neurosymbolic AI last week. This is not a summary. This is a note to myself about what I think I understood, and what I'm not sure I did. If you're looking for a clean overview, find a better source.

## The pitch, as I understand it

Neural networks are good at fuzzy stuff. Perception, language, anything that looks like a high-dimensional pattern-matching problem. They are bad at things that require exact, compositional reasoning. Long chains of inference, formal constraints, the kind of stuff symbolic systems were good at in the 80s.

The neurosymbolic idea is to put the two together. A neural component handles the perception. A symbolic component handles the reasoning. The interface between them is the interesting part. Most of the disagreements in the literature are about how to draw that line.

## What I think I got

There are basically three camps:

- **Symbolic-neural.** A traditional symbolic system at the core, with neural networks plugged in as oracles. The neural net answers questions the symbolic system can't easily compute. The classic example is a theorem prover that uses a neural net to predict which axioms to try next.
- **Neural-symbolic.** A neural net at the core, with symbolic structure imposed on top. The architecture is neural but the loss function or the output constraints encode symbolic knowledge. The classic example is a network that outputs a parse tree.
- **Hybrid.** Both components are first-class. There's a controller that decides which one to use, and they communicate through some shared representation.

I think the first camp is the most principled. The third is the most ambitious. The second is the easiest to publish, because you can take any existing neural model and add a constraint.

## What I'm not sure about

I don't know if any of this works in a way that justifies the engineering cost. The benchmark numbers in the surveys look good, but I notice that the benchmarks are usually hand-picked, and the symbolic components are usually small enough that you could just write the rules. I'm not convinced the field has crossed the threshold where the hybrid system is doing something neither component could do alone.

There's also an alignment story here that I find suspicious. The pitch is that neurosymbolic systems are more interpretable, because you can read the symbolic trace. In practice the trace tells you what the system did, not why. The neural part still does the parts that are hard to interpret. You get a partial story and a feeling of safety that may not be earned.

I might be wrong about this. I'm not a neurosymbolic researcher. I'm someone who read a survey and is suspicious of things that look like silver bullets.

## What I'll take from it

Two things.

First, the framing is useful even if the systems aren't. The question "where does the perception end and the reasoning begin" is one I'm going to keep asking about every system I build. Most ML systems I see answer that question by accident, or not at all.

Second, I want to try building one. Not a research system. A small, stupid system where a neural net classifies a document and a symbolic system checks the classification against a set of rules I write. The point is to feel the interface. To find out where it breaks, what kinds of errors the symbolic part catches, what kinds it misses. To find out whether the engineering cost is worth it for the kind of work I do.

I'll write it up if I do.

## What I want to read next

I want to read more of the older work, the 90s stuff that was doing this before it was cool. There's a thread from Garcez and Lamb that I haven't followed yet. I want to read some of the more skeptical takes, the kind that show up in JMLR and not at NeurIPS. And I want to find a good failure case — a real neurosymbolic system that was deployed and broke, and someone wrote honestly about why.

If you know of any of those, I'd like to hear about it.
