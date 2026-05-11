# Solo Operator Cockpit

This is a personal research toolkit for a one-person company. When the user invokes one of the four modes, follow the corresponding prompt template in `prompts/` and save results to `outputs/`.

## Modes and triggers

Recognize these commands (and reasonable variations):

- **Signal Harvester** — triggers: "signal harvester", "run signal on X", "scan X"
  - Template: `prompts/signal-harvester.md`
  - Input: a topic or keywords
  
- **Opportunity Miner** — triggers: "opportunity miner", "mine X", "find opportunities in X"
  - Template: `prompts/opportunity-miner.md`
  - Input: a niche or market
  
- **Daily Briefing** — triggers: "daily briefing", "morning brief", "generate briefing"
  - Template: `prompts/daily-briefing.md`
  - Input: read topics from `topics.md`
  
- **Idea Validator** — triggers: "validate idea", "validator", "go/no-go on X"
  - Template: `prompts/idea-validator.md`
  - Input: a business/product idea description

## Execution rules

1. Always use web search extensively. These modes are useless without real, current data from the web. Do multiple searches to triangulate.

2. Follow the prompt template exactly. Each template specifies structure, tone, and depth.

3. Save every run to `outputs/` with filename format:
   `YYYY-MM-DD-[mode-slug]-[topic-slug].md`
   
   Example: `2026-04-21-signal-ai-agents.md`
   
   Create the `outputs/` folder if it doesn't exist.

4. Each output file should include a header:
   ```
   # [Mode Name]: [Topic]
   
   **Generated:** [ISO timestamp]
   **Query:** [original user input]
   **Sources consulted:** [brief list]
   
   ---
   ```

5. After saving, print a brief summary to the terminal (3-5 lines) with the file path, so the user knows where to find the full output.

6. Be honest, not encouraging. The Idea Validator especially should push back hard if evidence is weak. The user's goal is to avoid wasted effort, not to feel good.

7. Ground everything in evidence from searches. No generic advice. If a search returns weak results, say so rather than padding with filler.

## Tone

- Direct, specific, terse when possible
- No corporate-speak, no hedging clichés
- Treat the user as a sharp operator who wants signal, not reassurance
- When presenting verdicts, commit to a view

## Memory across runs

Before starting a new run, if relevant, check recent files in `outputs/` for context. For example, if the user runs a briefing and there's yesterday's briefing in outputs, note what's changed or new.
