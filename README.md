# 🥦 FreshPath ATL

> **Eating well shouldn't cost more than it should.**
> An AI-powered food-access app that helps Atlanta families in food deserts eat healthier on a tight budget — by planning weekly meals, mapping SNAP-friendly stores, and snapping photos for instant nutrition swaps.

🌐 **Live app:** https://freshpathatl.lovable.app

---

## 🎯 The Problem

We combined **two** Food A.I. Hackathon problem statements:

1. **Eating well costs more than it should.** Families on a budget are forced to choose between healthy and affordable, and the tools that exist don't bridge the gap.
2. **Atlanta food access.** 500,000+ Atlantans live more than a mile from a full-service grocery store. Families in West End, Bankhead, Vine City, Mechanicsville, and parts of South DeKalb pay up to **$3.50 more per meal** for the same staples found in better-stocked zip codes.

FreshPath bridges that gap with one app that plans, locates, and coaches — using **real Atlanta prices, real SNAP-accepting stores, and real nutrition data**.

---

## ✨ What the app does

| Page | Tool | What it solves |
|------|------|----------------|
| `/plan` | **Plan my week** | Tell us budget + family size → get a 5-meal plan, grocery list, money-saving swaps, and ingredient intelligence in ~20 seconds. |
| `/map` | **Find food near me** | Interactive Leaflet map of 8 SNAP-friendly Atlanta stores + 14 neighborhood access scores (food desert heatmap). |
| `/snap` | **Snap a meal** | Upload any meal photo → vision AI returns a health score, macro estimates, and cheap Atlanta-sourced fixes. |
| `/involved` | **Get involved** | Direct links to Atlanta Community Food Bank, Wholesome Wave Georgia, Open Hand Atlanta, Concrete Jungle. |

---

## 🤖 Multi-Agent Architecture (RAG pipeline)

All agents live in `src/lib/agents.functions.ts` and run as TanStack Start **server functions** on Cloudflare Workers. The LLM is reached through the **Lovable AI Gateway** (`src/lib/ai.ts`).

## Screenshots 

![FreshPath ATL](FreshpathATL/1.png)
![FreshPath ATL](FreshpathATL/2.png)
![FreshPath ATL](FreshpathATL/3.png)
![FreshPath ATL](FreshpathATL/4.png)
![FreshPath ATL](FreshpathATL/5.png)
![FreshPath ATL](FreshpathATL/6.png)
![FreshPath ATL](FreshpathATL/7.png)
![FreshPath ATL](FreshpathATL/8.png)

