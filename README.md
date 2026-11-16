# paseo-jevgrep-addon

A [Paseo](https://paseo.sh) plugin that gives every agent a `jevgrep` tool: find source by asking what it does, ranked by [TypeSafe](https://typesafe.ai) Jev.

```
jevgrep({ query: "where is the HTTP request to the Jev API sent" })
```

returns ranked paths with verbatim excerpts. Use it when you do not know which file holds a behavior. Keep Grep or `rg` for an exact symbol or regex.

## Requirements

- Paseo 0.16 or newer on the daemon. The plugin has no client part, so the app version does not matter.
- Plugins enabled on the daemon (`pluginsEnabled: true` in `config.json`, or Settings → Plugins).
- Paseo tools enabled for agents (`daemon.mcp.injectIntoAgents: true`, or Settings → Enable Paseo tools).
- A TypeSafe API key in the daemon's environment:
  - `TYPESAFE_API_KEY=<key>`, or
  - `TYPESAFE_API_KEY_FILE=/path/to/key`.

  Alternatively set `PASEO_JEV_BASE_URL` to a loopback OpenJev endpoint, which needs no key.

Without a key or endpoint the plugin loads but attaches no tool.

## Install

```bash
paseo plugin add git:fbettag/paseo-jevgrep-addon --ref v1.0.0
```

Restart the daemon after changing its environment. Open agents pick up the tool before their next idle prompt.

The tool is named `jevgrep`. A daemon that already provides a tool with that name makes session opens fail, so remove any built-in or other `jevgrep` first.

## How it works

The tool walks the agent's working directory, or the `root` folder it passes, breadth first. It asks Jev to score directories and files against the question and descends into the promising ones. Version control, dependency, build, and binary files are skipped. Visits, depth, and Jev requests are bounded, and the result says when a search stopped early.

File names and excerpts of the searched folder go to the Jev endpoint, `https://api.typesafe.ai/v1/systemone` by default. The key file is read on the first search, inside the plugin process, and never reaches the agent.

## Development

```bash
npm install
npm run typecheck
npm test
```

To try a local checkout: `paseo plugin install /absolute/path/to/paseo-jevgrep-addon`.

## License

MIT
