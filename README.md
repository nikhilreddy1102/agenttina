# Agent Tina

## Overview
Agent Tina is a **Generative AI career intelligence platform** that continuously discovers job postings, understands candidate profiles, and produces **explainable, ATS-aware matching insights** using **RAG** and **semantic search**.

## Core Problem
Traditional job platforms rely heavily on:
- Keyword-based matching
- Static filters
- Manual search and tracking

This often leads to:
- Missed opportunities due to lack of semantic understanding
- Poor alignment with ATS evaluation criteria
- Limited visibility into skill gaps and evolving market trends

Agent Tina is being built to **automate job discovery, analysis, and matching** using **AI-driven retrieval, semantic search, and reasoning**, enabling more accurate, explainable, and adaptive career insights.



## What I Am Building
### 1) Job Discovery and Ingestion
Planned ingestion sources include:
- Job postings are discovered from publicly available sources including
company career pages, Greenhouse-powered listings, and search-driven
job URL discovery, then normalized and processed for semantic retrieval.

Each job is normalized into a consistent schema:
- Title, company, location, level, requirements, skills
- Source URL, timestamp, dedupe keys

### 2) Vector Search Layer
Jobs and resumes are converted into **embeddings** and stored for fast semantic retrieval using:
- **Qdrant** (vector database for production workflows)
- **FAISS** (local vector search for experimentation / benchmarking)

### 3) Multi-Agent Workflow
Specialized agents handle separate responsibilities:
- **Resume Parser Agent** – extracts structured profile data
- **Job Parser Agent** – normalizes job content from different sources
- **Matching Agent** – semantic similarity + ranking logic
- **ATS Scoring Agent** – ATS-aligned fit signals
- **Skill Gap Agent** – identifies missing skills and learning targets
- **Dedup Agent** – removes duplicates across sources
- **Alerting Agent** – prepares notification-ready outputs

### 4) RAG Grounding
Agent Tina uses **Retrieval-Augmented Generation (RAG)**:
1. Retrieve relevant jobs/resume context via vector search  
2. Inject retrieved context into prompts  
3. Generate outputs that stay grounded in retrieved evidence  

## Tech Stack
- **Node.js**
- **TypeScript**
- **Azure OpenAI** (LLMs + embeddings)
- **RAG, Prompt Engineering, Agentic AI**
-  **Supabase** (database, auth)
- **Qdrant / FAISS** (vector search)
- **REST APIs**


## Current Focus
- Building ingestion pipelines (Greenhouse + site scanning)
- Defining data schema + dedup strategy
- Improving retrieval quality (ranking, filtering, metadata)
- Adding guardrails for reliability (grounding + validation)

## Design Principles
- **User-first**: outputs must be clear and actionable
- **Grounded**: generation backed by retrieved context
- **Modular**: agents are independent and replaceable
- **Scalable**: designed for continuous job discovery
