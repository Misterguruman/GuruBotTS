# GuruBot - A discord bot written by Misterguruman to do things

## TODO:
- Migrate supabase code to Bun postgres. 
- Add logging solution for writing to disk, and also to webhook.
- Make logs better so this can be used to audit discord activity.
- Make slash command to register webhook per server
- Make memes. 

## ENV
// DISCORDTOKEN
// DISCORDCLIENTID
// LOG_LEVEL

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
