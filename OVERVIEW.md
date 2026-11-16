Jevgrep gives every agent a `jevgrep` tool for finding code by what it does. An agent asks a question such as "where is authentication checked" and gets back ranked file paths with verbatim excerpts. It is meant for unfamiliar behavior; agents should keep using Grep or `rg` for an exact symbol or regex.

The tool walks the agent's working directory, or a folder the agent names, and asks TypeSafe Jev to score directories and files against the question. It skips version control, dependency, build, and binary files. A search stops after a bounded number of visits and Jev requests and says when the result is incomplete.

## Setup

The daemon needs a TypeSafe API key. Set `TYPESAFE_API_KEY`, or point `TYPESAFE_API_KEY_FILE` at a file holding the key, in the environment the daemon starts in. To use a local OpenJev endpoint instead, set `PASEO_JEV_BASE_URL` to its loopback URL; no key is needed then. Without either, the plugin attaches no tool.

Agents receive the tool only when Paseo tools are enabled for them (`daemon.mcp.injectIntoAgents`, or Settings → Enable Paseo tools), and only for providers whose Paseo tool policy allows it.

## Data

File names and excerpts of the searched folder are sent to the TypeSafe Jev endpoint, `https://api.typesafe.ai/v1/systemone` by default. Nothing else leaves the machine. The key is read from the daemon environment and never reaches the agent.
